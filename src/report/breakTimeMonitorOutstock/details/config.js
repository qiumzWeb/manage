
// 查询接口
export const searchApiUrl = '/segment/monitor/pageOutStockMonitorDetail'

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  kpiName: {
    title: '分段考核标准',
  },
  duration: {
    title: '实际作业时长',
  },
  orderCreateTime: {
    title: '通知出库时间',
  },
  offShelvesTime: {
    title: '下架时间'
  },
  offShelvesBigBagCode: {
    title: '下架容器号',
  },
  districtGroup: {
    title: '库区组',
  },
  district: {
    title: '库区',
  },
  storeCode: {
    title: '库位号',
  },
  allotTime: {
    title: '播种时间',
  },
  allotBigBagCode: {
    title: '播种墙号',
  },
  orderCreateTime: {
    title: '播种操作员'
  },
  mergeTime: {
    title: '合箱时间',
  },
  packTime: {
    title: '组包时间'
  },
  outBoundedTime: {
    title: '发运时间',
  },
  handoverTime: {
    title: '交干时间',
  },
  referLogisticsOrderCode: {
    title: '一段LP号',
    
  },
  deliveryCode: {
    title: '一段包裹号'
  },
  orderLogisticsCode: {
    title: '二段LP号',
  },
  orderDelegateNo: {
    title: '二段订单号',
  },
  endCarrierLabel: {
    title: '渠道'
  },
  serviceTypeName: {
    title: '订单业务类型'
  },
  orderStatus: {
    title: '订单状态',
  },
  totalWeight: {
    title: '订单实重'
  },
  packageStatus: {
    title: '包裹状态'
  },
  turnoverType: {
    title: '包裹类型',
  },
  arriveBigBagCode: {
    title: '大包号',
  },
}

