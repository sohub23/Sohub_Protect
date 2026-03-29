<?php
/**
 * SOHUB Protect — Contact/Partnership API
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(E_ALL);
ini_set('display_errors', 0);

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== NULL && ($error['type'] === E_ERROR || $error['type'] === E_PARSE || $error['type'] === E_COMPILE_ERROR)) {
        echo json_encode([
            'success' => false,
            'error' => 'Fatal PHP Error: ' . $error['message']
        ]);
        exit;
    }
});

try {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    $autoloadFile = __DIR__ . '/vendor/autoload.php';
    if (!file_exists($autoloadFile)) {
        throw new Exception("Vendor autoload not found.");
    }
    require_once $autoloadFile;

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

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Method not allowed");
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        throw new Exception("Invalid JSON body received.");
    }

    $fullName = trim($input['fullName'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $subject = trim($input['subject'] ?? '');
    $location = trim($input['businessLocation'] ?? '');
    $message = trim($input['message'] ?? '');

    if (!$fullName || !$email || !$phone || !$subject || !$location || !$message) {
        throw new Exception("All fields are mandatory.");
    }

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $fromEmail = trim($_ENV['SMTP_USER'] ?? '') ?: 'hello@sohub.com.bd';

    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USER'] ?? '';
    $mail->Password = $_ENV['SMTP_PASS'] ?? '';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = intval($_ENV['SMTP_PORT'] ?? 587);
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($fromEmail, 'SOHUB Protect Partnership');
    $mail->isHTML(true);

    /* ── Admin Email ── */
    $mail->addAddress($_ENV['ADMIN_EMAIL'] ?? 'hello@sohub.com.bd');
    $mail->Subject = "New Partnership Inquiry: {$subject}";
    
    $mail->Body = "
    <div style='font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;'>
        <h2 style='color: #1890ff;'>New Partnership Inquiry</h2>
        <p><strong>Full Name:</strong> {$fullName}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Subject:</strong> {$subject}</p>
        <p><strong>Business Location:</strong> {$location}</p>
        <p><strong>Message:</strong><br>{$message}</p>
    </div>";
    $mail->send();

    /* ── User Confirmation Email ── */
    $mail->clearAddresses();
    $mail->addAddress($email, $fullName);
    $mail->Subject = "We received your inquiry — SOHUB Protect";
    $mail->Body = "
    <div style='font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;'>
        <h2 style='color: #1890ff;'>Hello {$fullName},</h2>
        <p>Thank you for reaching out to SOHUB Protect. We have received your inquiry regarding <strong>'{$subject}'</strong>.</p>
        <p>Our team will get back to you within 1-2 business days.</p>
        <hr>
        <p style='font-size: 12px; color: #666;'>This is an automated confirmation.</p>
    </div>";
    $mail->send();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
