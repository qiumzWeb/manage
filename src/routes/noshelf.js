import { upperToLine } from 'assets/js';

const routes = []
// report 目录
const getModel = require.context('@/noshelf', true, /\/app\.js$/, 'lazy');
getModel.keys().forEach(key => {
  const requirePath = key.replace(/^\./, '')
  let component = () => import(/* webpackChunkName: "[request]"*/ `@/noshelf${requirePath}`)
  let path = key.match(/^\.(.*)\/app\.js$/)[1];
  routes.push({
    path,
    component,
    exact: true
  });
});

export default routes