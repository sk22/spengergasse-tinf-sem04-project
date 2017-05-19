<?php

require_once('./db.php');
require_once('./api.php');

if (isset($_GET['id'])) {
  $id = intval($_GET['id']);
  
  $query = "DELETE FROM `posts` WHERE `id` = ?";
  exit(result($db->execute($query, [$id])));
} else {
  http_response_code(400);
}
