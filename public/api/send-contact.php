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
            'error' => 'Fatal PHP Error'
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
    if (file_exists(__DIR__ . '/.env')) {
        $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            [$key, $value] = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) throw new Exception("Invalid input");

    $fullName = trim($input['fullName'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $subject = trim($input['subject'] ?? '');
    $businessName = trim($input['businessName'] ?? '');
    $location = trim($input['businessLocation'] ?? '');
    $message = trim($input['message'] ?? '');

    if (!$fullName || !$email || !$phone || !$subject || !$businessName || !$location || !$message) {
        throw new Exception("All fields are mandatory.");
    }

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USER'] ?? '';
    $mail->Password = $_ENV['SMTP_PASS'] ?? '';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = intval($_ENV['SMTP_PORT'] ?? 587);
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($_ENV['SMTP_USER'] ?? 'hello@sohub.com.bd', 'SOHUB Protect');
    $mail->isHTML(true);

    /* ── Admin Email (Google Style) ── */
    $mail->addAddress($_ENV['ADMIN_EMAIL'] ?? 'hello@sohub.com.bd');
    $mail->Subject = "New Partnership Inquiry: {$businessName}";
    
    $adminMailBody = "
    <div style='font-family: \"Google Sans\", Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fa; padding: 40px 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(32,33,36,0.08); border: 1px solid #dadce0;'>
            <div style='padding: 32px;'>
                <div style='color: #1a73e8; font-size: 24px; font-weight: 500; margin-bottom: 24px;'>New Inquiry Received</div>
                <div style='color: #3c4043; font-size: 16px; line-height: 24px; margin-bottom: 32px;'>
                    You have received a new partnership inquiry from the SOHUB Protect portal. Below are the details:
                </div>
                
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #70757a; font-size: 14px; width: 140px;'>Business Name</td><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #3c4043; font-size: 14px; font-weight: 500;'>{$businessName}</td></tr>
                    <tr><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #70757a; font-size: 14px;'>Contact Person</td><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #3c4043; font-size: 14px; font-weight: 500;'>{$fullName}</td></tr>
                    <tr><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #70757a; font-size: 14px;'>Email</td><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #1a73e8; font-size: 14px;'>{$email}</td></tr>
                    <tr><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #70757a; font-size: 14px;'>Phone</td><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #3c4043; font-size: 14px;'>{$phone}</td></tr>
                    <tr><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #70757a; font-size: 14px;'>Location</td><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #3c4043; font-size: 14px;'>{$location}</td></tr>
                    <tr><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #70757a; font-size: 14px;'>Subject</td><td style='padding: 12px 0; border-bottom: 1px solid #f1f3f4; color: #3c4043; font-size: 14px;'>{$subject}</td></tr>
                </table>
                
                <div style='margin-top: 32px;'>
                    <div style='color: #70757a; font-size: 14px; margin-bottom: 8px;'>Message:</div>
                    <div style='color: #3c4043; font-size: 14px; line-height: 22px; background-color: #f8f9fa; padding: 16px; border-radius: 8px;'>{$message}</div>
                </div>
                
                <div style='margin-top: 40px; border-top: 1px solid #f1f3f4; padding-top: 24px;'>
                    <a href='mailto:{$email}' style='display: inline-block; background-color: #1a73e8; color: #ffffff; padding: 10px 24px; border-radius: 4px; text-decoration: none; font-size: 14px; font-weight: 500;'>Reply to Client</a>
                </div>
            </div>
            <div style='background-color: #f1f3f4; padding: 24px 32px; color: #70757a; font-size: 12px; text-align: center;'>
                This is an automated notification from SOHUB Protect Partnership Portal.
            </div>
        </div>
    </div>";
    
    $mail->Body = $adminMailBody;
    $mail->send();

    /* ── User Confirmation Email (Google Style) ── */
    $mail->clearAddresses();
    $mail->addAddress($email, $fullName);
    $mail->Subject = "Inquiry Received: We'll contact you soon";
    
    $userMailBody = "
    <div style='font-family: \"Google Sans\", Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fa; padding: 40px 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(32,33,36,0.08); border: 1px solid #dadce0;'>
            <div style='padding: 32px;'>
                <div style='color: #1a73e8; font-size: 24px; font-weight: 500; margin-bottom: 24px;'>Hello {$fullName},</div>
                <div style='color: #3c4043; font-size: 16px; line-height: 24px; margin-bottom: 24px;'>
                    Thank you for reaching out to SOHUB Protect. We've received your partnership inquiry for <strong>{$businessName}</strong> and our team is already reviewing it.
                </div>
                <div style='color: #3c4043; font-size: 16px; line-height: 24px; margin-bottom: 32px;'>
                    You can expect to hear from one of our partnership specialists within the next 1-2 business days.
                </div>
                
                <div style='background-color: #e8f0fe; border-radius: 8px; padding: 20px; border-left: 4px solid #1a73e8;'>
                    <div style='color: #1a73e8; font-size: 14px; font-weight: 500; margin-bottom: 4px;'>Inquiry Summary</div>
                    <div style='color: #3c4043; font-size: 14px;'>Subject: {$subject}</div>
                </div>
                
                <div style='margin-top: 40px; color: #70757a; font-size: 14px;'>
                    Best regards,<br>
                    <strong>The SOHUB Protect Team</strong>
                </div>
            </div>
            <div style='background-color: #f1f3f4; padding: 24px 32px; color: #70757a; font-size: 12px; text-align: center;'>
                &copy; " . date('Y') . " Solution Hub Technologies. All rights reserved.<br>
                09678-076482 | hello@sohub.com.bd
            </div>
        </div>
    </div>";
    
    $mail->Body = $userMailBody;
    $mail->send();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
