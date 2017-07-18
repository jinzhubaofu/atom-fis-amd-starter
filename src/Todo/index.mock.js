/**
 * @file index atom mock data
 * @author leon <ludafa@outlook.com>
 */

module.exports = function (request) {
    return {
        title: 'hello atom! ',
        name: '你好世界',
        list: [
            {name: 'vue', like: 100},
            {name: 'atom', like: 200},
            {name: request, like: 0}
        ]
    };
};
