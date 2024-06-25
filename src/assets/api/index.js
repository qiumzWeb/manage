import { apiBase as preApi} from 'assets/js/proxy-utils'
const API = {
  // 查询员工
  getJobName: name => `/sys/user/drop/${name}`,
  // 天眼开关
  getEyeSwitch: '/sys/packageMergeWeightConfig/eyeVideoConfig/get',
  saveEyeSwitch: '/sys/packageMergeWeightConfig/eyeVideoConfig/modify',

  // 下载中心
  downloadCenterList: '/pcsweb/sys/export/list',
  downloadCenterHandle: '/pcsweb/sys/export/generate',
  downloadCenterFile: '/pcsweb/sys/export/download',
  // 菜单
  // getMenu: '/permission/getMenus.json',
  getMenu: preApi + '/getMenus',
  getServiceMenu: '/pcsservice/getMenus',
  'menu': '/menu',
  //顶部导航栏
  'getPlatformTabs': '/getPlatformTabs',
  //用户信息
  'getUser': '/buc/getUser',
  getUserInfo: '/getBaseUserInfo',
  getUser: '/gos/permission/getUser',
  // 获取仓库名称
  getWarehouseName: '/sys/warehouses/',
  // 获取仓库及公司名称
  getCompanyWareHouseList: '/pcsapiweb/getWarehouseList',
  //语言信息
  'getLanguages': '/locales',

  'test': '/test/test',
  'queryDeclareData': '/pam/queryDeclareData',
  'queryPamStatus': '/pam/queryPamStatus',
  'cancelPam': '/pam/cancelPam',
  'exportPam': '/pam/exportPam',
  //业务类型
  "getServiceTypeIndexList": "/baseData/serviceTypeIndex/list",

  //订单拆单
  "getOrderSplitList": "/pcs/separateorder/detail/list",
  getOrderSplitListOver: '/pcs/separateorder/detail/perform',
  setOrderSplitListOver: '/pcs/separateorder/detail/overPerform',
  "exportOrderSplitList": "/pcs/separateorder/detail/export",

  // 仓库列表
  "getCompanyNameList": "/sys/companies/names",
  "getWarehouseList": "/sys/warehouses",
  "getWarehouseNameList": preApi + "/sys/warehouses/names",
  // "getWarehouseNameList": '/pcsapiweb/getWarehouseList',
  "createWarehouse": "/sys/warehouses",
  "modifyWarehouse": "/sys/warehouses",
  "deleteWarehouse": "/sys/warehouses",

  // 虚仓管理
  "getVirtualWarehouseList": "/sys/virtual-warehouses",
  "createVirtualWarehouse": "/sys/virtual-warehouses",
  "modifyVirtualWarehouse": "/sys/virtual-warehouses",
  "deleteVirtualWarehouse": "/sys/virtual-warehouses",

  // 库区管理
  "getDataDictionaryByType": "/sys/data/dictionary/getZhCnVoByType",
  "getZipGroup": "/sys/data/dictionary/getZipGroup",
  "getWareHouseDistrict": "/sys/warehouseDistrict/get",
  "getWareHouseDistrictList": "/sys/warehouseDistrict/list",
  "addWareHouseDistrict": "/sys/warehouseDistrict/add",
  "modifyWareHouseDistrict": "/sys/warehouseDistrict/modify",
  "deleteWareHouseDistrict": "/sys/warehouseDistrict/delete",
  "getAdministrativeAreaList": "/sys/warehouseDistrict/administrativeAreaList",
  "districtModifyRecommendType": "/sys/warehouseDistrict/recommendType/modify",
  "batchUpdatedistrictByCondition": "/sys/warehouseDistrict/batchUpdate/{warehouseId}/byCondition",

  "getLanewayList": "/sys/laneway/list",
  "addLaneway": "/sys/laneway/save",
  "modifyLaneway": "/sys/laneway/save",
  "physicalAssign": "/sys/warehouseDistrict/physicalAssign",
  "getPhysicalAssignByWarehouseDistrictId": "/sys/warehouseDistrict/getPhysicalAssignByWarehouseDistrictId",
  "getTreeByWarehouseIdAndDistrictId": "/sys/laneway/getTreeByWarehouseIdAndDistrictId",
  "getPhysicalAssignPreviewByPhysicalAssignDTO": "/sys/warehouseDistrict/getPhysicalAssignPreviewByPhysicalAssignDTO",
  "getDistrictNames": "/sys/warehouseDistrict/names/{warehouseId}",
  "getAssiginedDistrictNames": "/sys/warehouseDistrict/assignNames/{warehouseId}",
  "getDistrictStorageTypeNames": "/sys/warehouseDistrict/storageTypeNames",
  "getDistrictBagTypeNames": "/sys/warehouseDistrict/bagTypeNames",

  // 库位管理
  "getPcsStorageList": "/sys/storagelocation/list",
  "getRoadWayListByWarehouseId": "sys/laneway/get",
  "getShelvesListByRoadWayId": "/sys/storagelocation/getShelvesListByRoadWayId",
  "addSysShelves": "/sys/storagelocation/addSysShelves",
  "updateSysShelves": "/sys/storagelocation/updateSysShelves",
  "getSysShelvesById": "/sys/storagelocation/getSysShelvesById",
  "createSysStoragePositions": "/sys/storagelocation/createSysStoragePositions",
  "preiewSysStoragePositions": "/sys/storagelocation/preiewSysStoragePositions",
  preiewSysStoragePositionsList: '/sys/storagelocation/previewSysStoragePositions/pageList',
  "checkIsCreatedStoragePositions": "/sys/storagelocation/checkIsCreatedStoragePositions",
  "exportShelvesList": "/sys/storagelocation/exportShelvesList",
  "getShelvesListByRoadWayIdForTree": "/sys/storagelocation/getShelvesListByRoadWayIdForTree",
  "getRowsByShelveIdForTree": "/sys/storagelocation/getRowsByShelveIdForTree",

  "getLanewayTree": "/sys/laneway/getLanewayTree",
  "queryStoragePositionList": "/sys/storagePosition/query",
  "batchDeleteStoragePosition": "/sys/storagePosition/batchDelete",
  "batchRestoreStoragePosition": "/sys/storagePosition/batchRestore",

  "uploadPickPriority": preApi +  "/sys/uploadPickPriority",

  "uploadStorageExcel": preApi +  "/sys/storagelocation/batchAddSysShelves",

  // 包裹拦截
  "uploadInterceptionPackages": preApi +  "/package/preset/intercept/upload",
  "listInterceptionPackages": "/package/preset/intercept/list",

  // 找货任务
  "uploadFindingPackages": preApi +  "/package/preset/finding/upload",
  "listFindingTasks": "/package/preset/finding/task/list",
  "commentFindingTask": "/package/preset/finding/task/comment",
  "getFindingTaskDetail": "/package/preset/finding/task/detail",
  "closeFindingTask": "/package/preset/finding/task/close",
  "listFindingPkgs": "/package/preset/finding/pkg/list",
  "exportFindingPkgs": "/package/preset/finding/pkg/export",
  "tagFindingLost": "/package/preset/finding/pkg/lost/tag",
  "tagFindingFound": "/package/preset/finding/pkg/found/tag",
  "confirmFindingLost": "/package/preset/finding/pkg/lost/confirm",
  "forceFindingLost": "/package/preset/finding/pkg/lost/force",

  //库位配置
  "querySroragePositionsForSetting": "/sys/storagePosition/setting/{warehouseId}/query",
  "modifyRecommendType": "/sys/storagePosition/setting/{warehouseId}/recommendType/modify",
  "getAssignedLaneways": "/sys/laneway/getAssignedLaneways/{warehouseId}",
  "batchUpdatePositions": "/sys/storagePosition/setting/{warehouseId}/batchUpdate",
  "batchUpdatePositionsByCondition": "/sys/storagePosition/setting/{warehouseId}/batchUpdate/byCondition",
  "getSameShelveCodeListUnderRoadway": "/districtAssigin/assignedShelveCodes/{warehouseId}",
  "getSameRowNoListUnderShelve": "/districtAssigin/assignedRowNos/{warehouseId}",

  //库容统计
  "queryStorageCapacity": "/sys/storageCapacity/{warehouseId}/query",

  // 装袋规则配置
  "getBaggingRuleList": "/sys/baggingRule/list",
  "getBaggingRule": "/sys/baggingRule/get",
  "addBaggingRule": "/sys/baggingRule/add",
  "modifyBaggingRule": "/sys/baggingRule/modify",
  "deleteBaggingRule": "/sys/baggingRule/delete",
  "getPickupStationList": "/sys/data/dictionary/getPickupStationListByChannelCode",
  "getSortCodeList": "/sys/data/dictionary/getSortCodeList",

  // 省市区级联选择
  "getSysAreaList": "/sys/data/dictionary/getSysArea",

  // 仓库责任组业务分配
  "getDistributionGroupList": "sys/distributiongroup/getDistributionGroupList",
  "getServiceIdListByServiceType": "sys/distributiongroup/getServiceIdListByServiceType",
  "addDistributionGroup": "sys/distributiongroup/insertDistributionGroup",
  "updateDistributionGroup": "sys/distributiongroup/updateDistributionGroup",
  "deleteDistributionGroup": "sys/distributiongroup/deleteDistributionGroup",
  "getSysDutygroupRefById": "sys/distributiongroup/getSysDutygroupRefById",
  "getSysDutygroupRefList": "sys/distributiongroup/list",

  // 自动分拣配置
  "searchAutoSortingConfig": "/sys/autoSortingConfig/search",
  "getPassNoList": "/sys/autoSortingConfig/passNoList",
  "getMatchTypeList": "/sys/autoSortingConfig/matchTypeList",
  "getDeliveryChannelList": "/sys/autoSortingConfig/deliveryChannelList",
  "getCountryList": "/sys/autoSortingConfig/countryList",
  "getCountryListWithCity": "/sys/autoSortingConfig/countryListWithCity",
  "getCityListByCountry": "/sys/autoSortingConfig/cityList",
  "getZipCodeListByCity": "/sys/autoSortingConfig/zipCodeList",
  "getPickUpChannelList": "/sys/autoSortingConfig/pickUpChannelList",
  "getPickUpChannelListWithStation": "/sys/autoSortingConfig/pickUpChannelListWithStation",
  "getPickUpStationListByChannel": "/sys/autoSortingConfig/pickUpStationList",
  "getSortingCodeList": "/sys/autoSortingConfig/sortingCodeList",
  "editAutoSortingConfig": "/sys/autoSortingConfig/edit",
  "deleteAutoSortingConfig": "/sys/autoSortingConfig/delete",

  // 客服责任组业务分配
  "getCustomerDistributionGroupList": "sys/distributiongroup/getDistributionGroupList",
  "getCustomerServiceIdListByServiceType": "sys/distributiongroup/getServiceIdListByServiceType",
  "addCustomerDistributionGroup": "sys/distributiongroup/insertDistributionGroup",
  "updateCustomerDistributionGroup": "sys/distributiongroup/updateDistributionGroup",
  "deleteCustomerDistributionGroup": "sys/distributiongroup/deleteDistributionGroup",
  "getCustomerSysDutygroupRefById": "sys/distributiongroup/getSysDutygroupRefById",
  "getCustomerSysDutygroupRefList": "sys/distributiongroup/list",

  // 邮编校验规则配置
  "getZipcodeValidateRuleList": "/sys/exceptionZipcodeRule/list",
  "getZipcodeValidateRule": "/sys/exceptionZipcodeRule/get",
  "addZipcodeValidateRule": "/sys/exceptionZipcodeRule/add",
  "modifyZipcodeValidateRule": "/sys/exceptionZipcodeRule/modify",
  "deleteZipcodeValidateRule": "/sys/exceptionZipcodeRule/delete",
  "getCustomsLiquidationRuleList": "/sys/customs/liquidation/rule/list",
  "getDistrictByShortCode": "/area/district/shortCode",
  "saveCustomslLiquidationValue": "/sys/customs/liquidation/rule/save",

  // 入库扫描配置
  "getInstockConfigList": "/sys/instockConfig/list",
  "editInstockConfig": "/sys/instockConfig/edit",
  "deleteInstockConfig": "/sys/instockConfig/delete",

  // 任务分配
  "getSysWarehouseTaskAllocationConfigList": "/sys/warehouse/task/allocation/config/list",
  "saveSysWarehouseTaskAllocationConfig": "/sys/warehouse/task/allocation/config/save",
  "getTaskOptionConfig": "/sys/warehouse/task/allocation/config/getTaskOptionConfig",
  "getSysWarehouseDistrictTree": "/sys/warehouse/task/allocation/config/warehouseDistrictTree",
  "getWarehouseDistrictList": "/sys/warehouse/task/allocation/config/listWarehouseDistrict",

  // 上架推荐配置
  "getWarehousePutawayRecommendationList": "/sys/putaway-recommendations",
  "createWarehousePutawayRecommendation": "/sys/warehouses/{warehouseId}/putaway-recommendations",
  "modifyWarehousePutawayRecommendation": "/sys/warehouses/{warehouseId}/putaway-recommendation",
  "deleteWarehousePutawayRecommendation": "/sys/warehouses/{warehouseId}/putaway-recommendation",

  // 分拨墙配置
  "getSortingWallList": "/sys/sorting-walls",
  getSortingWallListNew: '/sys/sorting-walls/list/new',
  "getWarehouseSortingWallList": "/sys/warehouses/{warehouseId}/sorting-walls",
  "createWarehouseSortingWall": "/sys/warehouses/{warehouseId}/sorting-walls",
  "modifyWarehouseSortingWall": "/sys/warehouses/{warehouseId}/sorting-walls/{sortingWallId}/modify",
  "deleteWarehouseSortingWall": "/sys/warehouses/{warehouseId}/sorting-walls/{sortingWallId}/delete",
  "enableWarehouseSortingWall": "/sys/warehouses/{warehouseId}/sorting-walls/{sortingWallId}/enable",
  "disableWarehouseSortingWall": "/sys/warehouses/{warehouseId}/sorting-walls/{sortingWallId}/disable",
  "getSortingWallSlots": "/sys/sorting-walls/{sortingWallId}/slots",
  "createSortingWallSlot": "/sys/sorting-walls/{sortingWallId}/slots",
  "deleteSortingWallSlot": "/sys/sorting-walls/{sortingWallId}/slots/{slotId}/delete",
  "enableSortingWallSlot": "/sys/sorting-walls/{sortingWallId}/slots/{slotId}/enable",
  "disableSortingWallSlot": "/sys/sorting-walls/{sortingWallId}/slots/{slotId}/disable",
  "batchHandleSlot": preApi +  "/sys/sorting-walls/batchHandleSlot",
  "getWallSpecs": "/sys/sorting-walls/specs",
  "exportSortWallTemplate" : "/sys/sorting-walls/exportTemplate",
  batchTypeModify: (warehouseId) => `${preApi}/sys/warehouses/${warehouseId}/batchModify`,


  // 包裹合箱称重配置
  "getPackageMergeWeightConfigList": "/sys/packageMergeWeightConfig/list",
  "getPackageMergeWeightConfig": "/sys/packageMergeWeightConfig/get",
  "addPackageMergeWeightConfig": "/sys/packageMergeWeightConfig/add",
  "modifyPackageMergeWeightConfig": "/sys/packageMergeWeightConfig/modify",
  "deletePackageMergeWeightConfig": "/sys/packageMergeWeightConfig/delete",
  "getPackageMergeWeighingType": "/sys/packageMergeWeightConfig/weighingType",

  // 包材配置
  "getPackageMergeVolumeConfigList": "/sys/packageMergeVolumeConfig/list",
  "getPackageMergeVolumeConfig": "/sys/packageMergeVolumeConfig/get",
  "addPackageMergeVolumeConfig": "/sys/packageMergeVolumeConfig/add",
  "modifyPackageMergeVolumeConfig": "/sys/packageMergeVolumeConfig/modify",
  "deletePackageMergeVolumeConfig": "/sys/packageMergeVolumeConfig/delete",


  // 异常工单列表
  "getPackageTypeNameList": "/job/packageTypeName/list",
  "getMarkNodeTypeNameList": "/job/markNodeTypeName/list",
  "getAbnormalPackageList": "/job/abnormalPackage/list",
  "getAbnormalList": "/abnormal/list",
  "abnormalExportAll": "/abnormal/export",
  "updateAbnormalPkgRemarks": "/job/abnormalPackage/update",
  "getConfirmStatusNameList": "/job/confirmStatus/list",
  "abnormalPackageExportAll": "/job/abnormalPackage/export/{warehouseId}",
  "abnormalPackageExportSelected": "/job/abnormalPackage/export/{warehouseId}/ids",

  // 包裹提前出库
  "getWarehouseCoverageAreaList": "/warehouses/{warehouseId}/coverage-areas",
  "getWarehouseAisleList": "/warehouses/{warehouseId}/aisles",
  "getWarehousePackageAdvancedOutboundRecordList": "/warehouses/{warehouseId}/advanced-outbound/records",
  "getWarehouseAdvancedOutboundPackageList": "/warehouses/{warehouseId}/advanced-outbound/packages",
  "batchApplyPackageAdvancedOutbound": "/warehouses/{warehouseId}/advanced-outbound/packages/batch-apply",

  // 获取session
  "getUserSession": "/user/s",

  // 仓库工作时间节点配置
  "createTimeNodeConfig": "/sys/warehouse/timeNode/create",
  "updateTimeNodeConfig": "/sys/warehouse/timeNode/update",
  "getTimeNodeConfigList": "/sys/warehouse/timeNode/get/list",
  "queryConfigForExactWarehouse": "/sys/warehouse/timeNode/warehouseId/{warehouseId}/get",
  "queryTimeValueForExactWarehouse": "/sys/warehouse/timeNode/warehouseId/{warehouseId}/get/{type}",

  // 仓库工人数和总工时配置
  "createWorkDetail": "/sys/workersDetail/create",
  "updateWorkDetail": "/sys/workersDetail/update",
  "getWorkDetail": "/sys/workersDetail/{warehouseId}/get",

  // 库存明细报表
  "getOnShelvesPackageDetailList": "/sys/onShelves/packageDetail/list",
  "exportOnShelvesPackageDetail": "/sys/onShelves/packageDetail/export",
  "exportSelectedOnShelvesPackageDetail": "/sys/onShelves/packageDetail/warehouseId/{warehouseId}/selected/export",
  "countPackageDetail": "/sys/onShelves/packageDetail/count",
  "countBuyer": "/sys/onShelves/packageDetail/buyerCount",
  "getFuzzyLaneWayList": "sys/laneway/warehouse/{warehouseId}/fuzzy/get",
  "getFuzzyStoreCodeList": "sys/storagelocation/warehouse/storeCode/fuzzy/get",

  // 仓库监控详情报表
  "getWorkDetailPageResult": "/sys/warehouse/workMonitor/list",
  "exportWorkDetailList": "/sys/warehouse/workMonitor/export",
  "exportSelectedWorkDetailList": "/sys/warehouse/workMonitor/warehouseId/{warehouseId}/selected/export",
  "getWorkDetailForWarehouse": "/sys/warehouse/workMonitor/get",

  // 库区组配置
  "getWarehouseDistrictGroupList": "/sys/storageAreaGroup/list",
  "getWarehouseDistrictGroup": "/sys/storageAreaGroup/get",
  "addWarehouseDistrictGroup": "/sys/storageAreaGroup/add",
  "modifyWarehouseDistrictGroup": "/sys/storageAreaGroup/modify",
  "deleteWarehouseDistrictGroup": "/sys/storageAreaGroup/delete",
  "getWarehouseDistrictAssignedList": "/sys/storageAreaGroup/assignedList",
  "assignWarehouseDistrict": "/sys/storageAreaGroup/assign",

  // 下架波次管理
  "getOffShelvesWaveList": "/sys/offShelvesWaveManage/list",
  "getFinishedWaveList": "/sys/offShelvesWaveManage/finishedWaveList",
  "getUnfinishedWaveList": "/sys/offShelvesWaveManage/unfinishedWaveList",
  "getWaveCreationDimensionList": "/sys/offShelvesWaveManage/waveCreationDimension",
  "getEndCarrierList": "/sys/offShelvesWaveManage/endCarrier",
  "getWarehouseListW": "/sys/offShelvesWaveManage/warehouse",
  "getSortCodeListW": "/sys/offShelvesWaveManage/sortCode",
  "getWaveWarningStatusList": "/sys/offShelvesWaveManage/waveWarningStatus",
  "getWaveOperatingStatusList": "/sys/offShelvesWaveManage/waveOperatingStatus",
  "getWaveCreationDimensionType": "/sys/offShelvesWaveManage/waveCreationDimensionType",
  taskAllEnableOrDisable:'/sys/warehouse/task/allocation/config/enableOrDisable',

  // 下架任务管理
  "getOffShelvesTaskList": "/sys/waveManage/getOffShelvesTaskList",
  "getOffShelvesTaskPackageList": "/sys/waveManage/getOffShelvesTaskPackageList",

  //分拨任务管理
  "getAllotTaskList": "/sys/allotTask/list",

  //包裹预报商品审核配置列表
  "getWarehousePackageAuditManageList": "/sys/warehousePackageAuditManage/list",
  "addWarehousePackageAuditManage": "/sys/warehousePackageAuditManage/add",
  "modifyWarehousePackageAuditManage": "/sys/warehousePackageAuditManage/modify",
  "getPackageAuditList": "/package/contrabandAudit/list",
  "cancelAudit": "/package/contrabandAudit/cancelAudit",
  "submitAudit": "/package/contrabandAudit/submitAudit",
  "updateGoodsFeature": "/package/contrabandAudit/updateGoodsFeature",
  "updateGoodsFeatureStatus": "/package/contrabandAudit/updateGoodsFeatureStatus",
  "batchSubmitAudit": "/package/contrabandAudit/batchSubmitAudit",

  //仓库签收配置列表
  "getWarehouseSignConfigManageList": "sys/warehouseSignConfigManage/list",
  getWarehouseSignConfigManageListNew: '/sys/warehouseSignConfigManage/queryList',
  "addWarehouseSignConfigManageList": "sys/warehouseSignConfigManage/add",
  "modifyWarehouseSignConfigManageList": "sys/warehouseSignConfigManage/modify",

  //小时作业监控
  "getWorkMonitorHoursList": "sys/workMonitorHours/list",
  "exportWorkMonitorHoursList": "sys/workMonitorHours/export",

  // 员工计件列表
  "getPcsReportPieceworkList": "report/pieceWork/list",
  "exportPcsReportPieceworkList": "report/pieceWork/export",


  "getPickbillPoolWaveList": "/sys/pickbillPoolWave/list",
  "getPickbillPoolWaveCountList": "/sys/pickbillPoolWave/count",
  "getOrderDistributionList": "/sys/orderDistribution/list",
  "queryOrderList": "/sys/orderDistribution/detail/list",
  "queryOrderCount": "/sys/orderDistribution/detail/count",
  "orderDetailExportAll": "/sys/orderDistribution/detail/export",
  "orderDistributionExport": "/sys/orderDistribution/export",

  //包裹轨迹
  "operationLogQuery": "/packageline/operationLog/query",
  "operationLogOperationId": "/packageline/operationLog/operationIdP",

  //邮编组列表
  "queryZipcodeGroupList": "/sys/zipcodeGroup/list",
  "addZipGroup": "/sys/zipcodeGroup/add",
  "updateZipGroup": "/sys/zipcodeGroup/update",
  "deleteZipcodeGroupById": "/sys/zipcodeGroup/delete/{groupId}",
  "getZipcodeGroupById": "/sys/zipcodeGroup/get/{groupId}",

  //手工波次列表
  "queryUnOffshelvesOrderList": "/sys/manualWave/unOffshelvesOrderList",
  "getEmployeeList": "/sys/manualWave/employeeList",
  "searchEmployeeList": "/sys/manualWave/searchEmployeeList",
  "allocationOrder": "/sys/manualWave/allocationOrder",

  // KPI配置
  "getKpiList": "/sys/kpiConfig/list",
  getKpiListNew: '/sys/kpiConfig/list/new',
  "addKpiConfig": "/sys/kpiConfig/createKpiConfig",
  "modifyKpiConfig": "/sys/kpiConfig/modifyKpiConfig",
  "deleteById": "/sys/kpiConfig/deleteKpiConfig/{id}",

  // 入库KPI监控
  "getKpiInstockMonitorList": "/kpi/monitor/instock/list",
  "getKpiInstockMonitorListExport": "/kpi/monitor/instock/export",
  "getStorageAreaGroupList": "/kpi/monitor/instock/getStorageAreaGroupList",
  "getWarehouseDistrictList": "/kpi/monitor/instock/getWarehouseDistrictList",
  "getKpiInstockPackageDetailList": "/kpi/monitor/instock/getKpiInstockPackageDetailList",
  "getKpiInstockPackageDetailListExport": "/kpi/monitor/instock/package/export",


  // 出库KPI监控
  "getKpiOutstockMonitorList": "/kpi/monitor/outstock/list",
  "getKpiOutstockOrderDetailList": "/kpi/monitor/outstock/getKpiOutstockOrderDetailList",
  "getKpiOutstockMonitorListExport": "/kpi/monitor/outstock/export",
  "getKpiOutstockOrderDetailListExport": "/kpi/monitor/outstock/order/export",

  // 异常包裹拦截配置
  "getParcelInterceptConfigList": "/sys/parcelInterceptConfig/list",
  "getParcelInterceptConfig": "/sys/parcelInterceptConfig/get",
  "addParcelInterceptConfig": "/sys/parcelInterceptConfig/add",
  "modifyParcelInterceptConfig": "/sys/parcelInterceptConfig/modify",
  "deleteParcelInterceptConfig": "/sys/parcelInterceptConfig/delete",

  //关单包裹申请退回
  "getWarehouseReturnClosedPackageList": "/warehouses/{warehouseId}/closed-return/packages",
  "batchApplyPackageClosedReturn": "/warehouses/{warehouseId}/closed-return/packages/batch-apply",

  //盘点
  "getCycleCountMissionList": "/job/cycleCountMission/list",
  "getCycleCountPlanList": "/cycleCount/plan/list",
  "addCycleCountPlan": "/cycleCount/plan/createCycleCountPlan",
  "deleteCycleCountPlanById": "/cycleCount/plan/deleteCycleCountPlan/{warehouseId}/{id}",
  "modifyCycleCountPlan": "/cycleCount/plan/modifyCycleCountPlan",
  "cycleCountPlanTermination": "/cycleCount/plan/termination/{warehouseId}/{id}",
  "cycleCountPlanFinished": "/cycleCount/plan/finished/{warehouseId}/{id}",
  "getCycleCountPlanListExport": "/cycleCount/plan/export",
  "getCycleCountMissionDetail": "/job/cycleCountMission/detail",
  "getCycleCountMission": "/job/cycleCountMission/get",
  "addCycleCountMission": "/job/cycleCountMission/add",
  "modifyCycleCountMission": "/job/cycleCountMission/update",
  "deleteCycleCountMission": "/job/cycleCountMission/delete",
  "terminateCycleCountMission": "/job/cycleCountMission/terminate",
  "finishCycleCountMission": "/job/cycleCountMission/finish",
  "getCycleCountPackageList": "/job/cycleCountMission/getCycleCountPackageList",
  "getDistrictScopeList": "/job/cycleCountMission/getDistrictScopeList",
  "tagCycleCountPackageLess": "/job/cycleCountMission/tagLessPackage",
  "getCycleCountMissionCandidateList": "/job/cycleCountMission/getCycleCountMissionCandidateList",
  "getUnfinishedCycleCountPlan": "/cycleCount/plan/getUnfinishedCycleCountPlan",
  "getCycleCountMissionListExport": "/job/cycleCountMission/export",
  "handleManualMovePosition": "/job/cycleCountMission/handleManualMovePosition",
  "getCycleCountPackageListExport": "/job/cycleCountMission/exportPackageList",
  // 获取盘点配置列表
  "listEnableConfig": "/sys/cycleCountConfig/listEnableConfig",

  //盘点策略
  "getCycleCountStrategyList": "/sys/cycleCountStrategy/list",
  "createCycleCountStrategy": "/sys/cycleCountStrategy/add",
  "deleteCycleCountStrategy": "/sys/cycleCountStrategy/delete",


  //盘点日志
  "addCycleCountLog": "/job/cycleCountLog/add",
  "getCycleCountLogListByRefId": "/job/cycleCountLog/list/{refId}",
  // 盘点任务详情-异常原因导入
  "cycleCountMissionImportReason": preApi + "/job/cycleCountMission/importReason",

  //新版库容报表
  "queryStorageCapacityReportList": "/sys/storageCapacityVisible/{warehouseId}/query",
  "queryStorageCapacityType": "/sys/storageCapacityVisible/getDistrictScopeList",
  "storageCapacityExport":"/sys/storageCapacityVisible/{warehouseId}/export",


  //仓库任务时效定义
  "getTaskEffectivenessDefinitionList": "/sys/taskEffectivenessDefinition/list",
  "addTaskEffectivenessDefinition": "/sys/taskEffectivenessDefinition/add",
  "updateTaskEffectivenessDefinition": "/sys/taskEffectivenessDefinition/update",
  "deleteTaskEffectivenessDefinitionById": "/sys/taskEffectivenessDefinition/delete/{id}",

  //工单任务
  "getTaskWorkOrderList": "/work/order/list",
  'getTaskWorkOrderDetail': '/work/order/detail',
  "getCustomerTaskMissionCandidateList": "/work/order/getCustomerTaskMissionCandidateList",
  "getTaskWorkOrderListExport": "/work/order/export",
  "allocationTaskOrder": "/work/order/allocationTaskOrder",
  'saveTaskOrderRemark': '/work/order/saveRemark/{taskOrderId}',
  'overTaskOrder': '/work/order/overTask',
  'ossUploadWorkOrderImg': preApi +  '/work/order/ossUpload',
  'timeOutWarning': '/work/order/timeOut/warning',

  //分拨墙管理界面
  "querySortWallList": "sys/sortWall/sortWallList",
  "querySortWallStatusList": "sys/sortWall/sortWallStatus",
  "SortWallList": "sys/sortWall/list",
  "slotWallSlotDetailList": "sys/sortWall/sortSlotList",
  "releaseSlot": "sys/sortWall/releaseSlot",
  "exportSlotList": "sys/sortWall/exportSlotList",
  "slotPackageList": "sys/sortWall/packageList",
  "exportSlotPackageList": "sys/sortWall/exportPackageList",
  batchReleaseSlot: preApi + '/sys/sortWall/batch/releaseSlot',


  //异常类型数据维护
  "getExceptionTypeList": "/sys/exceptionType/list",
  "addExceptionType": "/sys/exceptionType/add",
  "updateExceptionType": "/sys/exceptionType/update",
  "deleteExceptionTypeById": "/sys/exceptionType/delete/{id}",


  //质量稽查页面
  "getQualityInspectionList": "/jobQualityInspectionDetail/list",
  "getQualityInspectionListExport": "/jobQualityInspectionDetail/export",

};
export default API;