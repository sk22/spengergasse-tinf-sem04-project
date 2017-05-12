<?php

require_once('./db.php');
require_once('./api.php');

if (isset($_POST['text']) && strlen(trim($_POST['text']))) {
  $text = trim($_POST['text']);
  $user = isset($_POST['user']) && strlen($_POST['user'])
    ? $_POST['user'] : null;

  $stmt = $db->prepare("INSERT INTO `posts` (`text`, `user`) VALUES (?, ?)");
  result(fetch($stmt, [$text, $user]));
} else {
  http_response_code(400);
}
