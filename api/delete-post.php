<?php

require_once('./db.php');
require_once('./api.php');

if (isset($_GET['id'])) {
  $id = intval($_GET['id']);
  
  $stmt = $db->prepare("DELETE FROM `posts` WHERE `id` = ?");
  result(fetch($stmt, [$id]));
} else {
  http_response_code(400);
}
