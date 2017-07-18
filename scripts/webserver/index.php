<?php

/**
 * @file php built-in webserver router
 * @author ludafa <leonlu@outlook.com>
 */

date_default_timezone_set("UTC");

require_once(__DIR__.'/AtomWrapper.class.php');
require_once(__DIR__.'/../../node_modules/vip-server-renderer/php/server/Atom.class.php');

$root = getcwd();
$request = $_SERVER['REQUEST_URI'];

// 如果不是 *.php 那么直接返回；
if (!preg_match('/\.php($|\?)/', $request)) {
    return false;
}

$templatePath = substr(parse_url($request, PHP_URL_PATH), 1);
$componentPath = substr($templatePath, 0, -4) . '.atom.php';

$atomWrapper = new AtomWrapper();

$atomWrapper->setTemplateDir("$root/output");

$data = exec("node $root/scripts/webserver/get-mock-data.js $root/$componentPath $request");
$data = json_decode($data, true);

foreach ($data as $key => $value) {
    $atomWrapper->assign($key, $value);
}

$atomWrapper->display($templatePath, $componentPath);
