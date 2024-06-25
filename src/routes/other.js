// 手动配置路由配置
// 路由的component 必须使用懒加载 component:  () => import(/* webpackChunkName: "my-chunk-name" */ '@/pages/index')
export default [
/**
 * 手动配置路由
 */
  {
    path: '/',
    component: () => import(/* webpackChunkName: "productionPlan" */ '@/views/index/app.js')
  },
  { // 生产计划
    path: '/pcsProductionPlan',
    component: () => import(/* webpackChunkName: "productionPlan" */ '@/pages/productionPlan/index.jsx')
  },
  { // 规则配置
    path: '/pcsProductionPlanRuleConfig',
    component: () => import(/* webpackChunkName: "pcsProductionPlanRuleConfig" */ '@/pages/productionPlan/base.jsx')
  },
  { // 环节人效
    path: '/pcsNodeEmployeeEffect',
    component: () => import(/* webpackChunkName: "pcsNodeEmployeeEffect" */ '@/pages/productionPlan/efficiency.jsx')
  },
  { // 用工计划管理
    path: '/pcsEmploymentPlan',
    component: () => import(/* webpackChunkName: "pcsEmploymentPlan" */ '@/pages/productionPlan/useWorkers.jsx')
  },
  { // 生产达成管理
    path: '/pcsProductionReach',
    component: () => import(/* webpackChunkName: "pcsProductionReach" */ '@/pages/productionPlan/produce.jsx')
  },
  { // 出库合单预测
    path: '/pcsOutStockNoticePre',
    component: () => import(/* webpackChunkName: "pcsOutStockNoticePre" */ '@/pages/productionPlan/mergeOrderForecast.jsx')
  },
  { // 生产进度压力监控
    path: '/pcsPressureMonitor',
    component: () => import(/* webpackChunkName: "pcsPressureMonitor" */ '@/pages/productionPlan/pressureMonitor.jsx')
  },

  {
    path: '/pcsUserSession',
    component: () => import(/* webpackChunkName: "pcsUserSession" */ '@/pcs/getUser/list')
  },
  {
    path: '/list-solutions',
    // component: () => import(/* webpackChunkName: "list-solutions" */ '@/pcs/sortingWallList/plan')
    component: () => import(/* webpackChunkName: "list-solutions" */ '@/noshelf/sortingWallPlan/app.js')
  },
  {
    path: '/pcsStorageSetting',
    component: () => import(/* webpackChunkName: "pcsStorageSetting" */ '@/pcs/storagePosition/setting')
  },
  {
    path: '/pcsWarehouseSortingWall',
    component: () => import(/* webpackChunkName: "pcsWarehouseSortingWall" */ '@/pcs/sortingWall/manage')
  },
  {
    path: '/pcsSortWallManage',
    component: () => import(/* webpackChunkName: "pcsSortWallManage" */ '@/pcs/sortWallManage/wallList')
  },
  {
    path: '/pcsSortSlotDetail',
    component: () => import(/* webpackChunkName: "pcsSortSlotDetail" */ '@/pcs/sortWallManage/sortSlotDetail')
  },
  {
    path: '/pcsSortWallDetail',
    component: () => import(/* webpackChunkName: "pcsSortWallDetail" */ '@/pcs/sortWallManage/sortWallDetail')
  },
  {
    path: '/pcsOnShelvesPackageDetail',
    component: () => import(/* webpackChunkName: "pcsOnShelvesPackageDetail" */ '@/pcs/inventoryDetail/list')
  },
  {
    path: '/pcsStorageCapacity',
    component: () => import(/* webpackChunkName: "pcsStorageCapacity" */ '@/pcs/storageCapacity/list')
  },
  {
    path: '/pcsStorageCapacityReport',
    component: () => import(/* webpackChunkName: "pcsStorageCapacityReport" */ '@/pcs/storageCapacity/report/list')
  },
  {
    path: '/pcsOrderSplitRatio',
    component: () => import(/* webpackChunkName: "pcsOrderSplitRatio" */ '@/pcs/orderSplit/list')
  },
  {
    path: '/package/preset/intercept',
    component: () => import(/* webpackChunkName: "package_preset_intercept" */ '@/pcs/packagePreset/interception')
  },
  {
    path: '/package/preset/find',
    component: () => import(/* webpackChunkName: "package_preset_find" */ '@/pcs/packagePreset/finding')
  },
  {
    path: '/packageline/index',
    component: () => import(/* webpackChunkName: "packageline_index" */ '@/pcs/packageLine/index')
  },
  {
    path: '/service/pcsWarehouseZipcoderule',
    component: () => import(/* webpackChunkName: "service_pcsWarehouseZipcoderule" */ '@/service/warehouse/zipcodeRule')
  },
  {
    path: '/service/pcsWarehouseCustomsClearanceRule',
    component: () => import(/* webpackChunkName: "service_pcsWarehouseCustomsClearanceRule" */ '@/service/warehouse/customsClearanceRule')
  },
  {
    path: '/service/pcsCustomerDistributiongroupManage',
    component: () => import(/* webpackChunkName: "service_pcsCustomerDistributiongroupManage" */ '@/service/distributionGroup/manage')
  },
// 动态路由
  // {
  //   path: '/pages/:path',
  //   component: () => import(/* webpackChunkName: "old_pages" */ '@/views/pages')
  // },
  // {
  //   path: '/servicepages/:path',
  //   component: () => import(/* webpackChunkName: "old_service_page" */ '@/views/servicepages')
  // },
  {
    path: '/fbi/report/:id',
    component: () => import(/* webpackChunkName: "FBi_report" */ '@/views/fbi/report')
  },
  {
    path: '/icestark/:id',
    component: () => import(/* webpackChunkName: "ICESTARK" */ '@/views/fbi/icestark')
  },
  {
    path: '/icestark/service/:id',
    component: () => import(/* webpackChunkName: "ICESTARK" */ '@/views/fbi/icestark')
  },
  // // 新大包查询 
  // {
  //   path: '/service/bigpackageReport',
  //   component: () => import(/* webpackChunkName: "service_bigpackageReport" */ '@/service/bigpackageReport/app')
  // },
]
