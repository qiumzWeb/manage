import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import {
  getPackageTypeNameList,
  getMarkNodeTypeNameList,
  getConfirmStatusNameList,
  getTime,
  defaultSearchTime,
} from '../summary/config'
import {
  getCountry
} from '@/report/apiOptions'
export {
  getPackageTypeNameList,
  getMarkNodeTypeNameList,
  getConfirmStatusNameList,
  getTime,
  defaultSearchTime,
}
export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      attrs: {
        hasClear: false
      }
    },
    mailNo: {
      label: '包裹运单号',
    },
    referOrderId: {
      label: '订单交易号',
    },
    referLogisticsOrderCode: {
      label: '二段LP号',
    },
    packageTypeCodeList: {
      label: '异常包裹类型',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        placeholder: "请选择",
        getOptions: async() => {
          const data = await getPackageTypeNameList
          return Array.isArray(data) && data.map(d => ({
            label: d.description,
            value: d.code
          })) || []
        }
      }
    },
    markNodeTypeCodeList: {
      label: '异常标记节点',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        placeholder: "请选择",
        getOptions: async() => {
          const data = await getMarkNodeTypeNameList
          return Array.isArray(data) && data.map(d => ({
            label: d.description,
            value: d.code
          })) || []
        }
      }
    },
    confirmedStatusCodeList: {
      label: '异常确认类型',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        getOptions: async() => {
          const data = await getConfirmStatusNameList
          return Array.isArray(data) && data.map(d => ({
            label: d.description,
            value: d.code
          })) || []
        }
      }
    },
    countryCodeList: {
      label: '国家/地区',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        getOptions: async() => {
          const data = await getCountry
          return Array.isArray(data) && data || []
        }
      }
    },
    markingTime: {
      label: '异常标记起止时间',
      fixedSpan: 22,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true
      }
    },
  }
]
// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left',
  },
  mailNo: {
    title: '包裹运单号',
    width: 180
  },
  returnTrackingNumber: {
    title: '快递单号',
    width: 180
  },
  countryLabel: {
    title: '国家/地区'
  },
  referOrderId: {
    title: '交易订单号',
  },
  storeCode: {
    title: '库位号',
  },
  orderCreateTime: {
    title: '订单生成时间'
  },
  inboundTime: {
    title: '入库时间',
  },
  outDelegationCode: {
    title: '出库委托号'
  },
  packageStatusName: {
    title: '包裹状态',
  },
  packageTypeName: {
    title: '异常包裹类型',
  },
  markedTime: {
    title: '异常标记时间',
    width: 180
  },
  markedNodeName: {
    title: '异常标记节点',
  },
  storeOnTime: {
    title: '异常件上架时间',
    width: 180
  },
  storeOffTime: {
    title: '异常件下架时间',
    width: 180
  },
  offshelvesOperator: {
    title: '下架操作人'
  },
  onShelfTime: {
    title: '包裹在架时间',
    width: 180
  },
  confirmedTime: {
    title: '异常件确认时间',
    width: 180
  },
  confirmedStatusName: {
    title: '异常确认类型',
  },
  taskTypeName: {
    title: '处理策略',
    width: 180
  },
  destructionTime: {
    title: '包裹销毁时间',
    width: 180
  },
  returnTime: {
    title: '包裹退件时间',
    width: 180
  },
  outboundTime: {
    title: '异常出库时间',
    width: 180
  },
  outboundBagCode: {
    title: '异常出库袋号'
  },
  allotOperator: {
    title: '播种操作人'
  },
  remarks: {
    title: '备注',
  },
  make: {
    title: '操作',
    lock: 'right',
    width: 100
  }
}

