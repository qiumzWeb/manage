const routes = []
// 仓库配置目录
const getModel = require.context('@/pages/warehouseConfiguration', true, /\/app\.js$/, 'lazy');
getModel.keys().forEach(key => {
  const requirePath = key.replace(/^\./, '')
  let component = () => import(/* webpackChunkName: "[request]"*/ `@/pages/warehouseConfiguration${requirePath}`)
  let path = key.match(/^\.(.*)\/app\.js$/)[1];
  routes.push({
    path,
    component,
    exact: true
  });
});

export default routes