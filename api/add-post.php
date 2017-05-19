<?php

require_once('./db.php');
require_once('./api.php');

session_start();

if (!isset($_SESSION['user_id'])) {
  exit(result(error('Not logged in')));
}

if (isset($_POST['text']) && strlen(trim($_POST['text']))) {
  $text = trim($_POST['text']);
  $user_id = $_SESSION['user_id'];

  $query = "INSERT INTO `posts` (`text`, `user`) VALUES (?, ?)";
  exit(result($db->fetch($query, [$text, $user_id])));
} else {
  exit(result(error('Text is missing')));
}
