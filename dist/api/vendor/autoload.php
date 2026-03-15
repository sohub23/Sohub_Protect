<?php
// Manual autoloader for PHPMailer and TCPDF

// PHPMailer
require_once __DIR__ . '/phpmailer/PHPMailer-6.9.1/src/Exception.php';
require_once __DIR__ . '/phpmailer/PHPMailer-6.9.1/src/PHPMailer.php';
require_once __DIR__ . '/phpmailer/PHPMailer-6.9.1/src/SMTP.php';

// TCPDF
require_once __DIR__ . '/tcpdf/tcpdf.php';