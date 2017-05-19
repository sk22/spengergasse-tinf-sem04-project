<?php

require_once('./db.php');
require_once('./api.php');

session_start();

if (!isset($_GET['id'])) {
  exit(result(error('ID must be set')));
}

$id = intval($_GET['id']);

$query = "SELECT `user` FROM `posts` WHERE `id` = ?";
$user = $db->execute($query, [$_GET['id']])['user'];

if ($user !== $_SESSION['user_id']) {
  exit(result(error('Operation not permitted')));
}

$query = "DELETE FROM `posts` WHERE `id` = ?";
exit(result($db->execute($query, [$id])));
