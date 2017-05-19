<?php

require_once('./db.php');
require_once('./api.php');

session_start();

if (!isset($_POST['password'])) {
  exit(result(error('Password must be passed')));
}

if (!isset($_SESSION['user_id'])) {
  exit(result(error('Not logged in')));
}

$query = "SELECT `password` FROM `users` WHERE `id` = ?";
$user = $db->fetch($query, [$_SESSION['user_id']]);
$correct = password_verify($_POST['password'], $user['password']);

if (!$correct) {
  exit(result(error('Password is not correct')));
}

$query = 'DELETE FROM `users` WHERE `id` = ?';
exit(result($db->execute($query, [$_SESSION['user_id']])));
