/**
 * @file Ralltiir routes
 * @author leon <ludafa@outlook.com>
 */

export default [
    {
        pattern: '/',
        options: {
            view: {
                title: 'index',
                subtitle: 'index - subtitle',
                actions: [
                    {
                        html: '<i class="c-icon OP_LOG_SEARCH">&#xe737;</i>'
                    },
                    {
                        html: '<i class="c-icon OP_LOG_MENU">&#xe668;</i>'
                    }
                ]
            }
        }
    }
];
