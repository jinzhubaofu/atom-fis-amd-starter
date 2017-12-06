<?php

function route($request) {

    // 读取路由配置
    $routes = json_decode(file_get_contents(__DIR__.'/routes.json'), true);

    // 遍历路由进行匹配
    foreach ($routes as $pattern => $component) {

        // 如果 pattern 字段是正则格式
        if (preg_match('/^\/[^\/]+\/$/', $pattern)) {

            // 按正则表达式来进行匹配
            if (preg_match($pattern, $request)) {
                return $component;
            }

            continue;

        }

        // @TODO 还应当支持 restful api 风格进行匹配

        // 否则按字符串来进行 pathname 进行匹配
        if ($pattern === parse_url($request, PHP_URL_PATH)) {
            return $component;
        }

    }

    return null;

}
