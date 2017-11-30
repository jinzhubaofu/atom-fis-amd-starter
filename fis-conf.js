/**
 * @file fis config
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */
/* eslint-disable fecs-min-vars-per-destructure */

const path = require('path');
const {project} = require('./package.json');
const {
    staticDir = 'static',
    templateDir = 'template',
    moduleName
} = project;

// 使用 amd hook 将所有模块包裹为 amd 输出
// 因此在 atom 转译和 bable 转译时都只需要输出为 commonjs 格式即可（输出为 amd 格式 amd hook 接受不了）
// amd-conf 中指定了依赖模块所处的路径
fis.hook('amd', require('./amd-conf'));

// 跳过框架包 ralltiir 的 amd 依赖分析，因为 ralltiir 会报大量的无用 warning
fis.match('/amd_modules/ralltiir/**', {
    skipDepsAnalysis: true
});

// 不需要处理的目录
fis.match('{output,output2,scripts}/**', {
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
    release: `${staticDir}/$1`
});

fis.match('/src/(**).atom', {
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
    release: `/${staticDir}/$1.atom.js`

});

fis.match('/src/(**)/index.atom', {
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
});

// 输出 php (包含 atom 编译出来的，也包含我们自己编写的)
fis.match('/src/(**).php', {
    isMod: true,
    isHtmlLike: true,
    useSameNameRequire: true,
    release: `/${templateDir}/$1.php`
});

// 处理 src 中的 css
fis.match('/src/(**).css', {
    // 要把 css 也按模块来处理，否则合并时会被跳过
    isMod: true,
    useSameNameRequire: true,
    release: `${staticDir}/$1.css`
});

// 处理 src 中 js
fis.match('/src/(**).js', {

    // 需要按模块来处理 js 文件  =-=||
    isMod: true,

    // 将模块名中的 src 给去掉，否则 fis 会按文件名来完成 amd 模块名
    moduleId: `${moduleName}/$1`,

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

fis.match('::package', {
    postpackager: fis.plugin('loader', {
        allInOne: {
            css: `${staticDir}/index.bundle.css`,
            js: `${staticDir}/index.bundle.js`
        }
    })
});

fis.match('::packager', {
    packager: fis.plugin('deps-pack', {
        'dist/vendor.js': [
            '/amd_modules/@baidu/esl/esl.js',
            '/amd_modules/@baidu/vip-server-renderer/js/atom.js',
            '/amd_modules/ralltiir.js',
            '/amd_modules/ralltiir.js:deps',
            '/amd_modules/ralltiir.js:asyncs',
            '/amd_modules/ralltiir-application/service.js',
            '/amd_modules/ralltiir-application/service.js:deps',
            '/amd_modules/ralltiir-application/service.js:asyncs'
        ],
        'dist/common.js': [
            '/src/common/**.js',
            '/src/common/**.atom'
        ],
        'dist/common.css': [
            '/src/common/**/*.js:deps',
            '/src/common/**/*.atom:deps'
        ],
        'dist/Home.js': [
            '/src/Home/index.atom',
            '/src/Home/index.atom.js',
            '/src/Home/index.atom.js:deps',
            '/src/Home/index.atom:deps',
            '/src/Home/index.atom:asyncs'
        ],
        'dist/Home.css': [
            '/src/Home/index.atom:deps'
        ],
        'dist/Todo.js': [
            '/src/Todo/index.atom',
            '/src/Todo/index.atom:deps',
            '/src/Todo/index.atom:asyncs'
        ],
        'dist/Todo.css': [
            '/src/Todo/index.atom:deps'
        ]
    })
});
