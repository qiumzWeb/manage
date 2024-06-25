import { getToTT } from 'assets/js';
// 播报频率配置
export const timeOptions = [
  {label: '5分钟', value: '5'},
  {label: '15分钟', value: '15'},
  {label: '30分钟', value: '30'},
  {label: '60分钟', value: '60'},
  {label: '120分钟', value: '120'},
]

// 生产计划预警值类型
// 支持百分比预警类型
export const prodPlanNeedPrcentAbnormalWarnType = [
  {label: '单量流速', value: 'QUANTITY_SPEED'},
]
// 只支持数值 类型
export const prodPlanNotNeedPrcentAbnormalWarnType = [
  {label: '小时落单差异', value: 'HOURLY_QUANTITY_DIFF'},
  {label: '单量预测差异', value: 'QUANTITY_PREDICATE_DIFF'},
  {label: '产能', value: 'CAPACITY'},
  {label: '到岗人数', value: 'ARRIVE_EMPLOYEE_COUNT'},
  {label: '人效差异', value: 'STORAGE_HUMAN_EFFECT_HOURLY'},
  {label: 'WIP', value: 'WIP'},
]
export const prodPlanAbnormalWarnType = [
  ...prodPlanNeedPrcentAbnormalWarnType,
  ...prodPlanNotNeedPrcentAbnormalWarnType
]


// 预警诊断维度
export const abnormalWarnScopeType = [
  // {label: '小组', value : '0'},
  {label: '大组', value : '1'},
  {label: '全仓', value : '2'},
]

// 整点播报频率配置
export const InitTimeOptions = new Array(24).fill().map((v, index) => ({label: getToTT(index) + ':00', value: index}))

// 异常预警值类型
export const abnormalWarnType = [
  {label: '全仓库容满载率(包裹)', value: 'STORAGE_ALL_FULL_LOAD_RATIO'},
  {label: '全仓库容满载率(首单)', value: 'STORAGE_FIRST_FULL_LOAD_RATIO'},
  {label: '已签未入包裹数量', value: 'STORAGE_SIGN_PACKAGE_TOTAL'},
  {label: '待上架包裹数量', value: 'STORAGE_TO_PUTAWAY_TOTAL'},
  {label: '待下架包裹数量', value: 'STORAGE_TO_OFFSHELVES_TOTAL'},
  {label: 'SLA时效', value: 'STORAGE_SLA_EFFECT'},
  {label: '人效', value: 'STORAGE_HUMAN_EFFECT'},
  {label: '待作业增值服务包裹数量', value: 'VALUE_ADDED_SERVICE'},
  {label: '滞留包裹监控', value: 'DELAY_PACKAGE'},
  ...prodPlanAbnormalWarnType
]
// 播报方式 汇总
export const broadcastOptions = [
  {label: '钉钉群', value: 'dingtalk'},
  {label: '一线管理平台', value: 'frontLineManagement'}
]


// 异常播报类型
export const abnormalBroadCastType = {
  STORAGE_ALL_FULL_LOAD_RATIO: broadcastOptions,
  STORAGE_SLA_EFFECT: [broadcastOptions[1]],
  STORAGE_HUMAN_EFFECT: [broadcastOptions[1]],
  STORAGE_FIRST_FULL_LOAD_RATIO: broadcastOptions,
}

// 异常预警文案配置
export const abnormalWarnContentConfig = {
  STORAGE_ALL_FULL_LOAD_RATIO: '【预警】【${warehouseName}】库容满载率（包裹数量${storageUseRate}%）：库区（${areaName}) 包裹数量已达库容满载预警值(${occurRuleValue}%)，建议尽快关闭此库区的首单推荐, ${gmt}；' + '\n配置链接： ' + window.location.origin + '/districtManage?districtId=${storageAreaId}',
  STORAGE_FIRST_FULL_LOAD_RATIO: '【预警】【${warehouseName}】库容满载率（首单数量${firstPackageUseRate}%）：库区（${areaName})首单数量已达库区首单上限预警值(${occurRuleValue}%)，建议尽快关闭此库区的首单推荐,${gmt}；' + '\n配置链接： ' + window.location.origin + '/districtManage?districtId=${storageAreaId}',
  STORAGE_SIGN_PACKAGE_TOTAL: '【预警】【${warehouseName}】已到未入包裹数量：已到未入包裹数量：${needStoragePackageNum},已达预警值（${occurRuleValue}），请尽快安排入库 ${gmt}；',
  STORAGE_TO_PUTAWAY_TOTAL: '【预警】【${warehouseName}】待上架包裹数量：待上架包裹数量：${needOnShelvesPackageNum},已达预警值（${occurRuleValue}），请尽快安排上架 ${gmt}；；',
  STORAGE_TO_OFFSHELVES_TOTAL: '【预警】【${warehouseName}】待下架包裹数量：待下架包裹数量:${needOffShelvesPackageNum}，已达预警值(${occurRuleValue})，请尽快安排下架${gmt}；',
  VALUE_ADDED_SERVICE:'【预警】【${warehouseName}】待作业增值服务包裹数量:${needAddedServicePackageNum}，已达预警值(${occurRuleValue})，请尽快安排处理${gmt}；',
  DELAY_PACKAGE: '【滞留包裹预警】【${warehouseName}】库： 待签收（已生成）包裹数量${initNum}，滞留数量${delayInitNum}，滞留比${delayInitPercent}%；待下架（已上架）包裹数量${onShelvesNum}，滞留数量${delayOnShelvesNum}，滞留比${delayOnShelvesPercent}%；待入库（已签收）包裹数量${signedNum}，滞留数量${delaySignedNum}，滞留比${delaySignedPercent}%；待上架（已入库）包裹数量${inBoundedNum}，滞留数量${delayInBoundedNum}，滞留比${delayInBoundedPercent}%；待播种（已下架）订单数量${offShelvesNum}，滞留数量${delayOffShelvesNum}，滞留比${delayOffShelvesPercent}%；待出库（已码板/装袋）订单数量${baggingNum}，滞留数量${delayBaggingNum}，滞留比${delayBaggingPercent}；待合箱（已分拨）订单数量${allotNum}，滞留数量${delayAllotNum}，滞留比${delayAllotPercent}%； 待合板（已称重校验）订单数量${weightVerifyNum}，滞留数量${delayWeightVerifyNum}，滞留比${delayWeightVerifyPercent}%；待合板（已合箱打单）订单数量${printedNum}，滞留数量${delayPrintedNum}，滞留比${delayPrintedPercent}%；'
}
// 异常预警值指标
export const occurRuleValueTypeOptions = [
  {label: '数值', value: 'number'},
  {label: '百分比', value: 'percent'},
]
// // 异常预警计算方式
// export const abnormalComputeType = [
//   {label: '等于', value: 'eq'},
//   {label: '大于', value: 'gt'},
//   {label: '大于等于', value: 'ge'},
//   {label: '小于', value: 'lt'},
//   {label: '小于等于', value: 'le'},
// ]
// 播报方式
export const broadcastTypeOption = [
  broadcastOptions[0]
]
// 根据类型播报方式
export const broadcastTypeByContentType = {
  UPPH: broadcastOptions
}

// UPPH 播报
export const UPPHBroadcastOptions = [
    // 生产计划
  {label: '动态UPPH', value: 'UPPH'},
  {label: '生产计划达成报表-经理', value: 'PRODUCTION_REACH_MANAGER'},
  {label: '生产计划达成报表-主管', value: 'PRODUCTION_REACH_CHARGE'},
  {label: '库内小时动态效率看板', value: 'HOUR_DYNAMICS_INSIDE'},
  {label: '出库小时动态效率看板', value: 'HOUR_DYNAMICS_OUT_STOCK'},
]

// 数据播报
export const boardContentTypeOptions = [
  {label: '库容数据', value: 'JIYUN_STORAGE_MONITOR'},
  {label: '入库KPI监控数据', value: 'JIYUN_INSTOCK_KPI'},
  {label: '出库KPI监控数据', value: 'JIYUN_OUTSTOCK_KPI'},
  {label: '首页数据', value: 'INDEX_DATA_MONITOR'},
  // UPPH
  ...UPPHBroadcastOptions,

  {label: '闪电播波次任务超时', value: 'WAVE_TASK_TIMEOUT'},
]
// 播报内容
export const contentTypeOptions = [
  ...boardContentTypeOptions,
  ...abnormalWarnType
]


// 质检类型
export const qcTypeOptions = [
  {"label": "无", "value": "0"},
  {"label": "良品", "value": "1"},
  {"label": "次品", "value": "2"}
]

// 包裹来源
export const packageSource = [
  {label: '淘宝', value: 'taobao'},
  {label: '纯外单', value: 'outside'},
  {label: '淘宝外单', value: 'tboutside'},
]

// 特殊包裹类型
export const specialParcelSignOptions =[
  {label: "COD", value: "COD"},
  ...packageSource
]

// 大小件类型
export const packageTypeList = [
  {"label": "小包", "value": "2"},
  {"label": "大包", "value": "1"}
]


// 起算时间类型
export const kpiTimeTypeOption = [
  {label: '包裹签收时间', value: '1'},
  {label: '包裹入库时间', value: '2'},
  {label: '订单生成时间', value: '3'},
  {label: '包裹批次达到时间', value: '4'},
  {label: '逆向订单签收时间', value: '5'},
  {label: '逆向订单入库时间', value: '6'},
]

// 止算时间类型
export const kpiEndOperationOptions = [
  {label: '包裹上架时间', value: '1'},
  {label: '订单出库时间', value: '2'},
  {label: '逆向订单出库时间', value: '3'},
]

// 逆向包裹时间类型
export const kpiTimeTypeReturnOptions = [
  {label: '逆向签收时间', value: '0'},
  {label: '逆向入库时间', value: '1'},
  {label: '逆向考核时间', value: '2'},
]

// kpi达成时间配置
export const kpiAchieveDateOptions= [
  {label: '包裹签收时间', value: '1'},
  {label: '包裹入库时间', value: '2'},
  {label: '订单生成时间', value: '3'},
  {label: 'T日', value: '4'},
  {label: 'T+1日', value: '5'},
  {label: '批次达到', value: '6'},
]

// 是否启用SLA
export const slaEnableOptions = [
  {label: '否', value: '0'},
  {label: '是', value: '1'}
]


// 是否
export const isTrueOrNotOptions = [
  {label: '否', value: false},
  {label: '是', value: true}
]

// 是否 Y Or N
export const isYOrNOptions = [
  {label: '否', value: "N"},
  {label: '是', value: "Y"}
]


// kpi类型
export const kpiTypeOption= [
  {"label": "入库KPI", "value": "1"},
  {"label": "出库KPI", "value": "2"},
  {"label": "逆向出库KPI", "value": "3"},
]

// 出入库分段考核类型
export const breakTimeTypeOption= [
  {"label": "入库考核", "value": "1"},
  {"label": "出库考核", "value": "2"}
]
// 是否启用 分段时长配置
export const breakTimeEnableOptions = [
  {label: '启用', value: '1'},
  {label: '禁用', value: '0'}
]
// 选择维度
export const searchRangeOption = [
  {label: '全仓维度', value: '0'},
  {label: '库区组维度', value: '1', nameKey: 'districtGroupName'},
  {label: '库区维度', value: '2', nameKey: 'districtName'},
]
// 时间类型
export const timeTypeOption = [
  {label: '签收时间', value: '0'},
  {label: '入库时间', value: '1'},
  {label: '批次到达时间', value: '2'},
  {label: 'KPI考核时间', value: '3'},
]

// 订单类型
export const orderType = [
  {label: '多票', value: '0'},
  {label: '单票', value: '1'}
]

// 大包来源
export const bigPackageSource = [
  { label: "递四方深圳机场仓-分拨", value: "Tran_Store_13423770" },
  { label: "菜鸟东莞分拨中心-分拨", value: "Tran_Store_13424631" },
  { label: "燕文杭州仓-分拨", value: "Tran_Store_13423966" },
  { label: "LZD-TBC分拨中心", value: "Tran_Store_13474141" },
  { label: "入库分拣机", value: "in_stock_sorting" },
  { label: "递四方深东仓-分拨", value: "TRAN_STORE_30299685" },
  { label: "递四方深西仓-分拨", value: "TRAN_STORE_30299953" },
  { label: "递四方东莞定制仓-分拨", value: "TRAN_STORE_30320880" },
  { label: "燕文北京仓-分拨", value: "Tran_Store_13423965" },
  { label: "燕文昆山仓-分拨", value: "Tran_Store_13423967" },
  { label: "燕文深圳仓-分拨", value: "Tran_Store_13423968" },
  { label: "燕文义乌仓-分拨", value: "Tran_Store_13423969" },
  { label: "燕文东莞仓-分拨", value: "Tran_Store_13452137" },
  { label: "递四方东莞仓-分拨", value: "Tran_Store_13452496" },
  { label: "递四方厦门仓-分拨", value: "Tran_Store_13452714" },
  { label: "递四方深圳龙华仓-分拨", value: "Tran_Store_13452722" },
  { label: "菜鸟华东分拨中心", value: "Tran_Store_13476456" },
  { label: "4PX", value: "TRUNK_13474032" },
  { label: "华东心怡仓入库分拣机", value: "AE-hdjy-xbrk" },
  { label: "调拨出库大包", value: "allocateOut" },
  { label: "调拨入库大包", value: "allocateIn" },
]

// 大包类型
export const bigPackageType = [
  {label: '签收大包', value: '0'},
  {label: '中转大包', value: '1'},
  {label: '调拨出库大包', value: '2'},
  {label: '调拨入库大包', value: '3'},
  {label: '闪电播分拨大包', value: '4'},
  {label: '无货架大包', value: '5'},
  {label: '批次大包', value: '6'},
]

// 漂移类型
export const driftType = [
  {label: '跨库区漂移', value: '1'},
  {label: '未入库漂移', value: '2'},
  {label: '未签收漂移', value: '3'},
]

// 集运类型配置
export const packagePlan = [
  {label: '包包计划', value: 'bbPlan'},
  {label: '拼团', value: 'group'}
]

// 拣选模式
export const pickingModelOptions = [
  { "label": "播种式", "value": "1" },
  { "label": "摘果式", "value": "2" },
  { "label": "边拣边分", "value": "3" },
  { "label": '闪电播模式', "value": '7' },
  { "label": '集分尾包', "value": '9' },
  { "label": '无货架闪电播', "value": '12' }
]

// 闪电播 大包状态 
export const flowPickBigbagStatusOptions = [
  {label: '已推荐', value: 1},
  {label: '已摆出', value: 2},
  {label: '已集包入区', value: 3},
  {label: '已集包入区', value: 4},
  {label: '下架中', value: 5},
  {label: '运输中', value: 6},
]

// 计算时间类型
export const timeTypeOptions = [
  {"label": "T-1", "value": "1"},
  {"label": "T", "value": "2"},
  {"label": "T+1", "value": "3"}
]

// UPPH 子计划枚举配置
export const UPPHSUMPLANOPTIONS = [
  {label: '实时综合人效', value: 'SUB_REAL_TIME_COMPREHENSIVE_EFFECT'},
  {label: '动态计划出勤人数', value: 'SUB_DYNAMIC_PLAN_WORK_EMPLOYEE_COUNT'},
  {label: '当天出勤人数', value: 'SUB_TODAY_WORK_EMPLOYEE_COUNT'},
  {label: '截至目前下班人数', value: 'SUB_NOW_OFF_WORK_EMPLOYEE_COUNT'},
  {label: '截至目前出勤人数', value: 'SUB_NOW_WORK_EMPLOYEE_COUNT'},
]
export const UPPHPLANOPTIONS = [
  {label: '原计划量', value: 'SUB_ORIGINAL_PLAN_QUANTITY'},
  {label: '动态计划量', value: 'SUB_DYNAMIC_PLAN_QUANTITY'},
  {label: '实际量', value: 'SUB_ACTUAL_QUANTITY'},
  {label: '剩余量', value: 'SUB_REMAINING_QUANTITY'},
  {label: '完成比', value: 'SUB_PERCENT_COMPLETE'},
  {label: '动态计划工时', value: 'SUB_DYNAMIC_PLAN_WORKING_HOURS'},
  {label: '实际工时', value: 'SUB_ACTUAL_WORKING_HOURS'},
  {label: '剩余工时', value: 'SUB_REMAINING_WORKING_HOURS'},
  {label: '计划人效', value: 'SUB_PLAN_EFFECT'},
  {label: '实时人效', value: 'SUB_REAL_TIME_EFFECT'},
  ...UPPHSUMPLANOPTIONS
]


// 时效类型配置
export const timeEfficiencyTypeOptions = [
  {label: '当日达', value: 'theDayArrive'},
  {label: '其它', value: 'other'},
  {label: '五日达', value: 'CN_X'},
  {label: 'X日达', value: 'AE_X'},
  {label: '默认', value: 'default'},
]



//波次类型 - 拣选池
export const waveTypeNameList = [
  {label: '混合波次', value: '1'},
  {"label": "单票波次", "value": "2"},
  {"label": "多票波次", "value": "3"},
  {"label": "退货波次", "value": "4"},
  {"label": "尾包波次", "value": "9"},
];

// 波次类型 - 全部
export const waveTypeOptions = [
...waveTypeNameList,
{label: '调拨波次', value: '6'},
{label: '异常下架波次', value: '10'},
]


// 自动汇波解决方案 配置
export const AutoWavePackageAttrOptions = [
  {label: '官方直邮', value: 'TMALL_CONSO_DIRECT_LAND'},
  {label: '官方直邮-空运', value: 'TMALL_CONSO_DIRECT_AIR'},
  {label: '官方直邮-海运', value: 'TMALL_CONSO_DIRECT_OCEAN'},
  {label: '官方直邮快捷', value: 'TMW_CONSO_DIRECT_FAST_LAND'},
  {label: '官方集运', value: 'TMALL_CONSO_LAND_4PL'},
  {label: '官方集运-空运', value: 'TMALL_CONSO_AIR_4PL'},
  {label: '官方集运-陆运', value: 'TMALL_CONSO_LAND_4PL'},
  {label: '官方集运-海运', value: 'TMALL_CONSO_OCEAN_4PL'},
  {label: '官方集运-快捷空运', value: 'TMALL_CONSO_EXPRESS'},
  {label: '官方集运-经济空运', value: 'TMALL_CONSO_AIR_ECONOMY_4PL'},
  {label: '官方集运APP', value: 'HK_APP_OPEN'},
  {label: '官方直送-空运', value: 'TMALL_BUYER_DIRECT_AIR_4PL'},
  {label: '官方直送-陆运', value: 'TMALL_BUYER_DIRECT_LAND_4PL'},
  {label: '香港本对本', value: 'HK_LOCAL_TO_LOCAL'},
  {label: '本地退服务', value: 'TMALL_LOCAL_REVERSE'},
  {label: '空运特惠', value: 'TMALL_CONSO_AIR_CHEAP_4PL'},
  {label: '海运特惠', value: 'TMALL_CONSO_OCEAN_CHEAP_4PL'},
]

// 用户类型
export const userTypeOptions = [
  {label: '默认', value: '0'},
  {label: 'APP', value: '1'}
]

// 任务实操状态,-1:待生成；0:已生成；1：进行中；2：已完成
export const taskStatusOptions = [
  {label: '已取消', value: '-1'},
  {label: '未开始', value: '0'},
  {label: '进行中', value: '1'},
  {label: '已完成', value: '2'},
  {label: '进行中', value: '3'},
  {label: '进行中', value: '4'},
]

// 异常类型
export const exceptionTypeOptions = [
  {"label": "拒收类型", "value": 1, code: 'rejectType'},
  {"label": "JOOM逆向入库", "value": 2, code: 'joomReversalInstock'},
];

// 推荐优先级
export const areaPriorityOptions = [
  {label: '1', value: 1},
  {label: '2', value: 2},
  {label: '3', value: 3},
  {label: '4', value: 4},
  {label: '5', value: 5},
]

// 汇单异常类型
export const waveCreationAbnormalTypeList = [
    {"label": "自动汇波异常", "value": 1},
    {"label": "手工汇波异常", "value": 2}
];

// 配送类型
export const deliveryTypeList = [
    {"label": "自提", "value": "selfPickUp"},
    {"label": "宅配", "value": "delivery"}
];

// 会员等级
export const userLevelList = [
    {"label": "VIP订单", "value": 1},
    {"label": "非VIP订单", "value": 0}
];

// 订单类型-正向退件 
export const orderTypeFlowList = [
  { label: "正向订单", value: 1},
  { label: "退件订单", value: 0},
  { label: '逆向下架订单', value: 2},
  { label: '异常集齐订单', value: 3},
  { label: '逆向上架订单', value: 4},
];

    // 订单类型-是否尾包
export const orderTypeTailOrderList = [
  {label: '尾包', value: "1"},
  {label: '非尾包', value: '0'}
]

// 大小混合小件
export const orderPackageTypeOptions = slaEnableOptions

// 订单平台
export const orderPlatformOptions = [
  {label: '汇单转集', value: 'CAINIAO_CHOICE'}
]


export const orderTypeOptions = [
  { label: '默认', value: '0' },
  { label: '汇单入集', value: '1' },
]


export const retentionStageOptions = [
  { label: '已签收未入库', value: 'un_in_stock' },
  { label: '已入库未上架', value: 'un_shelve' },
  { label: '已上架未下架', value: 'on_shelve' },
  { label: '已下架未播种', value: 'un_sorting' },
  { label: '已播种未合箱', value: 'un_merge' },
  { label: '已合箱未组包', value: 'un_pack' },
  { label: '已组包未出库', value: 'un_outbound' },
]