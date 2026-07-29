<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
  exit;
}

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$email = trim($_POST['email'] ?? '');
$service = trim($_POST['service'] ?? '');
$date = trim($_POST['date'] ?? 'Not specified');
$message = trim($_POST['message'] ?? '');

if (!$name || !$phone || !$email || !$message) {
  echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
  exit;
}

$to = 'info@ayovexinterio.co.za';
$subject = 'New Quote Request - Ayovex Interior';

$body = "
Name: $name
Phone: $phone
Email: $email
Service: $service
Preferred Date: $date

Message:
$message
";

$headers = "From: Ayovex Website <noreply@ayovexinterio.co.za>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$success = mail($to, $subject, $body, $headers);

if ($success) {
  echo json_encode(['success' => true, 'message' => 'Your message has been sent.']);
} else {
  echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again later.']);
}
