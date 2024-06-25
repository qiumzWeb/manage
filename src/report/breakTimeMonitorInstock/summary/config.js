import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { orderType } from '@/report/options'
import { defaultSearchTime } from '@/report/utils'
import { packageTypeOptions } from '@/report/apiOptions'
// 查询接口
export const searchApiUrl = '/segment/monitor/listInStockMonitor'

// 计算汇总查询接口
export const searchSumApiUrl = '/segment/monitor/listInStockMonitorSum'

export const goDetailsKeys = {
  'nArriveSign': { value: 'nArriveSign', label: '批次到达-大包签收'}, 
  'nSignOnShelves': { value: 'nSignOnShelves', label: '大包签收-上架'},
  'nArriveOnShelves': { value: 'nArriveOnShelves', label: '批次到达-上架'},
  'nSignInStock': {value: 'nSignInStock', label: '大包签收-入库'}
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
    turnoverType: {
      label: '包裹类型',
      component: ASelect,
      format: (val) => Array.isArray(val) && val.join(',') || val, 
      attrs: {
        mode: 'multiple',
        getOptions: async({field}) => {
          return await packageTypeOptions
        }
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
  turnoverType: {
    title: '包裹类型',
    cell: val => <ASelect value={val} getOptions={async() => await packageTypeOptions.then(op => [{label: '无', value: '0'}].concat(op))} isDetail defaultValue="-"></ASelect>
  },
  statisticTime: {
    title: '统计时间(批次到达时间)',
    width: 300,
    cell: (val) => <pre>{typeof val ==='string' && val.replace('至', '至\n')}</pre>
  },
  SJPJZYSC_XS: {
    title: '实际平均作业时长（小时）',
    children: {
      dArriveSign: {
        title: '批次到达-大包签收',
        width: 200,
        tips: '在统计时间范围内（批次到达-大包签收时间）的包裹签收时长的平均值'
      },
      dSignInStock: {
        title: '大包签收-入库',
        width: 200,
        tips: "在统计时间范围内（大包签收-入库）的包裹入库时长的平均值"
      },
      dSignOnShelves: {
        title: '大包签收-上架',
        tips: '在统计时间范围内（包裹签收-上架时间）的包裹上架时长的平均值'
      },
      dArriveOnShelves: {
        title: '批次到达-上架',
        tips: '在统计时间范围内（批次到达-上架时间）的包裹上架时长的平均值'
      }
    }
  },
  arrivePackageCount: {
    title: '批次到达包裹量',
    tips: 'K在统计时间范围内，批次到达的包裹总量'
  },
  WDCZYL: {
    title: '未达成作业量',
    children: {
      nArriveSign: {
        title: '批次到达-大包签收',
        width: 200,
        tips: '（批次到达-签收的实际时长）>（批量到达-签收的考核时长）对应的包裹总数'
      },
      nSignInStock: {
        title: '大包签收-入库',
        width: 200,
        tips: "大包签收-入库：（大包签收-入库的实际时长）>（大包签收-入库的考核时长）对应的包裹总数"
      },
      nSignOnShelves: {
        title: '大包签收-上架',
        tips: '大包签收-上架：（大包签收-上架的实际时长）>（大包签收-上架的考核时长）对应的包裹总数'
      },
      nArriveOnShelves: {
        title: '批次到达-上架',
        tips: '（批次到达-上架的实际时长）>（批次到达-上架的考核时长）对应的包裹总量'
      }
    }
  },


}

