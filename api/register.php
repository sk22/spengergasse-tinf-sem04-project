<?php

require_once('./db.php');
require_once('./api.php');

if (!isset($_POST['username']) || !isset($_POST['password'])) {
  exit(result(error('Expected all required POST fields (username, password) '
    . 'to be set.')));
}

$username = trim($_POST['username']);

if (!$db->execute(
  "SELECT `id`, `username` FROM `users` WHERE `username` = ?", [$username]
)) {
  exit(result(error('Username is already in use')));
}

if (strlen($_POST['password']) < 4) {
  exit(result(error('Password length insufficient')));
}

$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$query = "INSERT INTO `users` (`username`, `password`) VALUES (?, ?)";
exit(result($db->execute($query, [$username, $password])));
