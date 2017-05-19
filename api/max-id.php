<?php

require_once('./db.php');
require_once('./api.php');

$stmt = $db->prepare("SELECT MAX(`id`) as `max` FROM `posts`");
result($db->fetch($stmt));
