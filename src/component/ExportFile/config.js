export const command = {
    // 包裹查询
    '/service/packageList':'PACKAGE_DETAIL',
    // kpi配置
    '/pcsKpiConfigList': 'KPI_CONFIG',
    // 入库kpi 配置
    '/pcsKpiMonitorinstockList': 'INSTOCK_KPI',
    '/PcsKpiMonitorinstockPackagedetail': 'INSTOCK_KPI_PACKAGE',
    // 出库kpi 配置
    '/pcsKpiMonitoroutstockList': 'OUTSTOCK_KPI',
    '/PcsKpiMonitoroutstockOrderdetail': 'OUTSTOCK_KPI_ORDER',
    // 库容报表
    '/pcsStorageCapacity': 'STORAGE_CAPACITY',
    // 库区管理
    '/pcsWarehouseDistrict'	 :'DISTRICT_MANAGE',
    // 巷道管理
    '/pcsLanewayList'	:'LANEWAY_MANAGE',
    // 库位管理
    '/pcsStorageList'	:'STORAGE_LOCATION_MANAGE',
    // 库位配置
    '/pcsStorageSetting'	:'STORAGE_LOCATION_CONFIG',
    // 入库扫描配置
    '/pcsInstockConfig':'INSTOCK_SCAN_CONFIG',
    // 上架推荐配置
    '/pcsWarehousePutawayRecommendation'	:'PUTWAY_RECOMMEND_CONFIG',
    // 下架波次规则
    '/pcsWarehouseTaskAllocationConfig'	:'TASK_ALLOCATION_CONFIG',
    // 合箱称重配置
    '/pcsWarehousePackageMergeWeightConfig'	:'PACKAGE_MERGE_WEIGHT_CONFIG',
    // 分拨墙配置
    '/pcsWarehouseSortingWall'	:'SORTING_WALL_CONFIG',
    // 签收配置
    '/pcsWarehouseSignconfig'	:'SIGN_CONFIG',
    // 订单查询
    '/service/orderList':'ORDER_DETAIL',
    'serviceOrderPackage': 'ORDER_PACKAGE_DETAIL',
    // 违禁品审核
    '/service/packageAuditList'	:'PROHIBITED_GOODS_AUDIT',
    // 异常记录管理 汇总查询
    'jobAbnormalPackageTotal': 'ABNORMAL_PACKAGE_SUMMARY',
    // 异常记录详情 
    '/pcsAbnormalPackageList': 'ABNORMAL_RECORD_MANAGE',
    // 大包查询导出
    '/service/bigPackageList': 'BIG_PACKAGE_DATA',
    // 大包查询明细导出
    'BIG_PACKAGE_DETAIL': 'BIG_PACKAGE_DETAIL',
    // 劳动力作业单量报表
    '/labourreport': 'LABOUR_TASK_DETAIL',
    // 拆单明细
    '/pcsOrderSplitRatio': 'ORDER_SEPARATE',
    // 增值服务报表
    '/valueaddedservicereport': 'ADDSERVICE_MANAGE',
    /**
     * 管理平台
     */
    // 库容可视化报表明细
    'STORAGE_CAPACITY_VISIBLE_DETAIL_EXPORT': 'STORAGE_CAPACITY_VISIBLE_DETAIL_EXPORT',
    // 库容可视化报表汇总
    '/storageCapacity': 'STORAGE_CAPACITY_VISIBLE_EXPORT',
    // 出库KPI汇总
    '/kpiMonitorOutstock': 'AE_MANAGE_OUTSTOCK_KPI',
    // 出库KPI 小时明细
    'AE_MANAGE_OUTSTOCK_KPI_HOURS' : 'AE_MANAGE_OUTSTOCK_KPI_HOURS',
    // 出库KPI 包裹明细
    'AE_MANAGE_OUTSTOCK_KPI_DETAIL' : 'AE_MANAGE_OUTSTOCK_KPI_DETAIL',
    //  入库KPI列表和小时查询
    "/kpiMonitorInstock": 'AE_MANAGE_INSTOCK_KPI',
    // 入库KPI详情
    'AE_MANAGE_INSTOCK_KPI_DETAIL': 'AE_MANAGE_INSTOCK_KPI_DETAIL',
    // SLA 入库汇总
    'INSTOCK_SLA_STATISTIC': 'INSTOCK_SLA_STATISTIC',
    // SLA 入库详情
    'INSTOCK_SLA_DETAIL': 'INSTOCK_SLA_DETAIL',
    // SLA 出库汇总
    'OUT_STOCK_SLA_STATISTIC': 'OUT_STOCK_SLA_STATISTIC',
    // SLA 出库详情
    'OUT_STOCK_SLA_DETAIL': 'OUT_STOCK_SLA_DETAIL',
    // 出库分段时长汇总
    '/breakTimeMonitorOutstock': 'SEGMENT_MONITOR_OUT_STOCK',
    // 出库分段时长明细
    'SEGMENT_MONITOR_OUT_STOCK_DETAIL': 'SEGMENT_MONITOR_OUT_STOCK_DETAIL',
    // 入库分段时长汇总
    '/breakTimeMonitorInstock': 'SEGMENT_MONITOR_IN_STOCK',
    // 入库分段时长明细
    'SEGMENT_MONITOR_IN_STOCK_DETAIL': 'SEGMENT_MONITOR_IN_STOCK_DETAIL',
    // 出入库配置导出
    '/breakTimeMonitorConfig': 'SYS_KPI_SEGMENT_CONFIG',
    // ANDON呼叫配置管理
    '/andonTalkConfig': 'ANDON_CONFIG_LIST',
    // 逆向kpi监控汇总
    '/kpiMonitorReturn': 'KPI_REVERSAL_MONITOR_OUT_STOCK',
    // 逆向kpi监控详情
    'KPI_REVERSAL_MONITOR_OUT_STOCK_DETAIL': 'KPI_REVERSAL_MONITOR_OUT_STOCK_DETAIL',
    // 逆向kpi 看板详情导出
    'KPI_REVERSAL_STATISTIC_DETAIL': 'KPI_REVERSAL_STATISTIC_DETAIL',
    // AE漂移监控汇总
    'AE_DRIFT_MONITOR': 'AE_DRIFT_MONITOR',
    // 流速预测汇总
    "flowPreTestReportSumary": "PREDICTION_QUANTITY_SUMMARY_EXPORT",
    // 流速预测明细
    "flowPreTestReportDetail": "PREDICTION_QUANTITY_DETAIL_EXPORT",
    // 异常预警&调度建议汇总
    'BROADCAST_SUMMARY_FORM_EXPORT': "BROADCAST_SUMMARY_FORM_EXPORT",
    // 异常预警&调度建议明细 
    "BROADCAST_DETAIL_LIST_EXPORT": "BROADCAST_DETAIL_LIST_EXPORT",
    // 滞留包裹明细
    "DELAY_PACKAGE_DETAIL_EXPORT": "DELAY_PACKAGE_DETAIL_EXPORT",
    // 交接班日志详情
    "SHIFT_MANAGE_DETAIL": "SHIFT_MANAGE_DETAIL",
    // ANDON 报表
    "ANDON_MANAGER_EXPORT": "ANDON_MANAGER_EXPORT",
    // 生产计划数据大盘
    "/productionPlanReportBoard": "PRODUCTION_PLAN_OVERVIEW",
    // 订单查询（汇单）导出
    "/orderReportNew": 'CollectReportOrderFetchDataAction',
    // 作业明细（汇单）导出
    "/packageOpraterDetail": "CollectReportOperateTaskFetchDataAction",
    // 手工拆单
    "/handSplitOrder": "SPLIT_ORDER_EXPORT",
    // 交接清单下载
    '/service/handoverList': 'RETURN_REJECT_DATA',
    // 异常任务
    '/otherWarehousePackageRecord': 'NO_PREALERT_PACKAGE_RECORD',
    // 移动管理平台监控报表明细
    "/mobilePlatformUvReport": "DING_APP_USING_MONITOR",
    // 移库任务
    "/stockeTransferTask": "JOB_TRANSFER_TASK_DETAIL",
    // 波次&堆垛大包明细
    "/waveOrderBoard": "BIG_WAVE_DETAIL_EXPORT",
    //详情
    "RETENTION_PACKAGE_DETAIL_EXPORT": "RETENTION_PACKAGE_DETAIL_EXPORT",
    // 汇总
    "RETENTION_PACKAGE_SUMMARY_EXPORT": "RETENTION_PACKAGE_SUMMARY_EXPORT",
}