<?php

header('Content-Type: application/json;charset=UTF-8');

function result($data = null) {
  echo json_encode($data);
}
