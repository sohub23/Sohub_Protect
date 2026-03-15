<?php
/**
 * SOHUB Protect — Payment Initiation API
 * Supports: SSLCommerz
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(0);
ini_set('display_errors', 0);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

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

/* ── Parse Request ── */
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON body']);
    exit;
}

$gateway = $input['gateway'] ?? ''; // 'sslcommerz'
$amount = floatval($input['amount'] ?? 0);
$orderId = $input['orderId'] ?? ('SP-' . date('Ymd') . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT));
$customerName = trim($input['customerName'] ?? '');
$customerEmail = trim($input['customerEmail'] ?? '');
$customerPhone = trim($input['customerPhone'] ?? '');
$customerAddress = trim($input['customerAddress'] ?? '');

if ($amount <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid amount']);
    exit;
}

// Determine base URL for callbacks
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'sohubprotect.com';
$baseUrl = $protocol . '://' . $host;

// Use custom callback URL if provided
$callbackBase = $input['callbackBase'] ?? $baseUrl;

/* ══════════════════════════════════════════════════════════════════
   SSLCommerz Payment
   ══════════════════════════════════════════════════════════════════ */
if ($gateway === 'sslcommerz') {
    $storeId = $_ENV['SSL_STORE_ID'] ?? '';
    $storePassword = $_ENV['SSL_STORE_PASSWORD'] ?? '';
    $isSandbox = ($_ENV['SSL_IS_SANDBOX'] ?? 'false') === 'true';

    if (!$storeId || !$storePassword) {
        echo json_encode([
            'success' => false,
            'error' => 'SSLCommerz credentials not found in api/.env. Please configure them.'
        ]);
        exit;
    }

    $apiUrl = $isSandbox
        ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
        : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

    $postData = [
        'store_id'     => $storeId,
        'store_passwd' => $storePassword,
        'total_amount' => $amount,
        'currency'     => 'BDT',
        'tran_id'      => $orderId,
        'product_category' => 'Security System',
        'product_name' => 'SOHUB Protect Security Kit',
        'product_profile' => 'physical-goods',

        'success_url'  => $callbackBase . '/api/payment-callback.php?status=success',
        'fail_url'     => $callbackBase . '/api/payment-callback.php?status=fail',
        'cancel_url'   => $callbackBase . '/api/payment-callback.php?status=cancel',
        'ipn_url'      => $callbackBase . '/api/payment-ipn.php',

        'cus_name'     => $customerName ?: 'Customer',
        'cus_email'    => $customerEmail ?: 'no-reply@sohubprotect.com',
        'cus_phone'    => $customerPhone ?: '01700000000',
        'cus_add1'     => $customerAddress ?: 'Dhaka',
        'cus_city'     => 'Dhaka',
        'cus_state'    => 'Dhaka',
        'cus_country'  => 'Bangladesh',
        'cus_postcode' => '1200',

        'shipping_method' => 'Courier',
        'ship_name'    => $customerName ?: 'Customer',
        'ship_add1'    => $customerAddress ?: 'Dhaka',
        'ship_city'    => 'Dhaka',
        'ship_state'   => 'Dhaka',
        'ship_country' => 'Bangladesh',
        'ship_postcode' => '1200',

        'multi_card_name' => 'visacard,mastercard,amexcard,internetbank,mobilebank,othercard',
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        echo json_encode(['success' => false, 'error' => 'SSLCommerz connection failed: ' . $curlError]);
        exit;
    }

    $result = json_decode($response, true);

    if (!$result) {
        echo json_encode(['success' => false, 'error' => 'Invalid response from SSLCommerz']);
        exit;
    }

    if (($result['status'] ?? '') === 'SUCCESS' && !empty($result['GatewayPageURL'])) {
        echo json_encode([
            'success' => true,
            'gateway' => 'sslcommerz',
            'redirectUrl' => $result['GatewayPageURL'],
            'sessionKey' => $result['sessionkey'] ?? '',
            'tranId' => $orderId,
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => $result['failedreason'] ?? 'SSLCommerz session creation failed',
            'details' => $result,
        ]);
    }
    exit;
}

/* ── Unknown Gateway ── */
echo json_encode(['success' => false, 'error' => 'Payment gateway disabled or unknown.']);
