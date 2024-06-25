const routes = []
// 生产计划
const getModel = require.context('@/pages/productionPlan', true, /\/app\.js$/, 'lazy');
getModel.keys().forEach(key => {
  const requirePath = key.replace(/^\./, '')
  let component = () => import(/* webpackChunkName: "[request]"*/ `@/pages/productionPlan${requirePath}`)
  let path = key.match(/^\.(.*)\/app\.js$/)[1];
  routes.push({
    path,
    component,
    exact: true
  });
});

export default routes