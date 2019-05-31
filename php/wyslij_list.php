<?php
$sender      = "";
$response    = "";
$backup      = "";
$respondent  = "";
$subject     = "";
$message     = "";
$error_mssg  = "";
$certificate = "Nie ma takiego dobrego uczynku, który nie zostałby ukarany.";
$bcc_adress  = "kopie@azkstrony.pl";

function cleanInput($input) {
  return htmlspecialchars(stripslashes(trim($input)));
}//cleanInput

if (empty($_POST['sender']))
  $error_mssg = "Brak adresu nadawcy";//"No 'sender'";
else if (empty($_POST['respondent']))
  $error_mssg = "Brak adresu respondenta";//"No 'respondent'";
else if (empty($_POST['subject']))
  $error_mssg = "Brak tematu";//"No 'subject'";
else if (empty($_POST['message']))
  $error_mssg = "Brak wiadomości";//"No 'message'";
else if (empty($_POST['certificate']))
  $error_mssg = "Brak certyfikatu: wrrrr";//"No 'certificate'";
//print_r($_POST);

if ($error_mssg == "" && $_POST['certificate'] != $certificate) {
  $error_mssg = "Zły certifikat: wrrrrr";
}

if ($error_mssg == "") {
  $sender = cleanInput($_POST['sender']);
  if (!empty($_POST['response']))
    $response = cleanInput($_POST['response']);
  if (!empty($_POST['backup']))
    $backup = cleanInput($_POST['backup']);
  $respondent = cleanInput($_POST['respondent']);
  $subject = cleanInput($_POST['subject']);
  $message = str_replace("\n.", "\n .", wordwrap($_POST['message'], 70));
//echo "sender=$sender\nresponse=$response\nbackup=$backup\nrespondent=$respondent\nsubject=$subject\n";
//echo "message=$message\n";
  if (!filter_var($sender, FILTER_VALIDATE_EMAIL))
    $error_mssg = "Faulty 'sender'";
  else if ($response != "" && !filter_var($response, FILTER_VALIDATE_EMAIL))
    $error_mssg = "Faulty 'response'";
  else if ($backup != "" && !filter_var($backup, FILTER_VALIDATE_EMAIL))
    $error_mssg = "Faulty 'backup'";
  else if (!filter_var($respondent, FILTER_VALIDATE_EMAIL))
    $error_mssg = "Faulty 'respondent'";
}//if

if ($error_mssg == "") {
  $headers = "MIME-Version: 1.0\r\n";
  $headers .= "Content-type:text/html;charset=UTF-8\r\n";//wersja HTML
//  $headers = "Content-type:text/plain;charset=UTF-8\r\n";//wersja plain text
  $headers .= "From: $sender\r\n";
  if ($response != "")
    $headers .= "Reply-To: $response\r\n";
  if ($backup != "")
    $headers .= "Cc: $backup\r\n";
  $headers .= "Bcc: $bcc_adress\r\n";
//echo "To:$respondent\nHeader:$headers\nMessage:$message\n";
  $error_mssg = (mail($respondent, $subject, $message, $headers) == false) ? "Błąd wysyłania" : "List wysłany";
//  $error_mssg = (mail($respondent, $subject, $message) == false) ? "Email sending error" : "Email sent";
}//if

echo $error_mssg;
?>
