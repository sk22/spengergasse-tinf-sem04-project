<?php

require_once('./api.php');

session_start();
unset($_SESSION['user_id']);
session_destroy();

exit(result(true));
