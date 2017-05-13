<?php
error_reporting(E_ALL); ini_set('display_errors', 1);

require '../vendor/autoload.php';

$app = new \Slim\App(["settings" => array('displayErrorDetails' => true, 'addContentLengthHeader' => false)]);

$app->get('/', Front\resources\Homepage::class . ':getHomepage');

$app->run();