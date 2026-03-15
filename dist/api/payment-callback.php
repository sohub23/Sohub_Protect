<?php
/**
 * SOHUB Protect — Payment Callback
 * Handles redirects from SSLCommerz after payment completion.
 * Redirects user back to the website with payment status.
 */

error_reporting(0);
ini_set('display_errors', 0);

// Get status from query param or POST data
$status = $_GET['status'] ?? $_POST['status'] ?? 'unknown';

// SSLCommerz sends data via POST
$tranId = $_POST['tran_id'] ?? $_GET['tran_id'] ?? '';
$valId = $_POST['val_id'] ?? '';

// Determine the frontend redirect URL
$siteUrl = 'https://sohubprotect.com'; // Change in production

// Check if we're in dev mode
if (strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false) {
    $siteUrl = 'http://localhost:8080';
}

// SSLCommerz callback
if ($status === 'success' || strtolower($status) === 'valid') {
    $redirectUrl = $siteUrl . '/?payment=ssl&status=success&tran_id=' . urlencode($tranId) . '&val_id=' . urlencode($valId);
} elseif ($status === 'cancel') {
    $redirectUrl = $siteUrl . '/?payment=ssl&status=cancel';
} else {
    $redirectUrl = $siteUrl . '/?payment=ssl&status=fail';
}

header('Location: ' . $redirectUrl);
exit;
