<?php

require_once('./db.php');
require_once('./api.php');

session_start();

if (!isset($_POST['username']) || !isset($_POST['password'])) {
  result(error('Expected all required POST fields (username, password) '
    . 'to be set.'));
}

$username = trim($_POST['username']);
$password = $_POST['password'];

$query =
  "SELECT `id`, `password`, `username` 
    FROM `users` WHERE `username` = ?";

$user = $db->fetch($query, [$username]);

$correct = password_verify($password, $user['password']);

if (!$correct) exit(result(error('Password is not correct')));

$_SESSION['user_id'] = $user['id'];

unset($user['password']);
exit(result($user));
