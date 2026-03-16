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

// Determine the frontend redirect URL dynamically
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$siteUrl = $protocol . '://' . $host;

// If we are on localhost, port might be different (e.g. 5173 for Vite)
if (strpos($host, 'localhost') !== false) {
    $siteUrl = 'http://localhost:5173';
}

// SSLCommerz callback
if ($status === 'success' || strtolower($status) === 'valid' || strtolower($status) === 'success') {
    $redirectUrl = $siteUrl . '/?payment=ssl&status=success&tran_id=' . urlencode($tranId) . '&val_id=' . urlencode($valId) . '#order';
} elseif ($status === 'cancel') {
    $redirectUrl = $siteUrl . '/?payment=ssl&status=cancel#order';
} else {
    $redirectUrl = $siteUrl . '/?payment=ssl&status=fail#order';
}

header('Location: ' . $redirectUrl);
exit;
