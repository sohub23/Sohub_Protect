<?php
/**
 * SOHUB Protect — Order API
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Temporarily enable error display for debugging if needed, but for now we catch them
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Global Error Handler to catch fatal errors and return JSON
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== NULL && ($error['type'] === E_ERROR || $error['type'] === E_PARSE || $error['type'] === E_COMPILE_ERROR)) {
        echo json_encode([
            'success' => false,
            'error' => 'Fatal PHP Error: ' . $error['message'],
            'file' => $error['file'],
            'line' => $error['line']
        ]);
        exit;
    }
});

try {
    // PING TEST for debugging
    if (isset($_GET['test'])) {
        echo json_encode([
            'success' => true,
            'message' => 'PHP API is reachable',
            'php_version' => PHP_VERSION,
            'vendor_exists' => file_exists(__DIR__ . '/vendor/autoload.php'),
            'env_exists' => file_exists(__DIR__ . '/.env'),
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown'
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
        echo json_encode([
            'success' => false,
            'error' => 'Backend Error: "vendor" folder not found. Please upload PHPMailer/TCPDF dependencies inside your "api" directory.'
        ]);
        exit;
    }
    require_once $autoloadFile;

    /* ── Imports ── */
    // Using full namespaces to avoid any "not found" issues if 'use' fails
    // TCPDF is usually a global class when loaded via composer
    if (!class_exists('TCPDF')) {
        throw new Exception("TCPDF class not found. Check vendor installation.");
    }
    if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        throw new Exception("PHPMailer class not found. Check vendor installation.");
    }

    /* ── Load .env ── */
    $envFile = __DIR__ . '/.env';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0)
                continue;
            if (strpos($line, '=') !== false) {
                [$key, $value] = explode('=', $line, 2);
                $_ENV[trim($key)] = trim($value);
            }
        }
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }

    /* ── Parse Request ── */
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        throw new Exception("Invalid JSON body received.");
    }

    $edition = $input['edition'] ?? null;
    $addons = $input['addons'] ?? [];
    $paymentMethod = $input['paymentMethod'] ?? 'online';
    $deliveryFee = intval($input['deliveryFee'] ?? 0);
    $total = intval($input['total'] ?? 0);
    $customer = $input['customer'] ?? [];

    $customerName = trim($customer['name'] ?? '');
    $customerPhone = trim($customer['phone'] ?? '');
    $customerEmail = trim($customer['email'] ?? '');
    $customerAddress = trim($customer['address'] ?? '');
    $customerNote = trim($customer['note'] ?? '');

    if (!$edition || !$customerName || !$customerPhone || !$customerAddress) {
        throw new Exception("Missing required fields: name, phone, address, and edition are required");
    }

    /* ── PDF Preparation ── */
    $assetsDir = __DIR__ . '/assets';
    $imageMap = [
        'sp01' => $assetsDir . '/afford_trans.jpeg',
        'sp05' => $assetsDir . '/pro_trans.jpeg',
        '1' => $assetsDir . '/Accesories/shutter sensor.jpeg',
        '2' => $assetsDir . '/Accesories/vivration_sensor.jpeg',
        '3' => $assetsDir . '/Accesories/door_sensor.jpeg',
        '4' => $assetsDir . '/Accesories/fire_alarm.jpeg',
        '5' => $assetsDir . '/Accesories/gas_sensor.jpeg',
        '6' => $assetsDir . '/Accesories/motion_sensor.jpeg',
        '7' => $assetsDir . '/Accesories/signal_extender.png',
        '8' => $assetsDir . '/Accesories/sos_band.jpeg',
        '9' => $assetsDir . '/Accesories/wireless_siren.png',
        '10' => $assetsDir . '/Accesories/ai_camera.jpeg',
    ];
    $logoCandidates = [
        // Prioritize white logos since header background is solid blue
        $assetsDir . '/logo-white.png',
        __DIR__ . '/../api-assets/logo-white.png',
        __DIR__ . '/../logo.png',                 // Try root public folder for navbar logo
        __DIR__ . '/../assets/logo.png',          // Try root assets folder
        $assetsDir . '/logo-with-icon.png',
        __DIR__ . '/../api-assets/logo-with-icon.png',
        $assetsDir . '/logo-white.png',
        __DIR__ . '/../api-assets/logo-white.png',
    ];
    $logoPath = '';
    foreach ($logoCandidates as $candidate) {
        $resolved = realpath($candidate);
        if ($resolved && file_exists($resolved)) {
            $logoPath = $resolved;
            break;
        }
    }
    $orderId = 'SP-' . date('Ymd') . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
    $orderDate = date('d M Y, h:i A');
    $editionPrice = intval($edition['price'] ?? 0);
    $addonTotal = array_reduce($addons, fn($sum, $a) => $sum + intval($a['price'] ?? 0), 0);
    $totalQuantity = 1;
    foreach ($addons as $addon) {
        $totalQuantity += intval($addon['quantity'] ?? 1);
    }

    // PDF Class Definition
    class SOHUBQuotation extends TCPDF
    {
        public string $logoPath = '';
        public string $orderId = '';
        public string $orderDate = '';

        public function Header()
        {
            $this->SetFillColor(24, 144, 255);
            $this->Rect(0, 0, 210, 38, 'F');

            // LOGO (Use resolved path from caller)
            $logoPath = $this->logoPath;
            if ($logoPath && file_exists($logoPath)) {
                $ext = strtolower(pathinfo($logoPath, PATHINFO_EXTENSION));
                $imgType = ($ext === 'png') ? 'PNG' : (($ext === 'jpg') ? 'JPG' : (($ext === 'jpeg') ? 'JPEG' : ''));
                $this->Image($logoPath, 15, 6, 42, 0, $imgType, '', 'T', false, 300, '', false, false, 0);
                // Simplified Image call to let TCPDF autodetect the format properly
                $this->Image($logoPath, 15, 6, 42);
            }

            $this->SetFont('helvetica', 'B', 20);
            $this->SetTextColor(255, 255, 255);
            $this->SetXY(100, 8);
            $this->Cell(95, 10, 'QUOTATION', 0, 0, 'R');

            $this->SetFont('helvetica', '', 9);
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

        public function Footer()
        {
            $this->SetY(-30);
            $this->SetDrawColor(24, 144, 255);
            $this->SetLineWidth(0.3);
            $this->Line(15, $this->GetY(), 195, $this->GetY());
            $this->Ln(4);
            $this->SetFont('helvetica', 'B', 8);
            $this->SetTextColor(24, 144, 255);
            $this->Cell(0, 4, 'Solution Hub Technologies (SOHUB)', 0, 1, 'C');
            $this->SetFont('helvetica', '', 7);
            $this->SetTextColor(130, 130, 130);
            $this->Cell(0, 4, 'Phone: 09678-076482  |  Email: hello@sohub.com.bd  |  protect.sohub.com.bd', 0, 1, 'C');
            $this->Cell(0, 4, '1 Year Warranty  •  No Monthly Fee  •  Free Technical Support', 0, 1, 'C');
            $this->SetY(-10);
            $this->SetFont('helvetica', '', 7);
            $this->Cell(0, 4, 'Page ' . $this->getAliasNumPage() . ' of ' . $this->getAliasNbPages(), 0, 0, 'C');
        }
    }

    $pdf = new SOHUBQuotation('P', 'mm', 'A4', true, 'UTF-8');
    $pdf->orderId = $orderId;
    $pdf->orderDate = $orderDate;
    $pdf->logoPath = $logoPath;
    $pdf->SetCreator('SOHUB Protect');
    $pdf->SetTitle('Quotation ' . $orderId);
    $pdf->SetMargins(15, 42, 15);
    $pdf->SetAutoPageBreak(true, 35);
    $pdf->AddPage();

    // Customer Info Card
    $pdf->SetFont('helvetica', 'B', 12);
    $pdf->SetTextColor(24, 144, 255);
    $pdf->Cell(0, 8, 'Customer Information', 0, 1, 'L');
    $pdf->SetFont('helvetica', '', 9);
    $pdf->SetFillColor(245, 248, 255);
    $pdf->SetDrawColor(200, 220, 255);
    $startY = $pdf->GetY();
    $pdf->RoundedRect(15, $startY, 180, 28, 3, '1111', 'DF');
    $pdf->SetTextColor(0, 0, 0); // Customer info text should be black
    $pdf->SetXY(20, $startY + 3);
    $pdf->Cell(30, 5, 'Name:', 0, 0);
    $pdf->Cell(55, 5, $customerName, 0, 0);
    $pdf->Cell(30, 5, 'Phone:', 0, 0);
    $pdf->Cell(55, 5, $customerPhone, 0, 1);
    $pdf->SetX(20);
    $pdf->Cell(30, 5, 'Email:', 0, 0);
    $pdf->Cell(55, 5, $customerEmail ?: 'N/A', 0, 0);
    $pdf->Cell(30, 5, 'Payment:', 0, 0);
    $pdf->Cell(55, 5, $paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery', 0, 1);
    $pdf->SetX(20);
    $pdf->Cell(30, 5, 'Address:', 0, 0);
    $pdf->MultiCell(140, 5, $customerAddress, 0, 'L');
    $pdf->SetY($startY + 32);

    // Order Table Header
    $pdf->SetFont('helvetica', 'B', 12);
    $pdf->SetTextColor(24, 144, 255);
    $pdf->Cell(0, 10, 'Order Details', 0, 1, 'L');
    $pdf->SetFillColor(24, 144, 255);
    $pdf->SetTextColor(255, 255, 255);
    $colWidths = [25, 65, 20, 35, 35]; // Total 180
    $pdf->Cell($colWidths[0], 10, 'Image', 1, 0, 'C', true);
    $pdf->Cell($colWidths[1], 10, 'Product', 1, 0, 'L', true);
    $pdf->Cell($colWidths[2], 10, 'Qty', 1, 0, 'C', true);
    $pdf->Cell($colWidths[3], 10, 'Unit Price', 1, 0, 'C', true);
    $pdf->Cell($colWidths[4], 10, 'Total', 1, 1, 'C', true);

    // Row drawing function for No-Break logic
    $drawRow = function ($pdf, $img, $name, $desc, $qty, $price, $total, $colWidths, $imageMap) {
        $rowHeight = 22;
        // Check for page break
        if ($pdf->GetY() + $rowHeight > $pdf->getPageHeight() - 35) {
            $pdf->AddPage();
            // Redraw table header on new page
            $pdf->SetFillColor(24, 144, 255);
            $pdf->SetTextColor(255, 255, 255);
            $pdf->SetFont('helvetica', 'B', 10);
            $pdf->Cell($colWidths[0], 10, 'Image', 1, 0, 'C', true);
            $pdf->Cell($colWidths[1], 10, 'Product', 1, 0, 'L', true);
            $pdf->Cell($colWidths[2], 10, 'Qty', 1, 0, 'C', true);
            $pdf->Cell($colWidths[3], 10, 'Unit Price', 1, 0, 'C', true);
            $pdf->Cell($colWidths[4], 10, 'Total', 1, 1, 'C', true);
        }

        $y = $pdf->GetY();
        $pdf->SetTextColor(30, 30, 30);

        // Col 0: Image
        if ($img && file_exists($img)) {
            $pdf->Image($img, 17, $y + 2, 20, 18, '', '', 'T', true, 300, '', false, false, 0);
        }
        $pdf->SetXY(15, $y);
        $pdf->Cell($colWidths[0], $rowHeight, '', 1, 0, 'C');

        // Col 1: Name & Desc
        $pdf->SetXY(15 + $colWidths[0], $y);
        $pdf->Rect(15 + $colWidths[0], $y, $colWidths[1], $rowHeight);
        $pdf->SetFont('helvetica', 'B', 9);
        $pdf->SetXY(15 + $colWidths[0] + 2, $y + 4);
        $pdf->Cell($colWidths[1] - 4, 6, $name, 0, 1);
        $pdf->SetFont('helvetica', '', 7);
        $pdf->SetX(15 + $colWidths[0] + 2);
        $pdf->MultiCell($colWidths[1] - 4, 3, $desc, 0, 'L');

        // Col 2: Qty
        $pdf->SetXY(15 + $colWidths[0] + $colWidths[1], $y);
        $pdf->SetFont('helvetica', '', 9);
        $pdf->Cell($colWidths[2], $rowHeight, $qty, 1, 0, 'C');

        // Col 3 & 4: Prices
        $pdf->SetXY(15 + $colWidths[0] + $colWidths[1] + $colWidths[2], $y);
        $pdf->SetFont('helvetica', '', 9);
        $pdf->Cell($colWidths[3], $rowHeight, number_format($price) . ' BDT', 1, 0, 'C');
        $pdf->SetFont('helvetica', 'B', 9);
        $pdf->Cell($colWidths[4], $rowHeight, number_format($total) . ' BDT', 1, 1, 'C');
    };

    // Draw Edition Row (Quantity is always 1)
    $editionImgPath = $imageMap[$edition['id']] ?? '';
    $drawRow($pdf, $editionImgPath, $edition['name'], $edition['desc'], 1, $editionPrice, $editionPrice, $colWidths, $imageMap);

    // Draw Addon Rows
    foreach ($addons as $addon) {
        $addonImg = $imageMap[$addon['id']] ?? '';
        $qty = intval($addon['quantity'] ?? 1);
        $price = intval($addon['price'] ?? 0);
        $rowTotal = $price * $qty;
        $drawRow($pdf, $addonImg, $addon['name'], '', $qty, $price, $rowTotal, $colWidths, $imageMap);
    }

    // Total Quantity Row
    // Summary Row (Grand Total & Total Quantity in one row)
    $pdf->SetFont('helvetica', 'B', 10);
    $pdf->SetFillColor(245, 248, 255);
    $pdf->SetTextColor(30, 30, 30);
    $pdf->Cell($colWidths[0] + $colWidths[1], 10, '', 1, 0, 'C', true);
    $pdf->Cell($colWidths[2] + $colWidths[3], 10, 'Total Quantity', 1, 0, 'C', true);
    $pdf->Cell($colWidths[4], 10, $totalQuantity, 1, 1, 'C', true);

    // Grand Total Row
    $pdf->SetFont('helvetica', 'B', 10);
    $pdf->SetFillColor(245, 248, 255);
    // Empty space for Image + Product
    $pdf->Cell($colWidths[0] + $colWidths[1], 10, '', 1, 0, 'C', true);
    // 'Grand Total' label centered in Qty + Unit Price columns
    $pdf->Cell($colWidths[2] + $colWidths[3], 10, 'Grand Total', 1, 0, 'C', true);
    
    // Empty space + "Grand Total" label (Col 0 + 1)
    $pdf->Cell($colWidths[0] + $colWidths[1], 10, 'Grand Total', 1, 0, 'R', true);
    // Total Qty exactly under Qty column (Col 2)
    $pdf->Cell($colWidths[2], 10, $totalQuantity, 1, 0, 'C', true);
    // Empty space for Unit Price (Col 3)
    $pdf->Cell($colWidths[3], 10, '', 1, 0, 'C', true);
    // Grand Total exactly under Total column (Col 4)
    $pdf->SetTextColor(24, 144, 255);
    $totalAmount = floatval($total);
    $pdf->Cell($colWidths[4], 10, number_format($totalAmount) . ' BDT', 1, 1, 'C', true);

    $pdfContent = $pdf->Output('', 'S');

    // PHPMailer Configuration
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
    $mail->setFrom($fromEmail, 'SOHUB Protect');
    
    // Add PDF Attachment (for both emails)
    $mail->addStringAttachment($pdfContent, 'Quotation-' . $orderId . '.pdf', 'base64', 'application/pdf');
    $mail->isHTML(true);

    /* ── Send Admin Email ── */
    $mail->addAddress($_ENV['ADMIN_EMAIL'] ?? 'hello@sohub.com.bd');
    $mail->Subject = "New Order Recieved: #{$orderId}";

    $editionName = $edition['name'] ?? 'SOHUB Protect';
    $paymentLabel = ($paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery');

    $mail->Body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-top: 4px solid #1890ff; border-radius: 8px; padding: 30px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);'>
        <h2 style='color: #1890ff; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; font-size: 22px;'>
            <span style='font-size: 24px;'>🛡️</span> New Order Received
        </h2>
        <hr style='border: 0; border-top: 1px solid #eee; margin-bottom: 25px;'>
        <div style='color: #333; line-height: 1.8; font-size: 15px;'>
            <p style='margin-bottom: 10px;'><strong>Order ID:</strong> <span style='font-family: monospace;'>{$orderId}</span></p>
            <p style='margin-bottom: 10px;'><strong>Edition:</strong> {$editionName} (SOHUB Protect {$editionName})</p>
            <p style='margin-bottom: 10px;'><strong>Total Amount:</strong> <span style='color: #e53e3e; font-weight: bold; font-size: 18px;'>" . number_format($total) . " BDT</span></p>
            <p style='margin-bottom: 25px;'><strong>Payment:</strong> {$paymentLabel}</p>
        </div>
        <div style='background-color: #f8fafc; border-radius: 12px; padding: 25px; border: 1px solid #edf2f7;'>
            <h3 style='color: #2d3748; margin-top: 0; margin-bottom: 15px; font-size: 18px;'>
                <span style='font-size: 18px;'>👤</span> Customer Contact
            </h3>
            <table style='width: 100%; font-size: 14px; border-collapse: collapse; color: #4a5568;'>
                <tr><td style='padding: 5px 0; font-weight: bold; width: 80px;'>Name:</td><td style='padding: 5px 0;'>{$customerName}</td></tr>
                <tr><td style='padding: 5px 0; font-weight: bold;'>Phone:</td><td style='padding: 5px 0;'><a href='tel:{$customerPhone}' style='color: #1890ff; text-decoration: none;'>{$customerPhone}</a></td></tr>
                <tr><td style='padding: 5px 0; font-weight: bold;'>Email:</td><td style='padding: 5px 0;'><a href='mailto:{$customerEmail}' style='color: #1890ff; text-decoration: none;'>" . ($customerEmail ?: 'N/A') . "</a></td></tr>
                <tr><td style='padding: 5px 0; font-weight: bold;'>Address:</td><td style='padding: 5px 0;'>{$customerAddress}</td></tr>
                <tr><td style='padding: 5px 0; font-weight: bold;'>Note:</td><td style='padding: 5px 0;'>" . ($customerNote ?: 'N/A') . "</td></tr>
            </table>
        </div>
        <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: left;'>
            <p style='color: #a0aec0; font-size: 12px;'>This is an automated sales notification from SOHUB Protect Portal.</p>
        </div>
    </div>";
    $mail->send();

    /* ── Send Customer Email ── */
    if ($customerEmail) {
        $mail->clearAddresses();
        $mail->addAddress($customerEmail, $customerName);
        $mail->Subject = "Order Confirmation: #{$orderId} — SOHUB Protect";

        // Embed Logo specifically for Customer Email (so it doesn't show as attachment in Admin mail)
        $logoEmbedPath = __DIR__ . '/assets/logo-with-icon.png';
        if (file_exists($logoEmbedPath)) {
            $mail->addEmbeddedImage($logoEmbedPath, 'logo_with_icon');
        }

        // Build Addon Rows
        $addonRows = "";
        foreach ($addons as $addon) {
            $name = $addon['nameBn'] . " (" . $addon['name'] . ")";
            $addonRows .= "
                <tr>
                    <td style='padding: 12px 15px; border-bottom: 1px solid #edf2f7;'>{$name}</td>
                    <td style='padding: 12px 15px; border-bottom: 1px solid #edf2f7; text-align: right;'>" . number_format($addon['price']) . " BDT</td>
                </tr>";
        }

        $mail->Body = "
<div style='font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px 0;'>
    <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);'>
        
        <!-- Blue Header -->
        <div style='background-color: #1890ff; padding: 40px 20px; text-align: center; color: #ffffff;'>
            <img src='cid:logo_with_icon' alt='SOHUB Protect' style='height: 45px; margin-bottom: 20px;'>
            <h1 style='margin: 0; font-size: 28px; font-weight: bold;'>Order Confirmation</h1>
            <p style='margin: 10px 0 0; opacity: 0.9;'>Thank you for choosing SOHUB Protect!</p>
        </div>

        <div style='padding: 30px;'>
            <!-- Order ID Bubble -->
            <div style='text-align: center; margin-bottom: 30px;'>
                <span style='background-color: #e6f7ff; color: #1890ff; padding: 8px 20px; border-radius: 50px; font-weight: bold; font-size: 14px; border: 1px solid #91d5ff;'>
                    🛡️ {$orderId}
                </span>
            </div>

            <p style='font-size: 16px; color: #333;'>Dear <strong>{$customerName}</strong>,</p>
            <p style='font-size: 15px; color: #555; line-height: 1.6;'>
                We've received your order for the SOHUB Protect system. Your quotation is attached to this email as a PDF. Our team will contact you shortly on <strong>{$customerPhone}</strong> to confirm the details.
            </p>

            <h3 style='color: #1890ff; margin-top: 35px; margin-bottom: 15px; font-size: 18px; display: flex; align-items: center;'>
                📦 Order Summary
            </h3>

            <table style='width: 100%; border-collapse: collapse; font-size: 14px; color: #4a5568; border: 1px solid #edf2f7;'>
                <tr style='background-color: #1890ff; color: #ffffff;'>
                    <th style='padding: 12px 15px; text-align: left;'>Product</th>
                    <th style='padding: 12px 15px; text-align: right;'>Price</th>
                </tr>
                <tr>
                    <td style='padding: 12px 15px; border-bottom: 1px solid #edf2f7; font-weight: bold; color: #1890ff;'>SOHUB Protect {$editionName}</td>
                    <td style='padding: 12px 15px; border-bottom: 1px solid #edf2f7; font-weight: bold; text-align: right;'>" . number_format($editionPrice) . " BDT</td>
                </tr>
                {$addonRows}
                <tr>
                    <td style='padding: 12px 15px; border-bottom: 1px solid #edf2f7; color: #718096;'>Delivery</td>
                    <td style='padding: 12px 15px; border-bottom: 1px solid #edf2f7; text-align: right;'>" . number_format($deliveryFee) . " BDT</td>
                </tr>
                <tr style='background-color: #f8fafc;'>
                    <td style='padding: 15px; font-weight: bold; font-size: 18px; color: #2d3748;'>Total Amount</td>
                    <td style='padding: 15px; font-weight: bold; font-size: 18px; color: #1890ff; text-align: right;'>" . number_format($total) . " BDT</td>
                </tr>
            </table>

            <!-- Next Steps Card -->
            <div style='margin-top: 40px; background-color: #f0f9ff; border: 1px solid #bae7ff; border-radius: 12px; padding: 25px; text-align: center;'>
                <h3 style='margin: 0 0 10px; color: #0050b3; font-size: 18px;'>🚀 What's Next?</h3>
                <p style='margin: 0; font-size: 14px; color: #003a8c;'>Our executive will call you soon to schedule the installation.</p>
                <p style='margin: 10px 0 0; font-size: 14px; color: #003a8c;'>Need help? Call us at <a href='tel:09678-076482' style='color: #1890ff; text-decoration: none; font-weight: bold;'>09678-076482</a></p>
            </div>
        </div>

        <!-- Footer -->
        <div style='background-color: #1a202c; padding: 30px; text-align: center; color: #ffffff;'>
            <p style='margin: 0; font-size: 14px; font-weight: bold;'>Solution Hub Technologies (SOHUB)</p>
            <div style='margin: 15px 0; font-size: 12px; color: #a0aec0;'>
                📞 09678-076482 | 🌐 <a href='https://protect.sohub.com.bd' style='color: #1890ff; text-decoration: none;'>sohubprotect.com.bd</a>
            </div>
        </div>
    </div>
</div>";
        $mail->send();
    }

    echo json_encode(['success' => true, 'orderId' => $orderId]);

} catch (Exception $e) {
    // Return 200 OK with success:false so the frontend can read the error
    echo json_encode([
        'success' => false,
        'error' => 'Backend Exception: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
