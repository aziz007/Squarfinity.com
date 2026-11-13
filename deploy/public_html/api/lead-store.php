<?php
/*
 * Shared lead handling for the website's PHP endpoints (forms and the voice agent).
 * Saves each lead outside public_html, emails it, and forwards it to the CRM if configured.
 * This file only defines functions; opening it in a browser does nothing.
 */
declare(strict_types=1);

const SF_NOTIFY_EMAIL = 'aziz@squarfinity.com'; // leave empty to stop lead emails

/** The private data folder: /home/<user>/squarfinity-data (created on first use). */
function sf_data_dir(): ?string
{
    // An addon domain's document root sits inside public_html, so walk up past public_html.
    $root = rtrim($_SERVER['DOCUMENT_ROOT'] ?? __DIR__, '/');
    $pos = strpos($root . '/', '/public_html/');
    $base = $pos !== false ? substr($root, 0, $pos) : dirname($root);
    $dir = $base . '/squarfinity-data';
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        return null;
    }
    // Second line of defence in case the folder is ever web-reachable.
    if (!is_file($dir . '/.htaccess')) {
        @file_put_contents($dir . '/.htaccess', "Require all denied\n");
    }
    return $dir;
}

/** Settings from <data folder>/config.php (CRM webhook, Retell key). Kept out of the website code. */
function sf_config(string $dir): array
{
    $file = $dir . '/config.php';
    $config = is_file($file) ? (include $file) : [];
    return is_array($config) ? $config : [];
}

/**
 * Save, email and forward one lead. Returns false only if it could not be saved.
 * $lead must already be cleaned: flat string values, including 'id' and 'type'.
 */
function sf_deliver_lead(string $dir, array $lead): bool
{
    $line = json_encode($lead, JSON_UNESCAPED_UNICODE) . "\n";
    if (file_put_contents($dir . '/leads.ndjson', $line, FILE_APPEND | LOCK_EX) === false) {
        return false;
    }

    if (SF_NOTIFY_EMAIL !== '') {
        $host = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['HTTP_HOST'] ?? '') ?: 'squarfinity.com';
        $body = 'New lead (' . $lead['type'] . ")\n\n";
        foreach ($lead as $k => $v) {
            $body .= $k . ': ' . $v . "\n";
        }
        $subject = 'New SquarFinity lead: ' . $lead['type'];
        @mail(SF_NOTIFY_EMAIL, $subject, $body, 'From: no-reply@' . $host);
    }

    sf_forward_to_crm($dir, $lead);
    return true;
}

/** Optional CRM forwarding. See deploy/crm-config.example.php. Failures are logged, never fatal. */
function sf_forward_to_crm(string $dir, array $lead): void
{
    $config = sf_config($dir);
    $url = $config['crm_webhook_url'] ?? '';
    if (!is_string($url) || !preg_match('#^https://#i', $url) || !function_exists('curl_init')) {
        return;
    }
    $payload = json_encode(['source' => 'squarfinity.com', 'lead' => $lead], JSON_UNESCAPED_UNICODE);
    $headers = ['Content-Type: application/json'];
    $secret = $config['crm_webhook_secret'] ?? '';
    if (is_string($secret) && $secret !== '') {
        // The CRM can verify this: HMAC-SHA256 of the raw request body, using the shared secret.
        $headers[] = 'X-Squarfinity-Signature: sha256=' . hash_hmac('sha256', $payload, $secret);
    }
    $ch = curl_init($url);
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
        $note = gmdate('c') . ' lead ' . $lead['id'] . ' status ' . $status . ' ' . curl_error($ch) . "\n";
        @file_put_contents($dir . '/crm-failures.log', $note, FILE_APPEND | LOCK_EX);
    }
    curl_close($ch);
}
