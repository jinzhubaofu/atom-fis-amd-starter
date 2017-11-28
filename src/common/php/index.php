<?php require_once(__DIR__.'/utils.php');?>
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title><?php echo htmlentities($data['title'])?></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="x5-orientation" content="portrait">
</head>
<body>
<?php
$sfHeader = empty($data['sfHeadConfig']) ? array() : $data['sfHeadConfig'];
$noViewBorder = !empty($sfHeader['sfNoneViewBorder']);
$noHeaderBorder = !empty($sfHeader['sfNoneHeaderBorder']);
?>
<div id="sfr-app">
    <div class="rt-view active <?php cx(array('no-border' => $noViewBorder));?>">
        <div class="rt-head <?php cx(array('no-border' => $noHeaderBorder));?>">
            <div class="rt-back OP_LOG_BACK">
                <?php echo $sfHeader['sfBack']?>
            </div>
            <div class="rt-actions">
                <?php echo $sfHeader['sfToolOne']?>
                <?php echo $sfHeader['sfToolTwo']?>
            </div>
            <div class="rt-center">
                <span class="rt-title"><?php echo $sfHeader['sfTitle']?></span>
                <span class="rt-subtitle"> <?php echo $sfHeader['subtitle']?></span>
            </div>
        </div>
        <div class="rt-body">
            <link rel="stylesheet" href="/static/ralltiir-application/view/rt-view.css">
            <?php
            foreach ($atom['css'] as $css) {
                echo '<link rel="stylesheet" href="/static/' . $css['path'] . '">';
            }
            ?>
            we are rendering <?php echo $component; ?>
            <?php echo $atom['html']; ?>
        </div>
    </div>
</div>
<script src="/static/@baidu/esl/esl.js"></script><!--ignore-->
<!--SCRIPT_PLACEHOLDER-->
<script>
require.config({
    baseUrl: '/static'
});
var component = '<?php echo $component; ?>';
require([component, 'ralltiir', 'ralltiir-application/service'], function (Component) {
    console.log(Component);
});
</script>
</body>
</html>
