<?php
/*
 * Retell AI webhook: turns each finished voice-agent call into a lead.
 * Set this URL as the agent's webhook in the Retell dashboard:
 *   https://squarfinity.com/api/retell-webhook.php
 * Only "call_analyzed" is used (it carries the summary and the extracted caller details).
 * Requests are verified with the X-Retell-Signature header and the Retell API key stored in
 * <data folder>/config.php as 'retell_api_key' (use the key marked "webhook" in Retell).
 */
declare(strict_types=1);

require __DIR__ . '/lead-store.php';

const MAX_BODY_BYTES = 2000000;   // call payloads include the full transcript
const MAX_SIGNATURE_AGE_MS = 300000; // reject signatures older than 5 minutes
const MAX_TRANSCRIPT_CHARS = 20000;

function done(int $code): void
{
    http_response_code($code);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    done(405);
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || $raw === '' || strlen($raw) > MAX_BODY_BYTES) {
    done(413);
}

$dir = sf_data_dir();
if ($dir === null) {
    done(500);
}
$apiKey = sf_config($dir)['retell_api_key'] ?? '';
if (!is_string($apiKey) || $apiKey === '') {
    done(503); // not configured yet
}

// Signature format: v={unix_ms_timestamp},d={hex HMAC-SHA256 of raw_body + timestamp, keyed with the API key}
$signature = $_SERVER['HTTP_X_RETELL_SIGNATURE'] ?? '';
if (!preg_match('/^v=(\d+),d=([a-f0-9]+)$/i', $signature, $m)) {
    done(401);
}
$timestamp = $m[1];
$age = abs((int) round(microtime(true) * 1000) - (int) $timestamp);
$expected = hash_hmac('sha256', $raw . $timestamp, $apiKey);
if ($age > MAX_SIGNATURE_AGE_MS || !hash_equals($expected, strtolower($m[2]))) {
    done(401);
}

$payload = json_decode($raw, true);
if (!is_array($payload) || !is_array($payload['call'] ?? null)) {
    done(400);
}
if (($payload['event'] ?? '') !== 'call_analyzed') {
    done(204); // other events are acknowledged and ignored
}

$call = $payload['call'];
$callId = preg_replace('/[^A-Za-z0-9_\-]/', '', (string) ($call['call_id'] ?? ''));
if ($callId === '') {
    done(400);
}

// Retell may deliver the same event more than once: process each call only once.
$seenFile = $dir . '/voice-calls-processed.txt';
$seen = is_file($seenFile) ? file($seenFile, FILE_IGNORE_NEW_LINES) : [];
if (in_array($callId, $seen ?: [], true)) {
    done(204);
}

$analysis = is_array($call['call_analysis'] ?? null) ? $call['call_analysis'] : [];
$extracted = is_array($analysis['custom_analysis_data'] ?? null) ? $analysis['custom_analysis_data'] : [];

$clean = static function ($value, int $max = 2000): string {
    if (is_bool($value)) {
        return $value ? 'yes' : 'no';
    }
    return is_scalar($value) ? substr(trim((string) $value), 0, $max) : '';
};

$lead = ['id' => 'voice_' . substr($callId, -24), 'type' => 'voice-call'];
foreach (['caller_name' => 'name', 'caller_email' => 'email', 'caller_phone' => 'phone', 'company' => 'company',
          'need' => 'process', 'service_interest' => 'service', 'timeline' => 'timeline',
          'wants_assessment' => 'wants_assessment'] as $from => $to) {
    $value = $clean($extracted[$from] ?? '');
    if ($value !== '') {
        $lead[$to] = $value;
    }
}
if (isset($lead['email']) && filter_var($lead['email'], FILTER_VALIDATE_EMAIL) === false) {
    $lead['email_as_heard'] = $lead['email']; // spoken emails are often misheard: keep it, but flag it
    unset($lead['email']);
}
$lead['summary'] = $clean($analysis['call_summary'] ?? '');
$lead['sentiment'] = $clean($analysis['user_sentiment'] ?? '', 50);
$durationMs = (int) ($call['duration_ms'] ?? 0);
$lead['duration'] = $durationMs > 0 ? gmdate('i:s', intdiv($durationMs, 1000)) : '';
$lead['page'] = $clean($call['metadata']['page'] ?? '', 200);
$lead['call_id'] = $callId;
$lead['transcript'] = $clean($call['transcript'] ?? '', MAX_TRANSCRIPT_CHARS);
$lead['receivedAt'] = gmdate('c');
$lead = array_filter($lead, static fn ($v) => $v !== '');

// Skip empty calls (visitor connected and hung up without speaking).
if (!isset($lead['transcript']) && !isset($lead['name']) && !isset($lead['email']) && !isset($lead['phone'])) {
    @file_put_contents($seenFile, $callId . "\n", FILE_APPEND | LOCK_EX);
    done(204);
}

if (!sf_deliver_lead($dir, $lead)) {
    done(500); // Retell retries on failure
}
@file_put_contents($seenFile, $callId . "\n", FILE_APPEND | LOCK_EX);
done(204);
