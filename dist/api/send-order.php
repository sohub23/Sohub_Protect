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
register_shutdown_function(function() {
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
            if ($line === '' || strpos($line, '#') === 0) continue;
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
        '7' => $assetsDir . '/Accesories/signal_extender.jpeg',
        '8' => $assetsDir . '/Accesories/sos_band.jpeg',
        '9' => $assetsDir . '/Accesories/wireless_siren.jpeg',
        '10' => $assetsDir . '/Accesories/ai_camera.jpeg',
    ];
    $logoPath = $assetsDir . '/logo-with-icon.png';
    $orderId = 'SP-' . date('Ymd') . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
    $orderDate = date('d M Y, h:i A');
    $editionPrice = intval($edition['price'] ?? 0);
    $addonTotal = array_reduce($addons, fn($sum, $a) => $sum + intval($a['price'] ?? 0), 0);

    // PDF Class Definition
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
            $this->SetFont('freeserif', 'B', 20);
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
            $this->Cell(0, 4, 'Phone: 09678-076482  |  Email: hello@sohub.com.bd  |  www.sohubprotect.com', 0, 1, 'C');
            $this->Cell(0, 4, '1 Year Warranty  •  No Monthly Fee  •  Free Technical Support', 0, 1, 'C');
            $this->SetFont('freeserif', '', 7);
            $this->Cell(0, 4, 'Page ' . $this->getAliasNumPage() . ' of ' . $this->getAliasNbPages(), 0, 0, 'C');
        }
    }

    $pdf = new SOHUBQuotation('P', 'mm', 'A4', true, 'UTF-8');
    $pdf->logoPath = $logoPath;
    $pdf->orderId = $orderId;
    $pdf->orderDate = $orderDate;
    $pdf->SetCreator('SOHUB Protect');
    $pdf->SetTitle('Quotation ' . $orderId);
    $pdf->SetMargins(15, 42, 15);
    $pdf->SetAutoPageBreak(true, 35);
    $pdf->AddPage();

    // Customer Info Card
    $pdf->SetFont('freeserif', 'B', 12);
    $pdf->SetTextColor(24, 144, 255);
    $pdf->Cell(0, 8, 'Customer Information', 0, 1, 'L');
    $pdf->SetFont('freeserif', '', 9);
    $pdf->SetFillColor(245, 248, 255);
    $pdf->SetDrawColor(200, 220, 255);
    $startY = $pdf->GetY();
    $pdf->RoundedRect(15, $startY, 180, 28, 3, '1111', 'DF');
    $pdf->SetXY(20, $startY + 3);
    $pdf->Cell(30, 5, 'Name:', 0, 0); $pdf->Cell(55, 5, $customerName, 0, 0);
    $pdf->Cell(30, 5, 'Phone:', 0, 0); $pdf->Cell(55, 5, $customerPhone, 0, 1);
    $pdf->SetX(20);
    $pdf->Cell(30, 5, 'Email:', 0, 0); $pdf->Cell(55, 5, $customerEmail ?: 'N/A', 0, 0);
    $pdf->Cell(30, 5, 'Payment:', 0, 0); $pdf->Cell(55, 5, $paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery', 0, 1);
    $pdf->SetX(20);
    $pdf->Cell(30, 5, 'Address:', 0, 0); $pdf->MultiCell(140, 5, $customerAddress, 0, 'L');
    $pdf->SetY($startY + 32);

    // Order Table
    $pdf->SetFont('freeserif', 'B', 12); $pdf->SetTextColor(24, 144, 255);
    $pdf->Cell(0, 10, 'Order Details', 0, 1, 'L');
    $pdf->SetFillColor(24, 144, 255); $pdf->SetTextColor(255, 255, 255);
    $colWidths = [25, 80, 35, 40];
    $pdf->Cell($colWidths[0], 10, '', 1, 0, 'C', true);
    $pdf->Cell($colWidths[1], 10, 'Product', 1, 0, 'L', true);
    $pdf->Cell($colWidths[2], 10, 'Unit Price', 1, 0, 'R', true);
    $pdf->Cell($colWidths[3], 10, 'Total', 1, 1, 'R', true);

    // Edition Row
    $rowY = $pdf->GetY();
    $editionImgPath = $imageMap[$edition['id']] ?? '';
    if (file_exists($editionImgPath)) { $pdf->Image($editionImgPath, 17, $rowY + 2, 20, 18); }
    $pdf->SetXY(15, $rowY); $pdf->Cell($colWidths[0], 22, '', 1, 0, 'C', false);
    $pdf->SetXY(15 + $colWidths[0], $rowY);
    $pdf->SetFont('helvetica', 'B', 10); $pdf->SetTextColor(30, 30, 30);
    $pdf->Cell($colWidths[1], 7, $edition['nameBn'] ?? $edition['name'], 0, 1);
    $pdf->SetX(15 + $colWidths[0]); $pdf->SetFont('helvetica', '', 7);
    $pdf->MultiCell($colWidths[1] - 5, 4, $edition['desc'] ?? '', 0, 'L');
    $pdf->Rect(15 + $colWidths[0], $rowY, $colWidths[1], 22);
    $pdf->SetXY(15 + $colWidths[0] + $colWidths[1], $rowY);
    $pdf->SetFont('helvetica', '', 9); $pdf->Cell($colWidths[2], 22, number_format($editionPrice) . ' BDT', 1, 0, 'R');
    $pdf->SetFont('helvetica', 'B', 9); $pdf->Cell($colWidths[3], 22, number_format($editionPrice) . ' BDT', 1, 1, 'R');

    // Addons
    foreach ($addons as $addon) {
        $addonY = $pdf->GetY();
        $addonImg = $imageMap[$addon['id']] ?? '';
        if (file_exists($addonImg)) { $pdf->Image($addonImg, 18, $addonY + 2, 16, 14); }
        $pdf->SetXY(15, $addonY); $pdf->Cell($colWidths[0], 18, '', 1, 0);
        $pdf->Cell($colWidths[1], 18, ($addon['nameBn'] ?? $addon['name']), 1, 0);
        $pdf->SetFont('helvetica', '', 9); $pdf->Cell($colWidths[2], 18, number_format($addon['price']) . ' BDT', 1, 0, 'R');
        $pdf->SetFont('helvetica', 'B', 9); $pdf->Cell($colWidths[3], 18, number_format($addon['price']) . ' BDT', 1, 1, 'R');
    }

    $pdfContent = $pdf->Output('', 'S');

    /* ── Email Sending ── */
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USER'] ?? '';
    $mail->Password = $_ENV['SMTP_PASS'] ?? '';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = intval($_ENV['SMTP_PORT'] ?? 587);
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($_ENV['SMTP_USER'], 'SOHUB Protect');
    $mail->addAddress($_ENV['ADMIN_EMAIL'] ?? 'hello@sohub.com.bd');
    if ($customerEmail) { $mail->addAddress($customerEmail, $customerName); }
    $mail->addStringAttachment($pdfContent, 'Quotation-' . $orderId . '.pdf', 'base64', 'application/pdf');
    $mail->isHTML(true);
    $mail->Subject = "New Order #{$orderId} — SOHUB Protect";
    $mail->Body = "<h1>Order #{$orderId}</h1><p>Customer: {$customerName}</p><p>Total: {$total} BDT</p>";
    $mail->send();

    echo json_encode(['success' => true, 'orderId' => $orderId]);

} catch (Exception $e) {
    // Return 200 OK with success:false so the frontend can read the error
    echo json_encode([
        'success' => false,
        'error' => 'Backend Exception: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
