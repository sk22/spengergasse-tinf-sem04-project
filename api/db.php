<?php

$db = new PDO('mysql:host=localhost;dbname=feed;charset=utf8', 'root', '');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

function fetchAll($stmt, $params = null) {
  try {
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    return [ 'error' => $e->getMessage() ];
  }
}

function fetch($stmt, $params = null) {
  try {
    $stmt->execute($params);
    return $stmt->fetch(PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    return [ 'error' => $e->getMessage() ];
  }
}
