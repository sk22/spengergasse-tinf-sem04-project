<?php

require_once('db.php');
require_once('api.php');

if (isset($_GET['limit'])) {
  $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 0;
  $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

  $stmt = $db->prepare(
    "SELECT `id`, `date`, `text`, `user`
      FROM `posts`
      ORDER BY `id` DESC
      LIMIT ?, ?"
  );

  $stmt->bindParam(1, $offset, PDO::PARAM_INT); 
  $stmt->bindParam(2, $limit, PDO::PARAM_INT); 

  result(fetchAll($stmt));
} else {
  $stmt = $db->prepare(
    "SELECT `id`, `date`, `text`, `user`
      FROM `posts`
      ORDER BY `id` DESC"
  );
  result(fetchAll($stmt));
}
