<?php

function route($request) {

    $routes = json_decode(file_get_contents(__DIR__.'/routes.json'), true);

    foreach ($routes as $pattern => $component) {

        if (preg_match('/^\/[^\/]+\/$/', $pattern)) {

            if (preg_match($pattern, $request)) {
                return $component;
            }

            continue;

        }

        if ($pattern === parse_url($request, PHP_URL_PATH)) {
            return $component;
        }

    }

    return null;

}
