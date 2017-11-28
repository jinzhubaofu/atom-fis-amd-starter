/**
 * @file fis config
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */
/* eslint-disable fecs-min-vars-per-destructure */

fis.set('project.fileType.text', ['atom', 'etpl']);
fis.set('project.files', [
    '/src/**/*',
    // 只输出 amd_modules 中的 js 和 css
    '/amd_modules/**/*.js',
    '/amd_modules/**/*.css',
    'map.json'
]);


fis.match('/output2/**', {
    release: false
});

fis.match('/{node_modules, src, amd_modules}/**/*.js', {
    isMod: false,
    useSameNameRequire: true
});

// 所有的 src 下的文件都进行构建
fis.match('/src/(**)', {
    release: '/static/$1'
});

fis.match('/src/(**)/(*).atom', {
    isMod: true,
    // fis3 不支持多重后缀，即不支持 .atom.js；
    rExt: 'js',
    useSameNameRequire: true,
    // 这里极为关键，不加 isJsLike 就不把我们当 js 处理了。
    isJsLike: true,
    // 输出为 commonjs 模块
    parser: fis.plugin('atom', {mode: 'amd'}),
    // 由于上边不支持多重后缀，所以我们这里 release 的时候加上后缀
    release: 'static/$1/$2.atom.js'
});

// 输出 php (包含 atom 编译出来的，也包含我们自己编写的)
fis.match('/src/(**).php', {
    isMod: true,
    isHtmlLike: true,
    useSameNameRequire: true,
    release: '/template/$1.php'
});

fis.match('/src/(**).css', {
    isMod: true,
    isHtmlLike: true,
    useSameNameRequire: true,
    release: '/static/$1.css'
});

// 将模块名中的 src 给去掉
fis.match('/src/(**.js)', {
    moduleId: '$1',
    parser: fis.plugin('babel-6.x', {
        presets: [
            ['es2015', {modules: 'amd'}]
        ]
    })
});

fis.match('/src/(**.atom)', {
    moduleId: '$1'
});

// 处理 amd_modules
fis.match('amd_modules/(**).js', {
    moduleId: '$1',
    release: '/static/$1.js'
});

fis.match('amd_modules/(**).css', {
    release: '/static/$1.css'
});

// 不需要处理的目录
fis.match('{output,scripts}/**', {
    release: false
});
