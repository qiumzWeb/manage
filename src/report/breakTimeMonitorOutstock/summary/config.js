import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { orderType } from '@/report/options'
import { defaultSearchTime } from '@/report/utils'
import { packageTypeOptions } from '@/report/apiOptions'
// 查询接口
export const searchApiUrl = '/segment/monitor/listOutStockMonitor'

// 计算汇总查询接口
export const searchSumApiUrl = '/segment/monitor/listOutStockMonitorSum'

export const goDetailsKeys = {
  'nOutNoticeHandOver': { value: 'nOutNoticeHandOver', label: '通知出库-交干'}, 
  'nOutNoticeOffShelves': { value: 'nOutNoticeOffShelves', label: '通知出库-下架'}, 
  'nOffShelvesAllot': { value: 'nOffShelvesAllot', label: '下架-播种'},
  'nAllotMerge' : { value: 'nAllotMerge', label: '播种-合箱'}, 
  'nMergePack': { value: 'nMergePack', label: '合箱-组包'},
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
  SJPJZYSC_XS: {
    title: '实际平均作业时长（小时）',
    children: {
      dOutNoticeOffShelves: {
        title: '通知出库-下架',
        tips: '在统计时间范围内（通知出库-下架）的包裹下架时长的平均值'
      },
      dOffShelvesAllot: {
        width: 170,
        title: '下架-播种',
        tips: '在统计时间范围内（下架-播种）的包裹播种时长的平均值'
      },
      dAllotMerge: {
        width: 170,
        title: '播种-合箱',
        tips: '在统计时间范围内（播种-合箱）的包裹合箱时长的平均值'
      },
      dMergePack: {
        width: 170,
        title: '合箱-组包',
        tips: '在统计时间范围内（合箱-组包）的组包时长的平均值'
      },
      dOutNoticePack: {
        title: '通知出库-组包',
        tips: '在统计时间范围内（通知出库-组包）的组包时长的平均值'
      },
      dPackOutBounded: {
        width: 170,
        title: '组包-发运',
        tips: '在统计时间范围内（组包-发运）的组包时长的平均值'
      },
      dOutBoundedHandOver: {
        title: '发运-交干',
        tips: '在统计时间范围内（发运-交干）的交干时长的平均值'
      },
      dPackHandOver: {
        title: '组包-交干',
        tips: '在统计时间范围内（组包-交干）的交干时长的平均值'
      },
      dOutNoticeHandOver: {
        title: '通知出库-交干',
        width: 170,
        tips: '在统计时间范围内（通知出库-交干）的交干时长的平均值'
      },
    }
  },
  outboundNoticeCount: {
    title: '通知出库包裹数量',
    width: 200,
    tips: '在统计时间范围内，通知出库的包裹总量'
  },
  wdczyl: {
    title: '未达成作业量',
    children: {
      nOutNoticeHandOver: {
        width: 170,
        title: '通知出库-交干',
        tips: '（通知出库-交干的实际时长）>（通知出库-交干的考核时长）对应的包裹总数'
      },
      nOutNoticeOffShelves: {
        width: 170,
        title: '通知出库-下架',
        tips: '（通知出库-下架的实际时长）>（通知出库-下架的考核时长）对应的包裹总数'
      },
      nOffShelvesAllot: {
        title: '下架-播种',
        tips: '下架-播种的实际时长）>（下架-播种的考核时长）对应的包裹总数'
      },
      nAllotMerge: {
        width: 170,
        title: '播种-合箱',
        tips: '（播种-合箱的实际时长）>（播种-合箱的考核时长）对应的包裹总数'
      },
      nMergePack: {
        title: '合箱-组包',
        tips: '（合箱-组包的实际时长）>（合箱-组包的考核时长）对应的包裹总数'
      },
    }
  },

}

