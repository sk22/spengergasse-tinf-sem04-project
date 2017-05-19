<?php

class MySQLConnection {
  private $db;

  public function __construct(
    $dbname,
    $host = 'localhost',
    $username = 'root',
    $password = '',
    $charset = 'utf8mb4'
  ) {
    $this->db = new PDO(
      "mysql:host=$host;dbname=$dbname;charset=$charset",
      $username,
      $password
    );
    $this->db->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES $charset");
    $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
  }

  public function prepare($query) {
    return $this->db->prepare($query);
  }

  public function fetchAll($query, $params = null) {
    try {
      $stmt = is_object($query) ? $query : $this->db->prepare($query);
      $stmt->execute($params);
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      return [ 'error' => $e->getMessage() ];
    }
  }

  public function fetch($query, $params = null) {
    try {
      $stmt = is_object($query) ? $query : $this->db->prepare($query);
      $stmt->execute($params);
      return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      return error($e->getMessage());
    }
  }

  public function execute($query, $params = null) {
    try {
      $stmt = is_object($query) ? $query : $this->db->prepare($query);
      return $stmt->execute($params);
    } catch (PDOException $e) {
      return error($e->getMessage());
    }
  }
}
