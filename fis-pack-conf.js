/**
 * @file fis conf for production
 * @author leon <ludafa@outlook.com>
 */

fis.set('project.fileType.text', ['atom', 'etpl']);
fis.project.setProjectRoot('./output');
fis.set('project.files', [
    '/static/**',
    '/template/**',
    'map.json'
]);

fis.match('**', {
    release: true
});

fis.match('**.{js,css,ttf,woff,woff2,svg}', {
    useHash: true
});

// 将 .atom 和 .js 模块封装为 amd 格式
fis.hook('amd', Object.assign(
    {
        extList: ['.atom', '.js'],
        tab: 4
    }
));


fis.match('(static/**)', {
    release: '$1'
});

fis.match('(template/**)', {
    release: '$1',
    useMap: true
});

fis.match('/static/(**.atom.js)', {
    moduleId(m) {
        return m[1].replace(/\.js$/, '');
    }
});

fis.match('static/(**.js)', {
    moduleId(m) {
        return m[1].replace(/\.js$/, '');
    }
});


fis.match('::package', {
    postpackager: fis.plugin('loader', {
        include: [
            '/static/**/*.atom.js'
        ],
        allInOne: {
            css: '/static/index.bundle.css',
            js: '/static/index.bundle.js'
        }
    })
});

fis.match('::packager', {
    packager: fis.plugin('deps-pack', {
        'dist/vendor.js': [
            '/static/esl.js',
            '/static/ralltiir.js',
            '/static/ralltiir-application/service.js',
            '/static/vip-server-renderer/js/atom.js'
        ],
        'dist/vendor.css': [
        ],
        'dist/common.js': [
            '/static/common/**/*.js',
            '/static/ralltiir-application/view/rt-view.css'
        ],
        'dist/Home.js': [
            '/static/Home/index.atom.js',
            '/static/Home/index.atom.js:deps',
            '/static/Home/index.atom.js:asyncs'
        ],
        'dist/Home.css': [
            '/static/Home/**.css'
        ],
        'dist/Todo.js': [
            '/static/Todo/index.atom.js',
            '/static/Todo/index.atom.js:deps',
            '/static/Todo/index.atom.js:asyncs'
        ],
        'dist/Todo.css': [
            '/static/Todo/**.css'
        ]
    })
});
