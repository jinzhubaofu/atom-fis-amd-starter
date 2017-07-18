<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title><?php echo $title?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>
<body>
<?php echo $atom['html']?>
<script src="https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/efe/esl/2-1-6/esl.js" data-loader></script>
<script>
require(['vip-server-renderer/js/atom', 'src/Todo/index.atom'], function (Atom, App) {
    new Atom({
        el: '[atom-root]',
        data: <?php echo json_encode(array('list' => $list, 'name' => $name))?>,
        render: function (createElement) {
            return createElement('App', {
                props: {
                    <?php
                    foreach ($atom['props'] as $index => $prop) {
                        $propName = json_encode($prop);
                        $comma = $index === count($atom['props']) - 1 ? '' : ',';
                        echo "$propName: this[$propName]$comma";
                    }
                    ?>
                }
            });
        },
        components: {
            App: App
        }
    });
});
</script>
</body>
</html>
