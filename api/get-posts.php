<?php

require_once('./db.php');
require_once('./api.php');

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

$stmt = $db->prepare(
  "SELECT `posts`.`id`, `date`, `text`, `user`, `username`
    FROM `posts`
    LEFT JOIN `users` ON `posts`.`user` = `users`.`id`
    ORDER BY `id` DESC
    LIMIT ?, ?"
);

$stmt->bindParam(1, $offset, PDO::PARAM_INT); 
$stmt->bindParam(2, $limit, PDO::PARAM_INT); 

exit(result($db->fetchAll($stmt)));
