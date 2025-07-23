<?php
require 'vendor/autoload.php';
$pdo = new PDO(
  'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'] . ';charset=utf8mb4',
  $_ENV['DB_USER'],
  $_ENV['DB_PASS'],

);

$sql = "SELECT * from usuarios";
print_r($pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC));

echo "Conexión OK";
