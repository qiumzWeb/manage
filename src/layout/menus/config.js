import React from 'react'
import HomeIcon from 'assets/imgs/home'
import CkrwIcon from 'assets/imgs/ckrw'
import YcclIcon from 'assets/imgs/yccl'
import ZydIcon from 'assets/imgs/zyd'
import JcpzIcon from 'assets/imgs/jcpz'
import XtczIcon from 'assets/imgs/xtcz'
import SjyyIcon from 'assets/imgs/sjyy'
import KfxtIcon from 'assets/imgs/kfxt'
import ScjhIcon from 'assets/imgs/scjh'
import { getUuid, deepForEach } from 'assets/js/index'

// ICON 配置
export const icons = {
  default: {icon: <ZydIcon></ZydIcon>},
  999999999: { name: '首页', icon: <HomeIcon></HomeIcon>}, 
  9676: { name: '出库任务', icon: <CkrwIcon></CkrwIcon> },
  9677: { name: '作业单', icon: <ZydIcon></ZydIcon> },
  9678: { name: '异常处理', icon: <YcclIcon></YcclIcon> },
  9849: { name: '基础配置和系统操作', icon: <JcpzIcon></JcpzIcon> },
  10432: { name: '系统操作菜单', icon: <XtczIcon></XtczIcon> },
  10519: { name: '数据化运营体系', icon: <SjyyIcon></SjyyIcon> },
  43154: { name: '生产计划运营体系', icon: <ScjhIcon></ScjhIcon> },
  9662: { name: '客服管理系统', icon: <KfxtIcon></KfxtIcon> },
  58726: {name: '生产监控', icon: <ScjhIcon></ScjhIcon> },
}

// 菜单配置
export const DefineMenu = [
  // {href: '/warehouseConfigList', text: '开仓配置', id: 10005, parentMenuId: 9661},
  {
    href: null,
    id: 587269,
    isBlank: false,
    isOpen: true,
    menuCode: "pcs-wms-manage#menu#bmmonitor",
    mobileIcon: null,
    parentMenuId: 9661,
    text: "预发测试菜单",
    childrens: [
      {href: '/waveOrderBoard', text: '波次&堆垛架库区看板', id: 10002, parentMenuId: 587269 },
      {href: '/sowingBatchBoard', text: '播种批次看板', id: 10003, parentMenuId: 587269 },
      // {href: '/storageAreaGroupWaveConfig', text: '库区组波次配置', id: 10004, parentMenuId: 587269 },
      // {href: '/andonManagerReport', text: 'ANDON报表', id: 10006, parentMenuId: 587269 },
      // {href: '/prodPlanConfigurationList', text: '生产计划配置项', id: 10007, parentMenuId: 587269}, 
      // {href: '/schedulingSuggestionConfiguration', text: '调度建议配置', id: 10005, parentMenuId: 587269 },
      // {href: '/abnormalWarnAndScheduleSugges', text: '异常预警&调度建议', id: 10008, parentMenuId: 587269 },
      // {href: '/conveyorBeltRecommendationScan', text: '传送带扫描推荐配置', id: 10009, parentMenuId: 587269 },
      // {href: '/sowRecommendationConfiguration', text: '闪电播设备配置', id: 10010, parentMenuId: 587269 },
      // {href: '/delayPackageReport', text: '滞溜包裹监控报表', id: 10011, parentMenuId: 587269 },
      // {href: '/abnormalWarnConfig', text: '异常预警配置', id: 10012, parentMenuId: 587269 },
      // {href: '/addWarehouse', text: '新增仓库', id: 10013, parentMenuId: 587269 },
      // {href: '/storageAreaGroupConfig', text: '库区组配置', id: 10014, parentMenuId: 587269 },
      // {href: '/districtManage', text: '库区管理', id: 10015, parentMenuId: 587269 },
      // {href: '', text: '', id: 10016, parentMenuId: 587269 },
    ]
  },
]


// 一键开仓导向菜单
let warehouseMenuMap = {}
export const warehouseStepMenu = deepForEach([
  {
    text: "开仓配置项",
    childrens: [
      {href: '/addWarehouse', text: '新增仓库'},
      {href: '/pcsVirtualWarehouseManage', text: '新增虚仓'},
      {href: '/districtManage', text: '库区管理'},
      {href: '/pcsLanewayList', text: '巷道管理'},
      {href: '/pcsStorageList', text: '库位管理'},
      {href: '/storageAreaGroupConfig', text: '库区组配置'},
      {href: '/signConfig', text: '签收配置'},
      {href: '/pcsInstockConfig', text: '入库扫描配置'},
      {href: '/pcsWarehousePutawayRecommendation', text: '上架推荐配置'},
      {href: '/pcsWarehouseTaskAllocationConfig', text: '下架波次规则'},
      {href: '/pcsWarehousePackageMergeWeightConfig', text: '合箱称重配置'},
      {href: '/pcsExceptionTypeList', text: '异常类型配置'},
      {href: '/sortingWallPlan', text: '分拣计划配置'},
      {href: '/pcsContainermanageIndex', text: '容器管理'},
      {href: '/pcsWarehouseSortingWall', text: '分拨墙配置'},
      {href: '/pcsWarehousePackageMergeVolumeConfig', text: '包材主数据配置'},
      {href: '/pcsDistributionGroupManage', text: '责任组业务分配'},
      {href: '/abnormalWarnConfig', text: '异常预警配置'},
      {href: '/broadcast', text: '数据播报配置'},
      {href: '/kpiConfigList', text: 'KPI计算引擎配置'},
      {href: '/breakTimeMonitorConfig', text: '包裹分段时长配置'},
    ]
  }
], {
  childrenCode: 'childrens',
  callBack: (item, parent) => {
    item.id = getUuid(2001)
    item.parentMenuId = parent && parent.id || getUuid(2001)
    if (item.href) {
      warehouseMenuMap[item.href] = item
    }
  }
})
export {
  warehouseMenuMap
}