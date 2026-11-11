<?php
// Copy this file to /home/<cpanel user>/squarfinity-data/config.php (NOT inside public_html)
// and fill in your CRM's details. Leave crm_webhook_url empty to switch forwarding off.
return [
    // HTTPS endpoint in your CRM that accepts a new lead as a JSON POST.
    'crm_webhook_url' => 'https://your-crm.example.com/api/leads/inbound',

    // Optional shared secret. When set, each request carries the header
    //   X-Squarfinity-Signature: sha256=<HMAC-SHA256 of the raw body using this secret>
    // so the CRM can reject requests that did not come from the website.
    'crm_webhook_secret' => '',
];
