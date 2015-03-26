<?php

set_include_path('/home/manas/pear/share/pear');

//ini_set('display_errors', 'On');

require_once 'Mail.php';

$from = '<manaspaldhe12.gmail.com>';
$to = '<mpaldhe@purdue.edu>';
$subject = 'Hi!';
$body = "Hi,\n\nHow are you?";

$headers = array(
	'From' => $from,
	'To' => $to,
	'Subject' => $subject
	);

$smtp = Mail::factory('smtp', array(
	'host' => 'ssl://smtp.gmail.com',
	'port' => '465',
	'auth' => true,
	'username' => 'couriyaar@gmail.com',
	'password' => 'test'
	));

$mail = $smtp->send($to, $headers, $body);

if (PEAR::isError($mail)) {
	echo('<p>' . $mail->getMessage() . '</p>');
} else {
	echo('<p>Message successfully sent!</p>');
}

?>
