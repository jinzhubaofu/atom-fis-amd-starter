/**
 * @file main entry
 * @author leon <ludafa@outlook.com>
 */

import Atom from '@baidu/vip-server-renderer/js/atom';

export function init(MainComponent, data, props) {
    new Atom({
        el: '[atom-root]',
        data: data,
        components: {
            app: MainComponent
        },
        render(createElement) {
            let a = props.reduce(
                (props, prop) => {
                    props[prop] = this[prop];
                    return props;
                },
                {}
            );
            return createElement(
                'app',
                {
                    props: a
                }
            );
        }
    });
}
