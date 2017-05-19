<?php

header('Content-Type: application/json; charset=utf-8');

function result($data = null) {
  echo json_encode($data);
}

function error($data = null, $code = 400) {
  http_response_code($code);
  return [
    'status' => $code,
    'message' => $data
  ];
}
