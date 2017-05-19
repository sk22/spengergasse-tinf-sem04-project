<?php

require_once('./db.php');
require_once('./api.php');

if (!isset($_GET['id'])) {
  exit(result(error('Expected `id` to be set')));
}

$id = trim($_GET['id']);

$query = "SELECT `id`, `username` FROM `users` WHERE `id` = ?";

exit(result($db->fetch($query, [$id])));
