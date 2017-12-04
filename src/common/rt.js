/**
 * @file ralltiir bootstrap
 * @author leon <ludafa@outlook.com>
 */

import rt from 'ralltiir';
import Service from 'ralltiir-application';
import routes from './routes';

export function start() {
    routes.forEach(({pattern, options}) => rt.services.register(pattern, options, Service));
    rt.action.start();
}
