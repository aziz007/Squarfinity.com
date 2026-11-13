<?php
/*
 * SquarFinity lead endpoint (shared hosting, no Node.js needed).
 * Receives POST JSON { "type": "...", "data": { ... } } from the website forms.
 * Leads are saved OUTSIDE public_html, emailed, and forwarded to the CRM (see lead-store.php).
 */
declare(strict_types=1);

require __DIR__ . '/lead-store.php';

const ALLOWED_TYPES = ['consultation', 'audit', 'quote', 'guide', 'contact', 'ad-landing'];
const MAX_FIELD_LENGTH = 2000;
const MAX_BODY_BYTES = 50000;

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

$dataDir = sf_data_dir();
if ($dataDir === null || !sf_deliver_lead($dataDir, $lead)) {
    respond(500, ['ok' => false, 'error' => 'Could not save lead']);
}

respond(201, ['ok' => true]);
