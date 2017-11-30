/**
 * @file amd 加载器配置
 * @author leon <ludafa@outlook.com>
 */

// 此模块只是给 fis 构建时使用，主要用于配置第三方依赖包的路径
module.exports = {
    paths: {
        'vip-server-renderer': '/amd_modules/@baidu/vip-server-renderer/js/atom',
        'ralltiir': '/amd_modules/ralltiir'
    },
    packages: [
        {
            name: 'ralltiir-application',
            main: 'service',
            location: '/amd_modules/ralltiir-application'
        }
    ]
};
