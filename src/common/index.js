/**
 * @file main entry
 * @author leon <ludafa@outlook.com>
 */

import Atom from '@baidu/vip-server-renderer/js/atom';
import ralltiir from 'ralltiir';
import Service from 'ralltiir-application';

import 'ralltiir-application/view/rt-view.css';

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
            console.log('props', a);
            return createElement(
                'app',
                {
                    props: a
                }
            );
        }
    });
}
