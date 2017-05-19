<?php

require_once('./db.php');
require_once('./api.php');

session_start();

if (!isset($_SESSION['user_id'])) {
  exit(result(error('Not logged in')));
}

$query = 'DELETE FROM `users` WHERE `id` = ?';
exit(result($db->execute($query, [$_SESSION['user_id']])));
