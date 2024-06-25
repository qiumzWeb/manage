import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { kpiTimeTypeReturnOptions } from '@/report/options'
import { defaultSearchTime } from '@/report/utils'
import { packageTypeOptions } from '@/report/apiOptions'
// 查询接口
export const searchApiUrl = '/reversal/monitor/listOutStockMonitor'

export const goDetailsKeys = {
  'signSuccessPackages': { value: '0', label: '逆向签收成功包裹'}, 
  'rejectPackages': { value: '1', label: '拒收订单'}, 
  'inStockSuccessPackages': { value: '2', label: '逆向入库成功包裹'},
  'inStockFailPackages' : { value: '3', label: '逆向入库失败包裹'}, 
  'waitPackOrders': { value: '4', label: '待装袋订单'},
  'waitOutBoundedOrders': { value: '5', label: '待发运订单'},
  'delayOutBoundedOrders': { value: '6', label: '延迟出库订单'},
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
    timeField: {
      label: '时间类型',
      component: ASelect,
      needExpandToData: true,
      defaultValue: '0',
      attrs: {
        hasClear: false,
        getOptions: async({field}) => {
          return kpiTimeTypeReturnOptions
        }
      }
    },
    kpiEndTimeScope: {
      label: '统计时间',
      fixedSpan: 22,
      needExpandToData: true,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      transTimeCode: ['startTime', 'endTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      }
    },

  }
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  kpiEndTimeScope: {
    width: 170,
    title: '逆向签收时间',
    cell: (val, index, record) => `${record.startTime || '_'} ~ ${record.endTime || '_'}`
  },
  signSuccessPackages: {
    title: '逆向签收成功包裹数量',
    width: 120,
  },
  rejectPackages: {
    title: '拒收订单数'
  },
  inStockSuccessPackages: {
    title: '逆向入库成功包裹数量',
    width: 120,
  },
  inStockFailPackages: {
    title: '逆向入库失败包裹数量',
    width: 120,
  },
  waitPackOrders: {
    title: '待装袋订单数量'
  },
  waitOutBoundedOrders: {
    title: '待发运订单数量'
  },
  successOutBoundedRate: {
    title: '出库完成率'
  },
  delayOutBoundedOrders: {
    title: '延迟出库订单数'
  },
  timelyOutBoundedRate: {
    title: '出库及时率'
  },
}

