/**
 * @file fis config
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */
/* eslint-disable fecs-min-vars-per-destructure */

const path = require('path');
const {project} = require('./package.json');
const {
    dir,
    moduleName
} = project;

const {
    static: staticDir,
    template: templateDir
} = dir;

// 使用 amd hook 将所有模块包裹为 amd 输出
// 因此在 atom 转译和 bable 转译时都只需要输出为 commonjs 格式即可（输出为 amd 格式 amd hook 接受不了）
// amd-conf 中指定了依赖模块所处的路径
fis.hook('amd', require('./amd-conf'));

// 跳过框架包 ralltiir 的 amd 依赖分析，因为 ralltiir 会报大量的无用 warning
fis.match('/amd_modules/ralltiir/**', {
    skipDepsAnalysis: true
});

// 不需要处理的目录
fis.match('{output,docs,scripts}/**', {
    release: false
});

fis.set('project.fileType.text', ['atom', 'etpl']);
fis.set('project.files', [
    '/src/**/*',
    // 只输出 amd_modules 中的 js 和 css
    '/amd_modules/**/*.js',
    '/amd_modules/**/*.css',
    'map.json'
]);

// 所有的 src 下的文件都进行构建
fis.match('/src/(**)', {
    release: `${staticDir}/${moduleName}/$1`
});

fis.match('/src/(**).atom', {

    // 以模块分析 atom 文件
    isMod: true,

    // fis3 不支持多重后缀，即不支持 .atom.js；
    rExt: 'js',

    // atom 文件转译后的模块名
    moduleId: `${moduleName}/$1.atom`,

    useSameNameRequire: true,

    // 把 atom 当成 js 处理
    isJsLike: true,

    // 输出为 commonjs 模块
    parser: fis.plugin('atom', {mode: 'commonjs'}),

    // 由于上边不支持多重后缀，所以我们这里 release 的时候加上后缀
    // 此处需要将atom发布到指定的模块目录中
    release: `/${staticDir}/${moduleName}/$1.atom.js`

});

// 输出 php (包含 atom 编译出来的，也包含我们自己编写的)
fis.match('/src/(**).php', {

    // 按模块来处理
    isMod: true,

    // 按 html 来处理
    isHtmlLike: true,

    // 开启同名依赖
    useSameNameRequire: true,

    // 发布到模板目录中
    release: `/${templateDir}/$1.php`

});

// 处理 src 中的 css
fis.match('/src/(**).css', {

    // 要把 css 也按模块来处理，否则合并时会被跳过
    isMod: true,

    // 此处需要将 css 发布到指定的模块目录中
    release: `${staticDir}/${moduleName}/$1.css`

});

// 处理 src 中 js
fis.match('/src/(**).js', {

    // 需要按模块来处理 js 文件  =-=||
    isMod: true,

    // 将模块名中的 src 给去掉，否则 fis 会按文件名来完成 amd 模块名
    moduleId: `${moduleName}/$1`,

    // 将 js 模块发布到指定的模块目录中
    release: `/${staticDir}/${moduleName}/$1`,

    // 加入 js-require-css
    // 1. 在 js 模块中可以 `require('./xxx.css')`
    // 2. 在合并 atom 的 css 时，可以把 atom 所依赖的 css 一并提取出来
    preprocessor: fis.plugin('js-require-css'),

    // 用 babel 来做转译
    parser: fis.plugin('babel-6.x', {
        presets: [
            ['es2015', {modules: 'commonjs'}]
        ]
    })

});

// 处理依赖包中的 js / css
fis.match('amd_modules/(**).({js,css})', {
    moduleId: '$1',
    release: `${staticDir}/$1.$2`
});

// 不发布 mock 脚本
// 这个需要放在最后，以保证不会被普通js的规则覆盖
fis.match('/src/**.mock.js', {
    release: false
});

fis
    .media('dev')

    // 生成每个页面的入口 php
    .match('/src/(**)/index.atom', {
        preprocessor: fis.plugin(
            'generate-html',
            {
                template: path.join(__dirname, 'src/common/php/index.php'),
                output(filePath) {
                    let dir = path.dirname(filePath);
                    let ext = path.extname(filePath);
                    let basename = path.basename(filePath, ext);
                    return `${dir}${path.sep}${basename}.template.php`;
                },
                replace: ''
            }
        )
    });

fis
    .media('prod')
    // 生成每个页面的入口 php
    .match('/src/(**)/index.atom', {
        useHash: true,
        preprocessor: fis.plugin(
            'generate-html',
            {
                template: path.join(__dirname, 'src/common/php/index.php'),
                output(filePath) {
                    let dir = path.dirname(filePath);
                    let ext = path.extname(filePath);
                    let basename = path.basename(filePath, ext);
                    return `${dir}${path.sep}${basename}.template.php`;
                }
            }
        )
    })
    // 移除 php 中的 <!--debug-->
    .match('**.php', {
        parser: fis.plugin('jdists', {
            remove: 'debug'
        })
    })
    // 给各类源码加上 md5 值
    .match('/src/**.{js,atom,css,ttf,woff,woff2,svg,jpeg,jpg,png,gif}', {
        useHash: true,
        useMap: true
    })
    // 给 bundle 加上 md5 值
    .match('/bundle/**', {
        useHash: true
    })
    // 压缩 js
    .match('/{src,amd_modules}/**.{js,atom}', {
        optimizer: fis.plugin('uglify-js')
    })
    // 压缩 css
    .match('/src/**.css', {
        optimizer: fis.plugin('clean-css')
    })
    .match('::package', {
        postpackager: fis.plugin('loader', {
            include: [
                '/src/*/index.atom'
            ],
            useInlineMap: true
        })
    })
    .match('::packager', {
        packager: fis.plugin('deps-pack', {
            'bundle/vendor.js': [
                '/amd_modules/@baidu/esl/esl.js',
                '/amd_modules/@baidu/vip-server-renderer/js/atom.js',
                '/amd_modules/ralltiir.js',
                '/amd_modules/ralltiir.js:deps',
                '/amd_modules/ralltiir.js:asyncs',
                '/amd_modules/ralltiir-application/service.js',
                '/amd_modules/ralltiir-application/service.js:deps',
                '/amd_modules/ralltiir-application/service.js:asyncs'
            ],
            // 'bundle/common.js': [
            //     '/src/common/**.js',
            //     '/src/common/**.atom'
            // ],
            // 'bundle/common.css': [
            //     '/src/common/**/*.js:deps',
            //     '/src/common/**/*.atom:deps'
            // ],
            'bundle/biz.js': [
                '/src/*/index.atom',
                '/src/*/index.atom:deps',
                '/src/*/index.atom:asyncs'
            ],
            'bundle/biz.css': [
                '/src/*/index.atom:deps',
                '/src/*/index.atom:asyncs'
            ]
        })
    });
