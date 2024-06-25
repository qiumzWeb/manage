import { Input, Radio  } from '@/component'
import { getWid } from 'assets/js'
import ASelect from '@/component/ASelect/index'
export const packageTypeOptions = [
  {label: '出库委托号', value: '0'},
  {label: '平台物流号（二段LP）', value: '1'},
  {label: '末端面单号', value: '2'},
  {label: '平台跟踪号（一段LP）', value: '3'},
  {label: '包裹运单号', value: '4'},
]
// 查询条件
export const searchModel = {
  warehouseId: {
    label: '仓库名称',
    defaultValue: getWid(),
    component: ASelect,
    attrs: {
      hasClear: false
    }
  },
  queryType: {
    span: 24,
    component: Radio.Group,
    defaultValue: '0',
    attrs: {
      dataSource: packageTypeOptions
    }
  },
  noList: {
    // label: '出库委托号、平台物流号（二段LP）、末端面单号、平台跟踪号（一段LP）、包裹运单号',
    span: 24,
    component: Input.TextArea,
    attrs: {
      rows: 5,
      placeholder: "最多可查询5个单号、通过空格或者回车分隔"
    }
  }
}

// 二段订单信息配置
export const SecondOrderInfoModel = {
  orderCreateTime: {
    label: '订单生成时间',
    attrs: {detail: true}
  },
  regionCodeLabel: {
    label: '目的国',
    attrs: {detail: true}
  },
  payableWeight: {
    label: '计费重量',
    attrs: {detail: true}
  },
  delegateNo: {
    label: '出库委托号',
    attrs: {detail: true}
  },
  endCarrierCodeLabel: {
    label: '渠道名称',
    attrs: {detail: true}
  },
  orderActualWeight: {
    label: '订单实重',
    attrs: {detail: true}
  },
  orderCarriageStatusLabel: {
    label: '订单状态',
    attrs: {detail: true}
  },
  volumeWeight: {
    label: '订单体积重量',
    attrs: {detail: true}
  },
  fpxTrackingNo: {
    label: '内部跟踪号',
    attrs: {detail: true}
  },
  specialParcelSign: {
    label: '订单属性',
    attrs: {detail: true}
  },
  shippingFee: {
    label: '订单支付费用',
    attrs: {detail: true}
  },
  referLogisticsOrderCode: {
    label: '平台跟踪号(拆单前)',
    attrs: {detail: true}
  },
  exceptionTypeLabel: {
    label: '异常状态',
    attrs: {detail: true}
  },
  orderSurcharge: {
    label: '订单附加费',
    attrs: {detail: true}
  },
  referLineLogisticsOrderCode: {
    label: '干线运输号(拆单后',
    attrs: {detail: true}
  },
  sourceLabel: {
    label: '平台类型',
    attrs: {detail: true}
  },
  // dddddd: {
  //   label: '订单体积',
  //   attrs: {detail: true}
  // },
  endMailNo: {
    label: '末端面单号',
    attrs: {detail: true}
  },
  deliveryTypeLabel: {
    label: '服务类型',
    attrs: {detail: true}
  },
  carrierTypeLabel: {
    label: '业务类型',
    attrs: {detail: true}
  },
}


// 二段订单轨迹配置
export const SecondOrderTrackColumns = {
  jobTime: {
    title: '作业时间',
    width: 180
  },
  actionName: {
    title: '发生动作',
    width: 120
  },
  track: {
    title: '跟踪记录',
  },
  packageStatus: {
    title: '状态',
    width: 120
  },
  operatorName: {
    title: '操作人',
    width: 120
  },
}

// 一段包裹信息
export const firstPackageColumns = {
  referLogisticsOrderCode: {
    title: '一段LP号',
    width: 180,
    lock: 'left',
  },
  mailNo: {
    title: '包裹运单号',
    width: 180,
  },
  carrierCodeLabel: {
    title: '物流公司',
  },
  weight: {
    title: '包裹实重(g)',
  },
  packageStatusLabel: {
    title: '包裹状态',
  },
  packageExceptionTypeLabel: {
    title: '异常状态',
  },
  totalItemActualPrice: {
    title: '实付金额',
  },
  currency: {
    title: '币种',
  },
  pickupResName: {
    title: '揽收仓名称',
  },
  storeCode: {
    title: '库位号'
  }
}
// 设置默认宽度 为 150
// Object.values(firstPackageColumns).forEach(v => !v.width && (v.width = 150))