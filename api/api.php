<?php
error_reporting(0);
require("inc/config.php");
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$url = explode("/", $url);
$data = "";

if ($url[count($url)-2] == "getArea") {
    $args = explode("," ,$url[count($url)-1]);
    $requestArea = new getDataByArea($args[0],$args[1],$args[2]);
    $data = $requestArea->getData();
} elseif ($url[count($url)-2] == "mmsi") {
    $requestMMSI = new getMMSI($url[count($url)-1]);
    $data = $requestMMSI->getData();
} elseif ($url[count($url)-2] == "name") {
    $requestName = new getName($url[count($url)-1]);
    $data = $requestName->getData();
} elseif ($url[count($url)-2] == "getByFilters") {
    $args = explode("," ,$url[count($url)-1]);
    $requestArea = new getDataByFilters($args[0],$args[1],$args[2],$args[3]);
    $data = $requestArea->getData();
} 

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
echo $data; 
?>