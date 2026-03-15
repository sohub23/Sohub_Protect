<?php
/**
 * SOHUB Protect — SSLCommerz IPN (Instant Payment Notification)
 * Server-to-server verification of payment status.
 */

header('Content-Type: application/json; charset=utf-8');

error_reporting(0);
ini_set('display_errors', 0);

/* ── Load .env ── */
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            [$key, $value] = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

$storeId = $_ENV['SSL_STORE_ID'] ?? '';
$storePassword = $_ENV['SSL_STORE_PASSWORD'] ?? '';
$isSandbox = ($_ENV['SSL_IS_SANDBOX'] ?? 'false') === 'true';

$tranId = $_POST['tran_id'] ?? '';
$valId = $_POST['val_id'] ?? '';
$amount = $_POST['amount'] ?? '';
$status = $_POST['status'] ?? '';

if (!$tranId || !$valId) {
    echo json_encode(['status' => 'INVALID', 'message' => 'Missing transaction info']);
    exit;
}

// Validate with SSLCommerz
$validationUrl = $isSandbox
    ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
    : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

$validationUrl .= '?val_id=' . urlencode($valId) 
    . '&store_id=' . urlencode($storeId) 
    . '&store_passwd=' . urlencode($storePassword) 
    . '&format=json';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $validationUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

if ($result && in_array(($result['status'] ?? ''), ['VALID', 'VALIDATED'])) {
    // Payment is verified
    // Here you can update your database, send confirmation emails, etc.
    echo json_encode([
        'status' => 'VALID',
        'tran_id' => $tranId,
        'val_id' => $valId,
        'amount' => $result['amount'] ?? $amount,
    ]);
} else {
    echo json_encode([
        'status' => 'INVALID',
        'tran_id' => $tranId,
        'message' => 'Validation failed',
    ]);
}
