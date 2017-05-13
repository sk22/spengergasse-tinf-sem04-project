<?php

header('Content-Type: application/json; charset=utf-8');

function result($data = null) {
  echo json_encode($data);
}
