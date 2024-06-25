import { upperToLine } from 'assets/js';

const routes = []
// report 目录
const getModel = require.context('@/largeScreenData', true, /\/app\.js$/, 'lazy');
getModel.keys().forEach(key => {
  const requirePath = key.replace(/^\./, '')
  let component = () => import(/* webpackChunkName: "[request]"*/ `@/largeScreenData${requirePath}`)
  let path = key.match(/^\.(.*)\/app\.js$/)[1];
  routes.push({
    // mode == fullScreen 则页面无背景色， 无底部工具栏
    mode: 'fullScreen',
    path,
    component,
    exact: true
  });
});

export default routes