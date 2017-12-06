<?php

/**
 * @file php built-in webserver router
 * @author ludafa <leonlu@outlook.com>
 */

date_default_timezone_set("UTC");

//显示除去 E_NOTICE 之外的所有错误信息
error_reporting(E_ALL ^ E_NOTICE);

require_once(__DIR__.'/AtomWrapper.class.php');
require_once(__DIR__.'/../../node_modules/vip-server-renderer/php/server/Atom.class.php');

$root = getcwd();
$request = $_SERVER['REQUEST_URI'];

// 处理 json
if (preg_match('/\.json($|\?)/', $request)) {
    $localPath = "$root$request";
    if (!file_exists($localPath)) {
        http_response_code(404);
        return;
    }
    $data = file_get_contents($localPath);
    header('Content-type: application/json;charset=utf-8');
    header('Content-Length: '.strlen($data));
    echo $data;
    return;
}

// 查询路由
require_once(__DIR__.'/router.php');
$component = route($request);

// 未中路由则返回
if (empty($component)) {
    return false;
}

$templatePath = str_replace('.atom', '.template.php', $component);

$atomWrapper = new AtomWrapper();

$atomWrapper->setTemplateDir("$root/output/template");
$atomWrapper->assign('component', $component);

$data = exec("node $root/tools/webserver/get-mock-data.js $root/src/$component $request");
$data = json_decode($data, true);

if (!empty($data)) {
    foreach ($data as $key => $value) {
        $atomWrapper->assign($key, $value);
    }
}

// 尝试找一下 data_modify.php
$modifyDataFile = dirname("$root/src/$component").'/data_modify.php';

if (file_exists($modifyDataFile)) {
    $atomWrapper->modifyData($modifyDataFile);
}

$atomWrapper->display(
    $templatePath,
    "$component.php"
);
