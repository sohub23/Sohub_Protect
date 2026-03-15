<?php
/**
 * SOHUB Protect — Payment Initiation API
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(E_ALL);
ini_set('display_errors', 0);

// Global Error Handler
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && ($error['type'] === E_ERROR || $error['type'] === E_PARSE)) {
        echo json_encode(['success' => false, 'error' => 'Fatal PHP Error: ' . $error['message']]);
        exit;
    }
});

try {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Method not allowed");
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
        throw new Exception("Invalid JSON body");
    }

    $gateway = $input['gateway'] ?? '';
    $amount = floatval($input['amount'] ?? 0);
    $orderId = $input['orderId'] ?? ('SP-' . date('Ymd') . '-' . mt_rand(1000, 9999));

    if ($gateway === 'sslcommerz') {
        $storeId = $_ENV['SSL_STORE_ID'] ?? '';
        $storePassword = $_ENV['SSL_STORE_PASSWORD'] ?? '';
        if (!$storeId || !$storePassword) {
            throw new Exception("SSLCommerz credentials missing in .env");
        }

        $apiUrl = ($_ENV['SSL_IS_SANDBOX'] ?? 'false') === 'true'
            ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
            : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

        $postData = [
            'store_id'     => $storeId,
            'store_passwd' => $storePassword,
            'total_amount' => $amount,
            'currency'     => 'BDT',
            'tran_id'      => $orderId,
            'product_category' => 'Security',
            'product_name' => 'Security Kit',
            'product_profile' => 'physical-goods',
            'success_url'  => ($_SERVER['REQUEST_SCHEME'] ?? 'https') . '://' . $_SERVER['HTTP_HOST'] . '/api/payment-callback.php?status=success',
            'fail_url'     => ($_SERVER['REQUEST_SCHEME'] ?? 'https') . '://' . $_SERVER['HTTP_HOST'] . '/api/payment-callback.php?status=fail',
            'cancel_url'   => ($_SERVER['REQUEST_SCHEME'] ?? 'https') . '://' . $_SERVER['HTTP_HOST'] . '/api/payment-callback.php?status=cancel',
            'cus_name'     => $input['customerName'] ?? 'Customer',
            'cus_email'    => $input['customerEmail'] ?? 'no-reply@sohub.com.bd',
            'cus_phone'    => $input['customerPhone'] ?? '017',
            'cus_add1'     => $input['customerAddress'] ?? 'Dhaka',
            'cus_city'     => 'Dhaka',
            'cus_country'  => 'Bangladesh',
            'ship_name'    => $input['customerName'] ?? 'Customer',
            'ship_add1'    => $input['customerAddress'] ?? 'Dhaka',
            'ship_city'    => 'Dhaka',
            'ship_country' => 'Bangladesh',
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            throw new Exception("SSLCommerz Connection Error: " . $curlError);
        }

        $result = json_decode($response, true);
        if (($result['status'] ?? '') === 'SUCCESS' && !empty($result['GatewayPageURL'])) {
            echo json_encode([
                'success' => true,
                'redirectUrl' => $result['GatewayPageURL']
            ]);
        } else {
            throw new Exception("SSLCommerz Session Failed: " . ($result['failedreason'] ?? 'Unknown Error'));
        }
    } else {
        throw new Exception("Invalid Gateway");
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
