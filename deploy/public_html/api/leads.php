<?php
/*
 * SquarFinity lead endpoint (shared hosting, no Node.js needed).
 * Receives POST JSON { "type": "...", "data": { ... } } from the website forms.
 * Leads are appended to a file OUTSIDE public_html so they cannot be downloaded from the web.
 */
declare(strict_types=1);

const ALLOWED_TYPES = ['consultation', 'audit', 'quote', 'guide', 'contact', 'ad-landing'];
const MAX_FIELD_LENGTH = 2000;
const MAX_BODY_BYTES = 50000;
const NOTIFY_EMAIL = 'aziz@squarfinity.com'; // e.g. 'hello@squarfinity.com' to get an email for each lead; leave empty to skip

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'Request too large']);
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
    respond(400, ['ok' => false, 'error' => 'Invalid request']);
}

$type = $payload['type'] ?? '';
$data = $payload['data'] ?? null;
if (!is_string($type) || !in_array($type, ALLOWED_TYPES, true) || !is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'Invalid lead']);
}

// Honeypot: real visitors never fill this hidden field. Pretend success for bots.
if (!empty($data['hp'])) {
    respond(201, ['ok' => true]);
}

$email = trim((string) ($data['email'] ?? ''));
if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    respond(400, ['ok' => false, 'error' => 'A valid email is required']);
}

$lead = ['id' => bin2hex(random_bytes(8)), 'type' => $type];
foreach ($data as $key => $value) {
    if ($key === 'hp' || !is_scalar($value) || count($lead) >= 30) {
        continue;
    }
    $lead[substr((string) $key, 0, 50)] = substr(trim((string) $value), 0, MAX_FIELD_LENGTH);
}
$lead['receivedAt'] = gmdate('c');

// Store outside every public web root: /home/<user>/squarfinity-data.
// An addon domain's document root sits inside public_html, so walk up past public_html.
$root = rtrim($_SERVER['DOCUMENT_ROOT'] ?? __DIR__, '/');
$pos = strpos($root . '/', '/public_html/');
$base = $pos !== false ? substr($root, 0, $pos) : dirname($root);
$dataDir = $base . '/squarfinity-data';
if (!is_dir($dataDir) && !mkdir($dataDir, 0700, true) && !is_dir($dataDir)) {
    respond(500, ['ok' => false, 'error' => 'Could not save lead']);
}
// Second line of defence in case the folder is ever web-reachable.
if (!is_file($dataDir . '/.htaccess')) {
    @file_put_contents($dataDir . '/.htaccess', "Require all denied\n");
}

$line = json_encode($lead, JSON_UNESCAPED_UNICODE) . "\n";
if (file_put_contents($dataDir . '/leads.ndjson', $line, FILE_APPEND | LOCK_EX) === false) {
    respond(500, ['ok' => false, 'error' => 'Could not save lead']);
}

if (NOTIFY_EMAIL !== '') {
    $host = $_SERVER['HTTP_HOST'] ?? 'squarfinity.com';
    $body = "New lead (" . $type . ")\n\n";
    foreach ($lead as $k => $v) {
        $body .= $k . ': ' . $v . "\n";
    }
    @mail(NOTIFY_EMAIL, 'New SquarFinity lead: ' . $type, $body, 'From: no-reply@' . $host);
}

// Optional CRM forwarding. Settings live in <data folder>/config.php so secrets stay out of the
// website code and survive deploys. See deploy/crm-config.example.php.
$configFile = $dataDir . '/config.php';
$config = is_file($configFile) ? (include $configFile) : [];
$crmUrl = is_array($config) ? ($config['crm_webhook_url'] ?? '') : '';
if (is_string($crmUrl) && preg_match('#^https://#i', $crmUrl) && function_exists('curl_init')) {
    $payload = json_encode(['source' => 'squarfinity.com', 'lead' => $lead], JSON_UNESCAPED_UNICODE);
    $headers = ['Content-Type: application/json'];
    $secret = $config['crm_webhook_secret'] ?? '';
    if (is_string($secret) && $secret !== '') {
        // The CRM can verify this: HMAC-SHA256 of the raw request body, using the shared secret.
        $headers[] = 'X-Squarfinity-Signature: sha256=' . hash_hmac('sha256', $payload, $secret);
    }
    $ch = curl_init($crmUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT => 5,
    ]);
    $result = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($result === false || $status < 200 || $status >= 300) {
        // The lead is already saved and emailed; record the failure so it can be re-sent by hand.
        $note = gmdate('c') . ' lead ' . $lead['id'] . ' status ' . $status . ' ' . curl_error($ch) . "\n";
        @file_put_contents($dataDir . '/crm-failures.log', $note, FILE_APPEND | LOCK_EX);
    }
    curl_close($ch);
}

respond(201, ['ok' => true]);
