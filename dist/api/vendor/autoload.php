<?php
// Intelligent Autoloader for SOHUB Protect
// This file handles loading PHPMailer and TCPDF from various possible directory structures

// Helper function to find a file in multiple possible paths
function require_if_exists($paths) {
    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return true;
        }
    }
    return false;
}

$base = __DIR__;

// 1. Try to load PHPMailer Essential Files
$phpmailerLoaded = require_if_exists([
    $base . '/phpmailer/phpmailer/src/Exception.php',
    $base . '/phpmailer/PHPMailer-6.9.1/src/Exception.php',
    $base . '/phpmailer/src/Exception.php'
]);

if ($phpmailerLoaded) {
    require_if_exists([
        $base . '/phpmailer/phpmailer/src/PHPMailer.php',
        $base . '/phpmailer/PHPMailer-6.9.1/src/PHPMailer.php',
        $base . '/phpmailer/src/PHPMailer.php'
    ]);
    require_if_exists([
        $base . '/phpmailer/phpmailer/src/SMTP.php',
        $base . '/phpmailer/PHPMailer-6.9.1/src/SMTP.php',
        $base . '/phpmailer/src/SMTP.php'
    ]);
}

// 2. Try to load TCPDF
require_if_exists([
    $base . '/tecnickcom/tcpdf/tcpdf.php',
    $base . '/tcpdf/tcpdf.php'
]);

// 3. Fallback to standard Composer autoloader if it exists (for future-proofing)
if (file_exists($base . '/composer/autoload_real.php')) {
    require_once $base . '/composer/autoload_real.php';
}