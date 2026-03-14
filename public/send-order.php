<?php
/**
 * SOHUB Protect — Order API 
 * Fixes: PNG transparency conversion for TCPDF, Logo embed, Bangla Font support fallback.
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

if (isset($_GET['test'])) {
    echo json_encode(['success' => true, 'message' => 'PHP OK']);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ══════════════════════════════════════════════════════════════════
   2. REQUIRE & LOAD
   ══════════════════════════════════════════════════════════════════ */
$autoloadFile = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloadFile))
    $autoloadFile = __DIR__ . '/api/vendor/autoload.php';
if (!file_exists($autoloadFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Dependency missing']);
    exit;
}
require $autoloadFile;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$envFile = __DIR__ . '/.env';
if (!file_exists($envFile))
    $envFile = __DIR__ . '/api/.env';

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
if ($_SERVER['REQUEST_METHOD'] !== 'POST')
    exit;

/* ══════════════════════════════════════════════════════════════════
   3. PARSE REQUEST
   ══════════════════════════════════════════════════════════════════ */
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
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
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

/* ══════════════════════════════════════════════════════════════════
   4. ASSETS
   ══════════════════════════════════════════════════════════════════ */
$rootUrl = 'https://protect.sohub.com.bd';
$assetsPath = __DIR__ . '/api-assets';
if (!is_dir($assetsPath)) {
    $assetsPath = __DIR__ . '/api/assets';
}

$imageMap = [
    'sp01' => $assetsPath . '/afford_trans.jpeg',
    'sp05' => $assetsPath . '/pro_trans.jpeg',
    '1' => $assetsPath . '/Accesories/shutter sensor.jpeg',
    '2' => $assetsPath . '/Accesories/vivration_sensor.jpeg',
    '3' => $assetsPath . '/Accesories/door_sensor.jpeg',
    '4' => $assetsPath . '/Accesories/fire_alarm.jpeg',
    '5' => $assetsPath . '/Accesories/gas_sensor.jpeg',
    '6' => $assetsPath . '/Accesories/motion_sensor.jpeg',
    '7' => $assetsPath . '/Accesories/signal_extender.jpeg',
    '8' => $assetsPath . '/Accesories/sos_band.jpeg',
    '9' => $assetsPath . '/Accesories/wireless_siren.jpeg',
    '10' => $assetsPath . '/Accesories/ai_camera.jpeg',
];

$logoPath = $assetsPath . '/logo-with-icon.png';
$emailLogoUrl = $rootUrl . '/api-assets/logo-with-icon.png';

$orderId = 'SP-' . date('Ymd') . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
$orderDate = date('d M Y, h:i A');
$editionPrice = intval($edition['price'] ?? 0);
$addonTotal = array_reduce($addons, fn($sum, $a) => $sum + intval($a['price'] ?? 0), 0);


/**
 * Helper: Converts Interlaced/Alpha PNGs to standard JPGs which TCPDF NEVER chokes on.
 */
function getSafePdfImage($origPath, $isLogo = false)
{
    if (!$origPath || !file_exists($origPath))
        return '';
    $ext = strtolower(pathinfo($origPath, PATHINFO_EXTENSION));

    if ($ext === 'png' && function_exists('imagecreatefrompng')) {
        $tmp = sys_get_temp_dir() . '/tcpdf_' . ($isLogo ? 'logo_' : 'item_') . md5($origPath) . '.jpg';
        if (!file_exists($tmp)) {
            $img = @imagecreatefrompng($origPath);
            if ($img) {
                // Remove transparency by creating a solid background
                $bg = imagecreatetruecolor(imagesx($img), imagesy($img));
                if ($isLogo) {
                    // TCPDF header background is blue #1890ff (24, 144, 255)
                    imagefill($bg, 0, 0, imagecolorallocate($bg, 24, 144, 255));
                } else {
                    // White background for table
                    imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
                }
                imagealphablending($bg, TRUE);
                imagecopy($bg, $img, 0, 0, 0, 0, imagesx($img), imagesy($img));
                imagejpeg($bg, $tmp, 95);
                imagedestroy($bg);
                imagedestroy($img);
            }
        }
        if (file_exists($tmp))
            return $tmp;
    }
    return $origPath;
}

/* ══════════════════════════════════════════════════════════════════
   5. PDF GENERATION
   ══════════════════════════════════════════════════════════════════ */
class SOHUBQuotation extends TCPDF
{
    public string $logoPath = '';
    public string $orderId = '';
    public string $orderDate = '';

    public function Header()
    {
        $this->SetFillColor(24, 144, 255);
        $this->Rect(0, 0, 210, 38, 'F');

        $safeLogo = getSafePdfImage($this->logoPath, true);
        if ($safeLogo && file_exists($safeLogo)) {
            // Embed perfectly processed safe JPG for logo!
            $this->Image($safeLogo, 15, 6, 45);
        }

        $this->SetFont('freeserif', 'B', 20); // Better Bengali fallback
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

    public function Footer()
    {
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

$pdf = new SOHUBQuotation('P', 'mm', 'A4', true, 'UTF-8', false);
$pdf->logoPath = $logoPath;
$pdf->orderId = $orderId;
$pdf->orderDate = $orderDate;
$pdf->SetMargins(15, 45, 15);
$pdf->SetAutoPageBreak(true, 35);
$pdf->AddPage();
// using freeserif for better Unicode fallback (resolves the question mark rectangles)
$pdf->SetFont('freeserif', '', 10);

$pmtMethodLabel = $paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery';

$pdfHtml = <<<EOD
<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td style="color: #1890ff; font-weight: bold; font-size: 14pt;">Customer Information</td>
    </tr>
</table>
<br>
<table width="100%" cellpadding="6" style="background-color: #f5f8ff; border: 1px solid #c8dcff;">
    <tr>
        <td width="15%" style="color: #666666;"><b>Name:</b></td>
        <td width="35%">{$customerName}</td>
        <td width="15%" style="color: #666666;"><b>Phone:</b></td>
        <td width="35%">{$customerPhone}</td>
    </tr>
    <tr>
        <td style="color: #666666;"><b>Email:</b></td>
        <td>{$customerEmail}</td>
        <td style="color: #666666;"><b>Payment:</b></td>
        <td>{$pmtMethodLabel}</td>
    </tr>
    <tr>
        <td style="color: #666666;"><b>Address:</b></td>
        <td colspan="3">{$customerAddress}</td>
    </tr>
</table>
<br><br>

<table width="100%" cellpadding="0" cellspacing="0">
    <tr>
        <td style="color: #1890ff; font-weight: bold; font-size: 14pt;">Order Details</td>
    </tr>
</table>
<br>
<table width="100%" cellpadding="8" border="1" style="border-collapse: collapse; border-color: #c0c0c0;">
    <tr style="background-color: #1890ff; color: #ffffff; font-weight: bold;">
        <th width="15%" align="center">Image</th>
        <th width="45%" align="left">Product</th>
        <th width="20%" align="right">Unit Price</th>
        <th width="20%" align="right">Total</th>
    </tr>
EOD;

// Edition
$edImg = getSafePdfImage($imageMap[$edition['id']] ?? '');
$edImgTag = ($edImg && file_exists($edImg)) ? '<img src="' . $edImg . '" width="55" />' : '';
$edNameStr = $edition['nameBn'] ?? $edition['name'];
$edEngStr = $edition['name'];
$edPriceF = number_format($editionPrice) . ' BDT';

$pdfHtml .= <<<EOD
    <tr>
        <td width="15%" align="center">{$edImgTag}</td>
        <td width="45%"><b>{$edNameStr}</b><br><span style="color: #666666; font-size: 8pt;">{$edEngStr}</span></td>
        <td width="20%" align="right">{$edPriceF}</td>
        <td width="20%" align="right"><b>{$edPriceF}</b></td>
    </tr>
EOD;

// Accessories
foreach ($addons as $addon) {
    $adImg = getSafePdfImage($imageMap[$addon['id']] ?? '');
    $adImgTag = ($adImg && file_exists($adImg)) ? '<img src="' . $adImg . '" width="45" />' : '';
    $adNameStr = $addon['nameBn'] ?? $addon['name'];
    $adEngStr = $addon['name'];
    $adPriceF = number_format($addon['price']) . ' BDT';

    $pdfHtml .= <<<EOD
    <tr>
        <td align="center">{$adImgTag}</td>
        <td><b>{$adNameStr}</b><br><span style="color: #666666; font-size: 8pt;">{$adEngStr}</span></td>
        <td align="right">{$adPriceF}</td>
        <td align="right"><b>{$adPriceF}</b></td>
    </tr>
EOD;
}

$pdfHtml .= <<<EOD
</table>
<br>
EOD;

$dlvStr = $deliveryFee === 0 ? '<span style="color:#1890ff;">FREE</span>' : number_format($deliveryFee) . ' BDT';
$subAddonsF = number_format($addonTotal) . ' BDT';
$totStr = number_format($total) . ' BDT';
$cnt = count($addons);

$pdfHtml .= <<<EOD
<table width="100%" cellpadding="5">
    <tr>
        <td width="70%" align="right">Edition:</td>
        <td width="30%" align="right">{$edPriceF}</td>
    </tr>
EOD;

if ($addonTotal > 0) {
    $pdfHtml .= <<<EOD
    <tr>
        <td align="right">Accessories ({$cnt}):</td>
        <td align="right">{$subAddonsF}</td>
    </tr>
EOD;
}

$pdfHtml .= <<<EOD
    <tr>
        <td align="right">Delivery:</td>
        <td align="right">{$dlvStr}</td>
    </tr>
    <tr>
        <td align="right"></td>
        <td align="right"><hr color="#1890ff" /></td>
    </tr>
    <tr>
        <td align="right"><b style="font-size:12pt; color:#1890ff;">Total:</b></td>
        <td align="right"><b style="font-size:12pt;">{$totStr}</b></td>
    </tr>
</table>
<br><br>

<table width="100%" cellpadding="8" style="background-color: #f5f8ff; border: 1px solid #c8dcff; border-radius: 5px;">
    <tr>
        <td>
            <b style="color: #1890ff; font-size: 11pt;">Terms & Conditions</b><br>
            <span style="font-size: 8.5pt; color: #555555; line-height: 1.6;">
            • All products come with 1 year manufacturer warranty.<br>
            • No monthly subscription fee required.<br>
            • Free technical support and consultation included.<br>
            • Delivery within 3-5 business days across Bangladesh.<br>
            • Prices are inclusive of all taxes.
            </span>
        </td>
    </tr>
</table>
EOD;

$pdf->writeHTML($pdfHtml, true, false, true, false, '');
$pdfContent = $pdf->Output('', 'S');

/* ══════════════════════════════════════════════════════════════════
   6. EMAIL TEMPLATES (Exact Match to Design)
   ══════════════════════════════════════════════════════════════════ */
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
            <img src="{$emailLogoUrl}" alt="SOHUB Protect" width="160" style="margin-bottom:15px; max-width:160px;">
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
            <p style="color:#333; margin:0 0 20px; font-size:15px;">Dear <b>{$customerName}</b>,</p>
            <p style="color:#555; margin:0 0 25px; line-height:1.6; font-size:14px;">
                We've received your order for the SOHUB Protect system. Your quotation is attached to this email as a PDF. Our team will contact you shortly on <b>{$customerPhone}</b> to confirm the details.
            </p>

            <!-- Order Details -->
            <h3 style="color:#1890ff; margin:0 0 12px; font-size:15px; font-weight:700;">
                📦 Order Summary
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8; border-radius:10px; overflow:hidden; margin-bottom:20px;">
                <tr style="background:#1890ff;">
                    <td style="padding:10px 16px; color:#fff; font-size:13px; font-weight:600;">Product</td>
                    <td style="padding:10px 16px; color:#fff; font-size:13px; font-weight:600; text-align:right;">Price</td>
                </tr>
                <tr style="background:#f0f8ff;">
                    <td style="padding:14px 16px; border-bottom:1px solid #e8e8e8;">
                        <span style="color:#1890ff; font-weight:700; font-size:15px;">{$editionNameHtml}</span>
                    </td>
                    <td style="padding:14px 16px; border-bottom:1px solid #e8e8e8; text-align:right; font-weight:700; font-size:15px; color:#333;">
                        {$editionPrice} BDT
                    </td>
                </tr>
                {$addonRowsHtml}
                <tr>
                    <td style="padding:12px 16px; color:#333; font-size:13px;">Delivery</td>
                    <td style="padding:12px 16px; font-size:13px; text-align:right; color:#333;">{$deliveryLabel}</td>
                </tr>
                <tr style="background:#f9fafb;">
                    <td style="padding:15px 16px; color:#333; font-size:18px; font-weight:800;">Total Amount</td>
                    <td style="padding:15px 16px; color:#1890ff; font-size:20px; font-weight:800; text-align:right;">{$total} BDT</td>
                </tr>
            </table>

            <!-- What's Next -->
            <table width="100%" style="background:#e6f7ff; border-radius:12px; border:1px solid #91d5ff;" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding:20px 25px; text-align:center;">
                        <h3 style="color:#1890ff; margin:0 0 8px; font-size:16px;">🚀 What's Next?</h3>
                        <p style="color:#555; margin:0; font-size:13px; line-height:1.6;">
                            Our executive will call you soon to schedule the installation.<br>
                            Need help? Call us at <strong style="color:#1890ff;">09678-076482</strong>
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
                📞 09678-076482 &nbsp;|&nbsp; 🌐 sohubprotect.com.bd
            </p>
        </td>
    </tr>
</table>
</td></tr>
</table>
</body>
</html>
HTML;


$adminEmailHtml = <<<HTML
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
    <div style="background: #fff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; border-top: 5px solid #1890ff;">
        <h2 style="color: #1890ff; border-bottom: 1px solid #eee; padding-bottom: 10px;">🛡️ New Order Received</h2>
        <p><strong>Order ID:</strong> {$orderId}</p>
        <p><strong>Edition:</strong> {$edition['name']} ({$edition['nameBn']})</p>
        <p><strong>Total Amount:</strong> <span style="font-size: 18px; color: #d44;">{$total} BDT</span></p>
        <p><strong>Payment:</strong> {$paymentLabel}</p>
        
        <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">👤 Customer Contact</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> {$customerName}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:{$customerPhone}" style="color:#1890ff; font-weight:bold;">{$customerPhone}</a></p>
            <p style="margin: 5px 0;"><strong>Email:</strong> {$customerEmail}</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> {$customerAddress}</p>
            <p style="margin: 5px 0;"><strong>Note:</strong> {$customerNote}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">This is an automated sales notification from SOHUB Protect Portal.</p>
    </div>
</body>
</html>
HTML;


/* ══════════════════════════════════════════════════════════════════
   7. SEND EMAILS
   ══════════════════════════════════════════════════════════════════ */
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USER'] ?? '';
    $mail->Password = $_ENV['SMTP_PASS'] ?? '';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = intval($_ENV['SMTP_PORT'] ?? 587);
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($_ENV['SMTP_USER'], 'SOHUB Protect');
    $mail->addReplyTo('hello@sohub.com.bd', 'SOHUB Protect');

    $pdfName = "SOHUB-Quotation-{$orderId}.pdf";

    // ── ADMIN EMAIL ──
    $mail->addAddress($_ENV['ADMIN_EMAIL'] ?? 'hello@sohub.com.bd');
    $mail->isHTML(true);
    $mail->Subject = "🚨 [NEW ORDER] #{$orderId} from {$customerName}";
    $mail->Body = $adminEmailHtml;
    $mail->addStringAttachment($pdfContent, $pdfName, 'base64', 'application/pdf');
    $mail->send();

    // ── CUSTOMER EMAIL ──
    if ($customerEmail && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        $mail->clearAddresses();
        // Since we didn't clear attachments, the PDF stays attached! No extra logo attachment anymore!
        $mail->addAddress($customerEmail, $customerName);
        $mail->Subject = "🛡️ Order Confirmation #{$orderId} — SOHUB Protect";
        $mail->Body = $emailHtml;
        $mail->send();
    }

    echo json_encode(['success' => true, 'orderId' => $orderId, 'message' => 'Order processed!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Mail error: ' . $mail->ErrorInfo]);
}
