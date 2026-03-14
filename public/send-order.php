<?php
/**
 * SOHUB Protect — Order API (Refined Version)
 */

/* ══════════════════════════════════════════════════════════════════
   1. HEADERS & ERROR HANDLING
   ══════════════════════════════════════════════════════════════════ */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

error_reporting(0);
ini_set('display_errors', 0);

// PING TEST for debugging
if (isset($_GET['test'])) {
    $vExists = file_exists(__DIR__ . '/vendor/autoload.php') || file_exists(__DIR__ . '/api/vendor/autoload.php');
    $eExists = file_exists(__DIR__ . '/.env') || file_exists(__DIR__ . '/api/.env');
    echo json_encode([
        'success' => true,
        'message' => 'PHP is working correctly on your server.',
        'php_version' => PHP_VERSION,
        'vendor_exists' => $vExists,
        'env_exists' => $eExists,
        'script_location' => __DIR__
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ══════════════════════════════════════════════════════════════════
   2. CHECK REQUIRED FILES
   ══════════════════════════════════════════════════════════════════ */
$autoloadFile = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloadFile)) {
    $autoloadFile = __DIR__ . '/api/vendor/autoload.php';
}

if (!file_exists($autoloadFile)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Backend configuration error: PHPMailer or TCPDF is not installed.'
    ]);
    exit;
}
require $autoloadFile;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

/* ══════════════════════════════════════════════════════════════════
   3. LOAD .env
   ══════════════════════════════════════════════════════════════════ */
$envFile = __DIR__ . '/.env';
if (!file_exists($envFile)) {
    $envFile = __DIR__ . '/api/.env';
}

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
    http_response_code(405);
    exit;
}

/* ══════════════════════════════════════════════════════════════════
   4. PARSE & VALIDATE REQUEST
   ══════════════════════════════════════════════════════════════════ */
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

$edition       = $input['edition'] ?? null;
$addons        = $input['addons'] ?? [];
$paymentMethod = $input['paymentMethod'] ?? 'online';
$deliveryFee   = intval($input['deliveryFee'] ?? 0);
$total         = intval($input['total'] ?? 0);
$customer      = $input['customer'] ?? [];

$customerName    = trim($customer['name'] ?? '');
$customerPhone   = trim($customer['phone'] ?? '');
$customerEmail   = trim($customer['email'] ?? '');
$customerAddress = trim($customer['address'] ?? '');
$customerNote    = trim($customer['note'] ?? '');

if (!$edition || !$customerName || !$customerPhone || !$customerAddress) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

/* ══════════════════════════════════════════════════════════════════
   5. ASSETS PATH MAPPING
   ══════════════════════════════════════════════════════════════════ */
$rootUrl = 'https://protect.sohub.com.bd'; // For email logo visibility
$assetsPath = __DIR__ . '/api-assets';
if (!is_dir($assetsPath)) {
    $assetsPath = __DIR__ . '/api/assets';
}

// Absolute paths for TCPDF (PDF generation)
$imageMap = [
    'sp01' => $assetsPath . '/Sp1.png',
    'sp05' => $assetsPath . '/panel-product.png',
    '1'    => $assetsPath . '/Accesories/shutter sensor.jpeg',
    '2'    => $assetsPath . '/Accesories/vivration_sensor.jpeg',
    '3'    => $assetsPath . '/Accesories/door_sensor.jpeg',
    '4'    => $assetsPath . '/Accesories/fire_alarm.jpeg',
    '5'    => $assetsPath . '/Accesories/gas_sensor.jpeg',
    '6'    => $assetsPath . '/Accesories/motion_sensor.jpeg',
    '7'    => $assetsPath . '/Accesories/signal_extender.png',
    '8'    => $assetsPath . '/Accesories/sos_band.jpeg',
    '9'    => $assetsPath . '/Accesories/wireless_siren.png',
    '10'   => $assetsPath . '/Accesories/ai_camera.jpeg',
];

$logoPath = $assetsPath . '/logo-with-icon.png';
$emailLogoUrl = $rootUrl . '/api-assets/logo-with-icon.png'; // Public URL for better email support

/* ══════════════════════════════════════════════════════════════════
   6. PDF GENERATION (TCPDF)
   ══════════════════════════════════════════════════════════════════ */

class SOHUBQuotation extends TCPDF {
    public string $logoPath = '';
    public string $orderId = '';
    public string $orderDate = '';

    public function Header() {
        $this->SetFillColor(24, 144, 255);
        $this->Rect(0, 0, 210, 38, 'F');

        if (file_exists($this->logoPath)) {
            $this->Image($this->logoPath, 15, 6, 45, 0, '', '', '', true, 300, '', false, false, 0);
        }

        $this->SetFont('freeserif', 'B', 20); // Unicode support (Bangla)
        $this->SetTextColor(255, 255, 255);
        $this->SetXY(100, 8);
        $this->Cell(95, 10, 'QUOTATION', 0, 0, 'R');

        $this->SetFont('freeserif', '', 9);
        $this->SetTextColor(220, 240, 255);
        $this->SetXY(100, 18);
        $this->Cell(95, 5, 'Order: ' . $this->orderId, 0, 1, 'R');
        $this->SetX(100);
        $this->Cell(95, 5, 'Date: ' . $this->orderDate, 0, 1, 'R');

        $this->SetDrawColor(255, 193, 7);
        $this->SetLineWidth(0.8);
        $this->Line(15, 38, 195, 38);
        $this->SetY(42);
    }

    public function Footer() {
        $this->SetY(-30);
        $this->SetDrawColor(24, 144, 255);
        $this->SetLineWidth(0.3);
        $this->Line(15, $this->GetY(), 195, $this->GetY());

        $this->Ln(4);
        $this->SetFont('freeserif', 'B', 8);
        $this->SetTextColor(24, 144, 255);
        $this->Cell(0, 4, 'Solution Hub Technologies (SOHUB)', 0, 1, 'C');

        $this->SetFont('freeserif', '', 7);
        $this->SetTextColor(130, 130, 130);
        $this->Cell(0, 4, 'Phone: 09678-076482  |  Email: hello@sohub.com.bd  |  www.sohubprotect.com.bd', 0, 1, 'C');
        $this->Cell(0, 4, '1 Year Warranty  •  No Monthly Fee  •  Free Technical Support', 0, 1, 'C');
        $this->Cell(0, 4, 'Page ' . $this->getAliasNumPage() . ' of ' . $this->getAliasNbPages(), 0, 0, 'C');
    }
}

$orderId   = 'SP-' . date('Ymd') . '-' . mt_rand(1000, 9999);
$orderDate = date('d M Y, h:i A');
$editionPrice = intval($edition['price'] ?? 0);
$addonTotal   = array_reduce($addons, fn($sum, $a) => $sum + intval($a['price'] ?? 0), 0);

$pdf = new SOHUBQuotation('P', 'mm', 'A4', true, 'UTF-8');
$pdf->logoPath  = $logoPath;
$pdf->orderId   = $orderId;
$pdf->orderDate = $orderDate;
$pdf->SetMargins(15, 42, 15);
$pdf->SetAutoPageBreak(true, 35);
$pdf->AddPage();

// Customer Section
$pdf->SetFont('freeserif', 'B', 12);
$pdf->SetTextColor(24, 144, 255);
$pdf->Cell(0, 8, 'Customer Information', 0, 1, 'L');

$pdf->SetFillColor(245, 248, 255);
$pdf->SetDrawColor(200, 220, 255);
$startY = $pdf->GetY();
$pdf->RoundedRect(15, $startY, 180, 28, 3, '1111', 'DF');

$pdf->SetXY(20, $startY + 3);
$pdf->SetFont('freeserif', 'B', 8);
$pdf->SetTextColor(100, 100, 100);
$pdf->Cell(30, 5, 'Name:', 0, 0);
$pdf->SetFont('freeserif', '', 9);
$pdf->SetTextColor(30, 30, 30);
$pdf->Cell(55, 5, $customerName, 0, 0);
$pdf->SetFont('freeserif', 'B', 8);
$pdf->Cell(30, 5, 'Phone:', 0, 0);
$pdf->SetFont('freeserif', '', 9);
$pdf->Cell(55, 5, $customerPhone, 0, 1);

$pdf->SetX(20);
$pdf->SetFont('freeserif', 'B', 8);
$pdf->Cell(30, 5, 'Email:', 0, 0);
$pdf->SetFont('freeserif', '', 9);
$pdf->Cell(55, 5, $customerEmail ?: 'N/A', 0, 0);
$pdf->SetFont('freeserif', 'B', 8);
$pdf->Cell(30, 5, 'Payment:', 0, 0);
$pdf->SetFont('freeserif', '', 9);
$pdf->Cell(55, 5, $paymentMethod, 0, 1);

$pdf->SetX(20);
$pdf->SetFont('freeserif', 'B', 8);
$pdf->Cell(30, 5, 'Address:', 0, 0);
$pdf->SetFont('freeserif', '', 9);
$pdf->MultiCell(140, 5, $customerAddress, 0, 'L');
$pdf->SetY($startY + 32);

// Order Table
$pdf->SetFont('freeserif', 'B', 12);
$pdf->SetTextColor(24, 144, 255);
$pdf->Cell(0, 10, 'Order Details', 0, 1, 'L');

$pdf->SetFillColor(24, 144, 255);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetFont('freeserif', 'B', 9);
$colWidths = [25, 80, 40, 35];
$pdf->Cell($colWidths[0], 10, 'Image', 1, 0, 'C', true);
$pdf->Cell($colWidths[1], 10, 'Product', 1, 0, 'L', true);
$pdf->Cell($colWidths[2], 10, 'Unit Price', 1, 0, 'R', true);
$pdf->Cell($colWidths[3], 10, 'Total', 1, 1, 'R', true);

$pdf->SetTextColor(30, 30, 30);
$pdf->SetFont('freeserif', '', 9);
$pdf->SetFillColor(255, 255, 255);

// Edition Row
$rowY = $pdf->GetY();
$rowH = 22;
$edImg = $imageMap[$edition['id']] ?? '';
if ($edImg && file_exists($edImg)) {
    $pdf->Image($edImg, 17, $rowY + 2, 20, 18);
}
$pdf->SetXY(15, $rowY);
$pdf->Cell($colWidths[0], $rowH, '', 1, 0, 'C');
$pdf->Cell($colWidths[1], $rowH, ($edition['nameBn'] ?? $edition['name']), 1, 0, 'L');
$pdf->Cell($colWidths[2], $rowH, number_format($editionPrice) . ' BDT', 1, 0, 'R');
$pdf->Cell($colWidths[3], $rowH, number_format($editionPrice) . ' BDT', 1, 1, 'R');

// Addon Rows
foreach ($addons as $addon) {
    $rowY = $pdf->GetY();
    $adImg = $imageMap[$addon['id']] ?? '';
    if ($adImg && file_exists($adImg)) {
        $pdf->Image($adImg, 17, $rowY + 2, 20, 14);
    }
    $pdf->SetXY(15, $rowY);
    $pdf->Cell($colWidths[0], 18, '', 1, 0, 'C');
    $pdf->Cell($colWidths[1], 18, ($addon['nameBn'] ?? $addon['name']), 1, 0, 'L');
    $pdf->Cell($colWidths[2], 18, number_format($addon['price']) . ' BDT', 1, 0, 'R');
    $pdf->Cell($colWidths[3], 18, number_format($addon['price']) . ' BDT', 1, 1, 'R');
}

// Summary
$pdf->Ln(5);
$pdf->SetFont('freeserif', 'B', 12);
$pdf->Cell(145, 10, 'Total Amount:', 0, 0, 'R');
$pdf->SetTextColor(24, 144, 255);
$pdf->Cell(35, 10, number_format($total) . ' BDT', 0, 1, 'R');

$pdfContent = $pdf->Output('', 'S');

/* ══════════════════════════════════════════════════════════════════
   7. EMAIL CONSTRUCTION
   ══════════════════════════════════════════════════════════════════ */
$addonRowsHtml = '';
foreach ($addons as $addon) {
    $an = htmlspecialchars($addon['nameBn'] ?? $addon['name'] ?? '');
    $ap = number_format(intval($addon['price'] ?? 0));
    $addonRowsHtml .= "<tr><td style='padding:10px; border-bottom:1px solid #eee;'>{$an}</td><td style='padding:10px; border-bottom:1px solid #eee; text-align:right;'>{$ap} BDT</td></tr>";
}

$emailHtml = <<<HTML
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f6f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #ddd;">
        <div style="background: #1890ff; padding: 30px; text-align: center;">
            <img src="{$emailLogoUrl}" alt="SOHUB Protect" width="150" style="margin-bottom:15px;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">Order Confirmation</h1>
        </div>
        <div style="padding: 30px;">
            <p>Dear <b>{$customerName}</b>,</p>
            <p>Thank you for choosing SOHUB Protect. Your quotation is attached below.</p>
            <table width="100%" style="border-collapse: collapse; margin: 20px 0;">
                <tr style="background: #f8faff;"><td style="padding:10px; border-bottom:1px solid #eee;"><b>{$edition['nameBn']}</b></td><td style="padding:10px; border-bottom:1px solid #eee; text-align:right;"><b>{$editionPrice} BDT</b></td></tr>
                {$addonRowsHtml}
                <tr style="background: #e6f7ff;"><td style="padding:15px; font-size: 18px;"><b>Total</b></td><td style="padding:15px; font-size: 18px; text-align:right; color:#1890ff;"><b>{$total} BDT</b></td></tr>
            </table>
            <p>Our team will contact you at <b>{$customerPhone}</b> soon.</p>
        </div>
    </div>
</body>
</html>
HTML;

$adminHtml = <<<HTML
<!DOCTYPE html>
<html>
<body>
    <div style="font-family: Arial; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #1890ff;">New Order: #{$orderId}</h2>
        <p><b>Customer:</b> {$customerName}</p>
        <p><b>Phone:</b> {$customerPhone}</p>
        <p><b>Address:</b> {$customerAddress}</p>
        <p><b>Total:</b> {$total} BDT</p>
        <p>Please find the attached quotation for details.</p>
    </div>
</body>
</html>
HTML;

/* ══════════════════════════════════════════════════════════════════
   8. SEND EMAILS
   ══════════════════════════════════════════════════════════════════ */
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SMTP_USER'] ?? '';
    $mail->Password   = $_ENV['SMTP_PASS'] ?? '';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = intval($_ENV['SMTP_PORT'] ?? 587);
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($_ENV['SMTP_USER'], 'SOHUB Protect');
    $mail->addReplyTo('hello@sohub.com.bd', 'SOHUB Protect');

    $pdfName = "SOHUB-Quotation-{$orderId}.pdf";

    // ── ADMIN EMAIL ──
    $mail->addAddress($_ENV['ADMIN_EMAIL'] ?? 'hello@sohub.com.bd');
    $mail->isHTML(true);
    $mail->Subject = "🚨 New Order Request #{$orderId}";
    $mail->Body    = $adminHtml;
    $mail->addStringAttachment($pdfContent, $pdfName);
    $mail->send();

    // ── CUSTOMER EMAIL ──
    if ($customerEmail && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        $mail->clearAddresses();
        // Attachment is already added, no need to clear/re-add unless we want different name
        $mail->addAddress($customerEmail, $customerName);
        $mail->Subject = "🛡️ Order Confirmation #{$orderId} — SOHUB Protect";
        $mail->Body    = $emailHtml;
        $mail->send();
    }

    echo json_encode(['success' => true, 'orderId' => $orderId]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $mail->ErrorInfo]);
}
