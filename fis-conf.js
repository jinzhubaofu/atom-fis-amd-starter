/**
 * @file fis config
 * @author leon <ludafa@outlook.com>
 */


fis.set('project.fileType.text', 'atom');
fis.set('project.files', ['/src/**/*.php']);

// src 为项目目录
fis.match('/{node_modules, src}/**/*.js', {
    isMod: true,
    useSameNameRequire: true
});

// 页面
fis.match('/src/**/*.php', {
    isMod: true,
    isHtmlLike: true,
    useSameNameRequire: true
});

fis.match('(**)/(*).atom', {
    isMod: true,
    // fis3 不支持多重后缀，即不支持 .atom.js；
    rExt: 'js',
    useSameNameRequire: true,
    // 这里极为关键，不加 isJsLike 就不把我们当 js 处理了。
    isJsLike: true,
    // 输出为 commonjs 模块
    parser: fis.plugin('atom', {mode: 'commonjs'}),
    // 由于上边不支持多重后缀，所以我们这里 release 的时候加上后缀
    release: '$1/$2.atom.js'
});

// 用 loader 来自动引入资源。
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        useInlineMap: true,
        resourceType: 'amd'
    })
});

// 禁用 components
fis.hook('amd', {
    extList: ['.atom', '.js'],
    tab: 4,
    paths: {
        'vip-server-renderer': 'node_modules/vip-server-renderer'
    }
});

// 不需要处理的目录
fis.match('{output,scripts}/**', {
    release: false
});

// 生产环境构建
fis
    .media('prod')
    // 压缩 js
    .match('*.js', {
        optimizer: fis.plugin('uglify-js')
    })
    // 压缩 css
    .match('*.css', {
        optimizer: fis.plugin('clean-css')
    })
    // 加上 hash
    .match('*.{js,css,png,jpeg,jpg,gif,ttf,woff,woff2,svg}', {
        useHash: true
    })
    // 如果你需要在线上后把引用路径换成 cdn 地址，那么你可加上这一段
    // .match('*.js', {
    //     domain: 'http://your-cdn.baidu.com/your-cdn-prefix'
    // })
    .match('::package', {
        postpackager: fis.plugin('loader', {
            allInOne: {
                includeAsyncs: true,
                css: '${filepath}.bundle.css',
                js: '${filepath}.bunddle.js'
            }
        })
    });
