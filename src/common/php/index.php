<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title><?php echo htmlentities($data['title'])?></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="x5-orientation" content="portrait">
    <link rel="stylesheet" href="/static/ralltiir-application/view/rt-view.css">
    <!--STYLE_PLACEHOLDER-->
</head>
<body>
<?php
$rootModule = 'atom-site';
$header = empty($data['sfHeader']) ? array() : $data['sfHeader'];
$noViewBorder = !empty($header['noViewBorder']);
$noHeaderBorder = !empty($header['noHeaderBorder']);
function cx($classes) {
    $className = '';
    foreach ($classes as $key => $value) {
        if (is_array($value)) {
            $nestedClassName = cx($value);
            if (!empty($nestedClassName)) {
                $className .= " $nestedClassName";
            }
        }
        if (!empty($value)) {
            $className .= ' ' . is_numeric($key) ? $value : $key;
        }
    }
    return $className;
}
?>
<div id="sfr-app">
    <div class="rt-view active <?php cx(array('no-border' => $noViewBorder));?>">
        <div class="rt-head <?php cx(array('no-border' => $noHeaderBorder));?>">
            <!--STYLE_PLACEHOLDER-->
            <!--debug-->
            <style>
            <?php
            foreach ($atom['css'] as $css) {
                echo $css;
            }
            ?>
            </style>
            <!--/debug-->
            <div class="rt-back OP_LOG_BACK">
                <?php echo $header['back']?>
            </div>
            <div class="rt-actions">
                <?php
                if (!empty($header['tools'])) {
                    foreach ($header['tools'] as $tool) {
                        echo $tool;
                    }
                }
                ?>
            </div>
            <div class="rt-center">
                <span class="rt-title"><?php echo $header['title']?></span>
                <span class="rt-subtitle"> <?php echo $header['subTitle']?></span>
            </div>
        </div>
        <div class="rt-body">
            <?php echo $atom['html']; ?>
            <!--SCRIPT_PLACEHOLDER-->
            <script src="/static/@baidu/esl/esl.js"></script>
            <!--inject-->
            <script>
            require.config({
                baseUrl: '/static',
                waitSeconds: 1
            });
            var root = '<?php echo $rootModule?>';
            var AtomMainComponent = root + '/<?php echo $component; ?>';
            var boot = root + '/common/index';
            var props = <?php echo json_encode($atom['props']) ?>;
            var data = {};

            <?php
            foreach ($atom['props'] as $prop) {
                if (isset($data[$prop])) {
                    echo 'data[' . json_encode($prop) . ']=' .json_encode($data[$prop]). ";\n";
                }
            }?>

            require([boot, AtomMainComponent], function (index, Component) {
                index.init(Component, data, props);
            });
            </script>
        </div>
    </div>
    <script>
    var root = '<?php echo $rootModule?>';
    var rt = root + '/common/rt';
    require([rt], function (rt) {
        rt.start();
    });
    </script><!--ignore-->
</div>
</body>
</html>
