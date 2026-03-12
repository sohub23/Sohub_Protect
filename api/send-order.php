<?php
/**
 * SOHUB Protect — Order API
 * Receives order data, generates a beautiful PDF quotation, and sends email
 * via PHPMailer with the PDF attached.
 */

require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

/* ══════════════════════════════════════════════════════════════════
   1. LOAD .env
   ══════════════════════════════════════════════════════════════════ */
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        if (str_contains($line, '=')) {
            [$key, $value] = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

/* ══════════════════════════════════════════════════════════════════
   2. CORS + METHOD CHECK
   ══════════════════════════════════════════════════════════════════ */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

/* ══════════════════════════════════════════════════════════════════
   3. PARSE & VALIDATE REQUEST
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
    echo json_encode(['error' => 'Missing required fields: name, phone, address, and edition are required']);
    exit;
}

/* ══════════════════════════════════════════════════════════════════
   4. PRODUCT IMAGE MAPPING (for PDF)
   ══════════════════════════════════════════════════════════════════ */
$assetsDir = realpath(__DIR__ . '/../src/assets') ?: (__DIR__ . '/../src/assets');

$imageMap = [
    'sp01' => $assetsDir . '/Sp1.png',
    'sp05' => $assetsDir . '/panel-product.png',
    '1'    => $assetsDir . '/Accesories/shutter sensor.jpeg',
    '2'    => $assetsDir . '/Accesories/vivration_sensor.jpeg',
    '3'    => $assetsDir . '/Accesories/door_sensor.jpeg',
    '4'    => $assetsDir . '/Accesories/fire_alarm.jpeg',
    '5'    => $assetsDir . '/Accesories/gas_sensor.jpeg',
    '6'    => $assetsDir . '/Accesories/motion_sensor.jpeg',
    '7'    => $assetsDir . '/Accesories/signal_extender.png',
    '8'    => $assetsDir . '/Accesories/sos_band.jpeg',
    '9'    => $assetsDir . '/Accesories/wireless_siren.png',
    '10'   => $assetsDir . '/Accesories/ai_camera.jpeg',
];

$logoPath = $assetsDir . '/logo-with-icon.png';

/* ══════════════════════════════════════════════════════════════════
   5. ORDER META
   ══════════════════════════════════════════════════════════════════ */
$orderId   = 'SP-' . date('Ymd') . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
$orderDate = date('d M Y, h:i A');
$editionPrice = intval($edition['price'] ?? 0);
$addonTotal   = array_reduce($addons, fn($sum, $a) => $sum + intval($a['price'] ?? 0), 0);

/* ══════════════════════════════════════════════════════════════════
   6. GENERATE PDF QUOTATION
   ══════════════════════════════════════════════════════════════════ */

class SOHUBQuotation extends TCPDF {
    public string $logoPath = '';
    public string $orderId = '';
    public string $orderDate = '';

    public function Header() {
        // Blue header bar
        $this->SetFillColor(24, 144, 255);
        $this->Rect(0, 0, 210, 38, 'F');

        // Logo
        if (file_exists($this->logoPath)) {
            $this->Image($this->logoPath, 15, 6, 45, 0, '', '', '', true, 300, '', false, false, 0);
        }

        // Title text
        $this->SetFont('helvetica', 'B', 20);
        $this->SetTextColor(255, 255, 255);
        $this->SetXY(100, 8);
        $this->Cell(95, 10, 'QUOTATION', 0, 0, 'R');

        // Order info
        $this->SetFont('helvetica', '', 9);
        $this->SetTextColor(220, 240, 255);
        $this->SetXY(100, 18);
        $this->Cell(95, 5, 'Order: ' . $this->orderId, 0, 1, 'R');
        $this->SetX(100);
        $this->Cell(95, 5, 'Date: ' . $this->orderDate, 0, 1, 'R');

        // Accent line
        $this->SetDrawColor(255, 193, 7);
        $this->SetLineWidth(0.8);
        $this->Line(15, 38, 195, 38);

        $this->SetY(42);
    }

    public function Footer() {
        $this->SetY(-30);

        // Divider
        $this->SetDrawColor(24, 144, 255);
        $this->SetLineWidth(0.3);
        $this->Line(15, $this->GetY(), 195, $this->GetY());

        $this->Ln(4);
        $this->SetFont('helvetica', 'B', 8);
        $this->SetTextColor(24, 144, 255);
        $this->Cell(0, 4, 'Solution Hub Technologies (SOHUB)', 0, 1, 'C');

        $this->SetFont('helvetica', '', 7);
        $this->SetTextColor(130, 130, 130);
        $this->Cell(0, 4, 'Phone: 09678-076482  |  Email: hello@sohub.com.bd  |  www.sohubprotect.com', 0, 1, 'C');
        $this->Cell(0, 4, '1 Year Warranty  •  No Monthly Fee  •  Free Technical Support', 0, 1, 'C');

        // Page number
        $this->SetFont('helvetica', '', 7);
        $this->Cell(0, 4, 'Page ' . $this->getAliasNumPage() . ' of ' . $this->getAliasNbPages(), 0, 0, 'C');
    }
}

$pdf = new SOHUBQuotation('P', 'mm', 'A4', true, 'UTF-8');
$pdf->logoPath  = $logoPath;
$pdf->orderId   = $orderId;
$pdf->orderDate = $orderDate;

$pdf->SetCreator('SOHUB Protect');
$pdf->SetAuthor('Solution Hub Technologies');
$pdf->SetTitle('Quotation ' . $orderId);
$pdf->SetMargins(15, 42, 15);
$pdf->SetAutoPageBreak(true, 35);
$pdf->AddPage();

// ── Customer Information Card ──────────────────────────────
$pdf->SetFont('helvetica', 'B', 12);
$pdf->SetTextColor(24, 144, 255);
$pdf->Cell(0, 8, 'Customer Information', 0, 1, 'L');

$pdf->SetFont('helvetica', '', 9);
$pdf->SetTextColor(60, 60, 60);

// Customer info box
$pdf->SetFillColor(245, 248, 255);
$pdf->SetDrawColor(200, 220, 255);
$startY = $pdf->GetY();
$pdf->RoundedRect(15, $startY, 180, 28, 3, '1111', 'DF');

$pdf->SetXY(20, $startY + 3);
$pdf->SetFont('helvetica', 'B', 8);
$pdf->SetTextColor(100, 100, 100);
$pdf->Cell(30, 5, 'Name:', 0, 0);
$pdf->SetFont('helvetica', '', 9);
$pdf->SetTextColor(30, 30, 30);
$pdf->Cell(55, 5, $customerName, 0, 0);
$pdf->SetFont('helvetica', 'B', 8);
$pdf->SetTextColor(100, 100, 100);
$pdf->Cell(30, 5, 'Phone:', 0, 0);
$pdf->SetFont('helvetica', '', 9);
$pdf->SetTextColor(30, 30, 30);
$pdf->Cell(55, 5, $customerPhone, 0, 1);

$pdf->SetX(20);
$pdf->SetFont('helvetica', 'B', 8);
$pdf->SetTextColor(100, 100, 100);
$pdf->Cell(30, 5, 'Email:', 0, 0);
$pdf->SetFont('helvetica', '', 9);
$pdf->SetTextColor(30, 30, 30);
$pdf->Cell(55, 5, $customerEmail ?: 'N/A', 0, 0);
$pdf->SetFont('helvetica', 'B', 8);
$pdf->SetTextColor(100, 100, 100);
$pdf->Cell(30, 5, 'Payment:', 0, 0);
$pdf->SetFont('helvetica', '', 9);
$pdf->SetTextColor(30, 30, 30);
$pdf->Cell(55, 5, $paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery', 0, 1);

$pdf->SetX(20);
$pdf->SetFont('helvetica', 'B', 8);
$pdf->SetTextColor(100, 100, 100);
$pdf->Cell(30, 5, 'Address:', 0, 0);
$pdf->SetFont('helvetica', '', 9);
$pdf->SetTextColor(30, 30, 30);
$pdf->MultiCell(140, 5, $customerAddress, 0, 'L');

if ($customerNote) {
    $pdf->SetX(20);
    $pdf->SetFont('helvetica', 'B', 8);
    $pdf->SetTextColor(100, 100, 100);
    $pdf->Cell(30, 5, 'Note:', 0, 0);
    $pdf->SetFont('helvetica', 'I', 9);
    $pdf->SetTextColor(30, 30, 30);
    $pdf->MultiCell(140, 5, $customerNote, 0, 'L');
}

$pdf->SetY($startY + 32);

// ── Order Details Table ────────────────────────────────────
$pdf->SetFont('helvetica', 'B', 12);
$pdf->SetTextColor(24, 144, 255);
$pdf->Cell(0, 10, 'Order Details', 0, 1, 'L');

// Table Header
$pdf->SetFillColor(24, 144, 255);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetFont('helvetica', 'B', 9);
$pdf->SetDrawColor(24, 144, 255);

$colWidths = [25, 80, 35, 40]; // Image, Product, Unit Price, Subtotal
$pdf->Cell($colWidths[0], 10, '', 1, 0, 'C', true); // Image header
$pdf->Cell($colWidths[1], 10, 'Product', 1, 0, 'L', true);
$pdf->Cell($colWidths[2], 10, 'Unit Price', 1, 0, 'R', true);
$pdf->Cell($colWidths[3], 10, 'Total', 1, 1, 'R', true);

// Edition Row
$pdf->SetTextColor(30, 30, 30);
$pdf->SetFont('helvetica', '', 9);
$pdf->SetFillColor(252, 252, 252);
$pdf->SetDrawColor(230, 230, 230);

$rowY = $pdf->GetY();
$rowH = 22;

// Product image
$editionImgPath = $imageMap[$edition['id']] ?? '';
if (file_exists($editionImgPath)) {
    $pdf->Image($editionImgPath, 17, $rowY + 2, 20, 18, '', '', '', true, 300, '', false, false, 0);
}
$pdf->SetXY(15, $rowY);
$pdf->Cell($colWidths[0], $rowH, '', 1, 0, 'C', true);

$pdf->SetXY(15 + $colWidths[0], $rowY);
$pdf->SetFont('helvetica', 'B', 10);
$pdf->Cell($colWidths[1], 7, $edition['nameBn'] ?? $edition['name'], 0, 1);
$pdf->SetX(15 + $colWidths[0]);
$pdf->SetFont('helvetica', '', 7);
$pdf->SetTextColor(120, 120, 120);
$descText = $edition['desc'] ?? '';
$pdf->MultiCell($colWidths[1] - 5, 4, $descText, 0, 'L');
// Draw border for product cell
$pdf->SetDrawColor(230, 230, 230);
$pdf->Rect(15 + $colWidths[0], $rowY, $colWidths[1], $rowH);

$pdf->SetTextColor(30, 30, 30);
$pdf->SetFont('helvetica', '', 9);
$pdf->SetXY(15 + $colWidths[0] + $colWidths[1], $rowY);
$pdf->Cell($colWidths[2], $rowH, number_format($editionPrice) . ' BDT', 1, 0, 'R', true);
$pdf->SetFont('helvetica', 'B', 9);
$pdf->Cell($colWidths[3], $rowH, number_format($editionPrice) . ' BDT', 1, 1, 'R', true);

// Addon rows
$altRow = true;
foreach ($addons as $addon) {
    $altRow = !$altRow;
    $addonRowH = 18;
    $addonRowY = $pdf->GetY();

    $pdf->SetFont('helvetica', '', 9);
    $pdf->SetTextColor(30, 30, 30);
    $fillColor = $altRow ? [245, 248, 255] : [252, 252, 252];
    $pdf->SetFillColor(...$fillColor);

    // Addon image
    $addonImgPath = $imageMap[$addon['id']] ?? '';
    if (file_exists($addonImgPath)) {
        $pdf->Image($addonImgPath, 18, $addonRowY + 2, 16, 14, '', '', '', true, 300, '', false, false, 0);
    }
    $pdf->SetXY(15, $addonRowY);
    $pdf->Cell($colWidths[0], $addonRowH, '', 1, 0, 'C', true);

    // Product name
    $pdf->SetXY(15 + $colWidths[0], $addonRowY);
    $pdf->SetFont('helvetica', '', 9);
    $addonName = ($addon['nameBn'] ?? '') . ' (' . ($addon['name'] ?? '') . ')';
    $pdf->Cell($colWidths[1], $addonRowH, $addonName, 1, 0, 'L', true);

    // Price
    $addonPrice = intval($addon['price'] ?? 0);
    $pdf->Cell($colWidths[2], $addonRowH, number_format($addonPrice) . ' BDT', 1, 0, 'R', true);
    $pdf->SetFont('helvetica', 'B', 9);
    $pdf->Cell($colWidths[3], $addonRowH, number_format($addonPrice) . ' BDT', 1, 1, 'R', true);
}

// ── Pricing Summary ────────────────────────────────────────
$pdf->Ln(5);
$summaryX = 15 + $colWidths[0] + $colWidths[1]; // Align with price columns
$summaryW = $colWidths[2] + $colWidths[3];

$pdf->SetFont('helvetica', '', 9);
$pdf->SetTextColor(80, 80, 80);

// Subtotal
$pdf->SetX($summaryX - 40);
$pdf->Cell(40, 7, 'Edition:', 0, 0, 'R');
$pdf->Cell($summaryW, 7, number_format($editionPrice) . ' BDT', 0, 1, 'R');

if ($addonTotal > 0) {
    $pdf->SetX($summaryX - 40);
    $pdf->Cell(40, 7, 'Accessories (' . count($addons) . '):', 0, 0, 'R');
    $pdf->Cell($summaryW, 7, number_format($addonTotal) . ' BDT', 0, 1, 'R');
}

$pdf->SetX($summaryX - 40);
$pdf->Cell(40, 7, 'Delivery:', 0, 0, 'R');
$pdf->SetTextColor(24, 144, 255);
$pdf->Cell($summaryW, 7, $deliveryFee === 0 ? 'FREE' : number_format($deliveryFee) . ' BDT', 0, 1, 'R');

// Total line
$pdf->SetDrawColor(24, 144, 255);
$pdf->SetLineWidth(0.5);
$lineY = $pdf->GetY() + 1;
$pdf->Line($summaryX - 40, $lineY, 195, $lineY);
$pdf->Ln(4);

$pdf->SetX($summaryX - 40);
$pdf->SetFont('helvetica', 'B', 13);
$pdf->SetTextColor(24, 144, 255);
$pdf->Cell(40, 10, 'Total:', 0, 0, 'R');
$pdf->SetTextColor(30, 30, 30);
$pdf->Cell($summaryW, 10, number_format($total) . ' BDT', 0, 1, 'R');

// ── Terms & Conditions ─────────────────────────────────────
$pdf->Ln(10);
$pdf->SetFillColor(245, 248, 255);
$termsY = $pdf->GetY();
$pdf->RoundedRect(15, $termsY, 180, 32, 3, '1111', 'DF');

$pdf->SetXY(20, $termsY + 3);
$pdf->SetFont('helvetica', 'B', 10);
$pdf->SetTextColor(24, 144, 255);
$pdf->Cell(0, 6, 'Terms & Conditions', 0, 1);

$pdf->SetFont('helvetica', '', 8);
$pdf->SetTextColor(80, 80, 80);
$terms = [
    '• All products come with 1 year manufacturer warranty.',
    '• No monthly subscription fee required.',
    '• Free technical support and consultation included.',
    '• Delivery within 3-5 business days across Bangladesh.',
    '• Prices are inclusive of all taxes.',
];
foreach ($terms as $term) {
    $pdf->SetX(20);
    $pdf->Cell(0, 4, $term, 0, 1);
}

// Generate PDF string
$pdfContent = $pdf->Output('', 'S');

/* ══════════════════════════════════════════════════════════════════
   7. BUILD EMAIL HTML
   ══════════════════════════════════════════════════════════════════ */

// Build addon rows for email
$addonRowsHtml = '';
foreach ($addons as $addon) {
    $ap = number_format(intval($addon['price'] ?? 0));
    $an = htmlspecialchars($addon['nameBn'] ?? $addon['name'] ?? '');
    $aEn = htmlspecialchars($addon['name'] ?? '');
    $addonRowsHtml .= "
        <tr>
            <td style='padding:12px 16px; border-bottom:1px solid #f0f0f0; color:#333; font-size:14px;'>
                {$an} <span style='color:#999; font-size:12px;'>({$aEn})</span>
            </td>
            <td style='padding:12px 16px; border-bottom:1px solid #f0f0f0; color:#333; font-size:14px; text-align:right; font-weight:600;'>
                {$ap} BDT
            </td>
        </tr>";
}

$editionNameHtml = htmlspecialchars($edition['nameBn'] ?? $edition['name'] ?? '');
$paymentLabel = $paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery';
$deliveryLabel = $deliveryFee === 0 ? '<span style="color:#1890ff; font-weight:700;">FREE</span>' : number_format($deliveryFee) . ' BDT';

$emailHtml = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f4f6f9; font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9; padding:20px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

    <!-- HEADER -->
    <tr>
        <td style="background:#1890ff; padding:35px 30px 30px; text-align:center; border-radius:16px 16px 0 0;">
            <img src="cid:sohub_logo" alt="SOHUB Protect" width="160" style="margin-bottom:15px; max-width:160px;">
            <h1 style="color:#fff; margin:0 0 6px; font-size:24px; font-weight:700; letter-spacing:0.5px;">
                Order Confirmation
            </h1>
            <p style="color:rgba(255,255,255,0.85); margin:0; font-size:14px;">
                Thank you for choosing SOHUB Protect!
            </p>
        </td>
    </tr>

    <!-- ORDER ID BADGE -->
    <tr>
        <td style="background:#fff; padding:0; text-align:center;">
            <div style="display:inline-block; background:#e6f7ff; border:2px solid #91d5ff; padding:10px 28px; border-radius:50px; margin-top:-18px; position:relative;">
                <span style="color:#1890ff; font-weight:700; font-size:14px; letter-spacing:0.5px;">
                    🛡️ {$orderId}
                </span>
            </div>
        </td>
    </tr>

    <!-- BODY -->
    <tr>
        <td style="background:#fff; padding:25px 30px 30px;">

            <!-- Customer Details -->
            <table width="100%" style="background:#f8faff; border-radius:12px; padding:5px; margin-bottom:20px;" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding:18px 20px;">
                        <h3 style="color:#1890ff; margin:0 0 12px; font-size:15px; font-weight:700;">
                            👤 Customer Details
                        </h3>
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="padding:4px 0; color:#888; font-size:13px; width:80px;">Name:</td>
                                <td style="padding:4px 0; color:#333; font-size:13px; font-weight:600;">{$customerName}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0; color:#888; font-size:13px;">Phone:</td>
                                <td style="padding:4px 0; color:#333; font-size:13px; font-weight:600;">{$customerPhone}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0; color:#888; font-size:13px;">Email:</td>
                                <td style="padding:4px 0; color:#333; font-size:13px;">{$customerEmail}</td>
                            </tr>
                            <tr>
                                <td style="padding:4px 0; color:#888; font-size:13px; vertical-align:top;">Address:</td>
                                <td style="padding:4px 0; color:#333; font-size:13px;">{$customerAddress}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Order Details -->
            <h3 style="color:#1890ff; margin:0 0 12px; font-size:15px; font-weight:700;">
                📦 Order Details
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8; border-radius:10px; overflow:hidden; margin-bottom:20px;">
                <tr style="background:#1890ff;">
                    <td style="padding:10px 16px; color:#fff; font-size:13px; font-weight:600;">Product</td>
                    <td style="padding:10px 16px; color:#fff; font-size:13px; font-weight:600; text-align:right;">Price</td>
                </tr>
                <tr style="background:#f0f8ff;">
                    <td style="padding:14px 16px; border-bottom:1px solid #e8e8e8;">
                        <span style="color:#1890ff; font-weight:700; font-size:15px;">{$editionNameHtml}</span><br>
                        <span style="color:#999; font-size:12px;">{$edition['desc']}</span>
                    </td>
                    <td style="padding:14px 16px; border-bottom:1px solid #e8e8e8; text-align:right; font-weight:700; font-size:15px; color:#333;">
                        {$editionPrice} BDT
                    </td>
                </tr>
                {$addonRowsHtml}
            </table>

            <!-- Pricing Summary -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa; border-radius:10px; padding:5px; margin-bottom:20px;">
                <tr>
                    <td style="padding:12px 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="padding:5px 0; color:#666; font-size:13px;">Edition</td>
                                <td style="padding:5px 0; color:#333; font-size:13px; text-align:right;">{$editionPrice} BDT</td>
                            </tr>
HTML;

if ($addonTotal > 0) {
    $emailHtml .= "
                            <tr>
                                <td style='padding:5px 0; color:#666; font-size:13px;'>Accessories (" . count($addons) . ")</td>
                                <td style='padding:5px 0; color:#333; font-size:13px; text-align:right;'>" . number_format($addonTotal) . " BDT</td>
                            </tr>";
}

$emailHtml .= <<<HTML
                            <tr>
                                <td style="padding:5px 0; color:#666; font-size:13px;">Delivery</td>
                                <td style="padding:5px 0; font-size:13px; text-align:right;">{$deliveryLabel}</td>
                            </tr>
                            <tr>
                                <td style="padding:5px 0; color:#666; font-size:13px;">Payment Method</td>
                                <td style="padding:5px 0; color:#333; font-size:13px; text-align:right;">{$paymentLabel}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding:8px 0 0;">
                                    <div style="border-top:2px solid #1890ff; padding-top:10px; display:flex; justify-content:space-between;">
                                        <table width="100%"><tr>
                                            <td style="color:#333; font-size:18px; font-weight:800;">Total</td>
                                            <td style="color:#1890ff; font-size:20px; font-weight:800; text-align:right;">{$total} BDT</td>
                                        </tr></table>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
HTML;

if ($customerNote) {
    $emailHtml .= "
            <table width='100%' style='background:#fff8e6; border-radius:10px; border:1px solid #ffe58f; margin-bottom:20px;' cellpadding='0' cellspacing='0'>
                <tr><td style='padding:14px 20px;'>
                    <strong style='color:#d48806; font-size:13px;'>📝 Customer Note:</strong><br>
                    <span style='color:#666; font-size:13px;'>{$customerNote}</span>
                </td></tr>
            </table>";
}

$emailHtml .= <<<HTML

            <!-- What's Next -->
            <table width="100%" style="background:#e6f7ff; border-radius:12px; border:1px solid #91d5ff;" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding:20px 25px; text-align:center;">
                        <h3 style="color:#1890ff; margin:0 0 8px; font-size:16px;">🚀 What's Next?</h3>
                        <p style="color:#555; margin:0; font-size:13px; line-height:1.6;">
                            Our team will contact you shortly to confirm your order and schedule delivery.<br>
                            For any questions, call us at <strong style="color:#1890ff;">09678-076482</strong>
                        </p>
                    </td>
                </tr>
            </table>

        </td>
    </tr>

    <!-- FOOTER -->
    <tr>
        <td style="background:#1a1a2e; padding:25px 30px; text-align:center; border-radius:0 0 16px 16px;">
            <p style="color:rgba(255,255,255,0.7); margin:0 0 5px; font-size:13px; font-weight:600;">
                Solution Hub Technologies (SOHUB)
            </p>
            <p style="color:rgba(255,255,255,0.45); margin:0 0 8px; font-size:11px;">
                📞 09678-076482 &nbsp;|&nbsp; ✉️ hello@sohub.com.bd &nbsp;|&nbsp; 🌐 sohubprotect.com
            </p>
            <p style="color:rgba(255,255,255,0.3); margin:0; font-size:10px;">
                © 2026 SOHUB. All rights reserved. #SecureYourPeaceOfMind
            </p>
        </td>
    </tr>

</table>
</td></tr>
</table>
</body>
</html>
HTML;

/* ══════════════════════════════════════════════════════════════════
   8. SEND EMAILS VIA PHPMAILER
   ══════════════════════════════════════════════════════════════════ */
try {
    $mail = new PHPMailer(true);

    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SMTP_USER'] ?? '';
    $mail->Password   = $_ENV['SMTP_PASS'] ?? '';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = intval($_ENV['SMTP_PORT'] ?? 587);
    $mail->CharSet    = 'UTF-8';

    // From
    $mail->setFrom($_ENV['SMTP_USER'], 'SOHUB Protect');
    $mail->addReplyTo('hello@sohub.com.bd', 'SOHUB Protect');

    // ── Send to Admin ──
    $adminEmail = $_ENV['ADMIN_EMAIL'] ?? 'hello@sohub.com.bd';
    $mail->addAddress($adminEmail);

    // Embed logo for email
    if (file_exists($logoPath)) {
        $mail->addEmbeddedImage($logoPath, 'sohub_logo', 'sohub-logo.png');
    }

    // Attach PDF
    $pdfFilename = 'SOHUB-Protect-Quotation-' . $orderId . '.pdf';
    $mail->addStringAttachment($pdfContent, $pdfFilename, 'base64', 'application/pdf');

    $mail->isHTML(true);
    $mail->Subject = "🛡️ New Order #{$orderId} — SOHUB Protect ({$edition['name']})";
    $mail->Body    = $emailHtml;
    $mail->AltBody = "New Order {$orderId}\nEdition: {$edition['name']}\nCustomer: {$customerName}\nPhone: {$customerPhone}\nTotal: {$total} BDT";

    $mail->send();

    // ── Send to Customer (if email provided) ──
    if ($customerEmail && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        $mail->clearAddresses();
        $mail->addAddress($customerEmail, $customerName);
        $mail->Subject = "🛡️ Order Confirmation #{$orderId} — SOHUB Protect";
        $mail->send();
    }

    echo json_encode([
        'success' => true,
        'orderId' => $orderId,
        'message' => 'Order submitted successfully! Check your email for the quotation.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error'   => 'Failed to send order email',
        'details' => $mail->ErrorInfo ?? $e->getMessage()
    ]);
}
