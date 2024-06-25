import { toUpper } from 'assets/js';

const routes = []
// service 目录
// 支持 .jsx , app.js 文件当入口文件
const getModel = require.context('@/service', true, /\.jsx|app\.js$/, 'lazy');
getModel.keys().forEach(key => {
  const requirePath = key.replace(/^\./, '')
  let component = () => import(/* webpackChunkName: "[request]"*/ `@/service${requirePath}`)
  const getJSX = key.match(/^\.(.*)\.jsx$/);
  const getApp = key.match(/^\.\/(.*)\/app\.js$/);
  // 对jsx 路由 做 '/' 转驼峰处理
  const oldPath = Array.isArray(getJSX) && getJSX[1] && toUpper(getJSX[1].split('/').map(p => p.toLowerCase()).join('/'));
  const newPath = Array.isArray(getApp) && getApp[1];
  let path = '/service/' + (oldPath || newPath)
  routes.push({
    path,
    component,
    exact: true,
    mode: 'oldPage'
  });
});
export default routes