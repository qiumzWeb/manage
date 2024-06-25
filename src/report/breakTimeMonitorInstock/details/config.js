
// 查询接口
export const searchApiUrl = '/segment/monitor/pageInStockMonitorDetail'

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  referLogisticsOrderCode: {
    title: '一段LP号',
  },
  deliveryCode: {
    title: '一段包裹号',
  },
  turnoverType: {
    title: '包裹类型',
  },
  kpiName: {
    title: '分段时效标准'
  },
  duration: {
    title: '实际作业时长（小时）',
  },
  pickupResName: {
    title: '揽收仓名称',
  },
  batchNo: {
    title: '批次号',
  },
  arriveBigBagCode: {
    title: '批次中转大包号',
    width: 160,
    tips: '【是】组包完成时间<=KPI考核时间；【否】组包完成时间>KPI考核时间；【否】没有组包完成时间，且KPI考核时间<=当前系统时间。'
  },
  arriveTime: {
    title: '批次到达时间',
    tips: '组包时间-KPI考核节点扫描时间(出库)。'
  },
  receivingTime: {
    width: 200,
    title: '签收时间',
  },
  inStockBigBagCode: {
    title: '入库中转大包号'
  },
  recommendDistrictGroup: {
    width: 200,
    title: '入库推荐库区组',
  },
  recommendDistrict: {
    title: '入库推荐库区'
  },
  inStockTime: {
    width: 200,
    title: '入库时间',
  },
  shelvesTime: {
    title: '上架时间',
  },
  rejectReason: {
    title: '拒收原因',
    
  },
  rejectOperator: {
    title: '拒收操作人'
  },

}

