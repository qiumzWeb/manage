import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { orderType } from '@/report/options'
import { defaultSearchTime } from '@/report/utils'
import { packageTypeOptions } from '@/report/apiOptions'
import { goDetailsKeys } from '@/report/slaEfficiency/outstoreSummary/config'
// 查询接口
export const searchApiUrl = '/sla/monitor/outstock/detail'

export const packageStatus = Object.values(goDetailsKeys)

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
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      attrs: {
        // format: 'YYYY-MM-DD HH:mm:ss',
        // timePanelProps: {
        //   format: 'HH:mm:ss'
        // }
      }
    },
    turnoverType: {
      label: '包裹类型',
      component: ASelect,
      attrs: {
        getOptions: async() => {
          return  await packageTypeOptions
        }
      }
    },
    packageLogisticsCode: {
      label: '一段LP号',
    },
    deliveryNo: {
      label: '包裹号',
    },
    orderLogisticsCode: {
      label: '二段LP号',
      attrs: {
        placeholder: '多个LP号使用空格分隔'
      },
      
    },
    delegationNo: {
      label: '出库委托号',
      attrs: {
        placeholder: '多个出库委托号使用空格分隔'
      },
    },
    type: {
      label: '包裹/订单状态',
      component: ASelect,
      attrs: {
        getOptions: async() => {
          return packageStatus
        }
      }
    }
  }
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  logisticsPackageCode: {
    title: '一段LP号',
  },
  delegationNo: {
    title: '出库委托号',
  },
  logisticsOrderCode: {
    title: '二段LP号',
  },
  endCarrierLabel: {
    title: '渠道'
  },
  packageNo: {
    title: '包裹号',
  },
  turnoverType: {
    title: '包裹类型',
    cell: val => <ASelect value={val} getOptions={async() => await packageTypeOptions.then(op => [{label: '无', value: '0'}].concat(op))} isDetail defaultValue="-"></ASelect>
  },
  kpiEndTime: {
    title: 'KPI考核时间',
  },
  outStockAchieve: {
    title: '出库KPI是否达成',
    width: 160,
    tips: '【是】组包完成时间<=KPI考核时间；【否】组包完成时间>KPI考核时间；【否】没有组包完成时间，且KPI考核时间<=当前系统时间。'
  },
  allOutstockDuration: {
    title: '出库总时长',
    tips: '组包时间-KPI考核节点扫描时间(出库)。'
  },
  outStockOverDuration: {
    width: 200,
    title: '出库超时时长',
    tips: '【是】组包完成时间-KPI考核时间为负数；【否】组包完成时间-KPI考核时间为正数【否】没有组包完成时间，当前系统时间-KPI考核时间为正数。'
  },
  orderCreateTime: {
    title: '出库通知时间'
  },
  offShelvesCheckTime: {
    width: 200,
    title: '下架考核时间',
  },
  offShelvesTime: {
    title: '下架时间'
  },
  offShelvesDuration: {
    width: 200,
    title: '下架时长',
    tips: '下架时间-出库通知时间；【达成】下架时间小于等于下架考核时间；【未达成】下架时间大于下架考核时间；或者下一个环节为空白时间。'
  },
  offShelvesBigBagNo: {
    title: '下架大包号',
    tips: '下架环节小包对应的大包号，有多个取最后一个。'
  },
  allotCheckTime: {
    title: '播种考核时间',
    
  },
  allotTime: {
    title: '播种时间'
  },
  allotDuration: {
    title: '播种时长',
    tips: '播种时间-下架时间；【达成】播种时间小于等于播种考核时间；【未达成】播种时间大于播种考核时间；或者下一个环节为空白时间。'
  },
  allotBigBagNo: {
    title: '播种大包号',
    tips: '播种环节小包对应的大包号，有多个取最后一个。'
  },
  mergeCheckTime: {
    width: 200,
    title: '合箱时考核时间'
  },
  mergeTime: {
    title: '合箱时间'
  },
  mergeDuration: {
    width: 200,
    title: '合箱时长',
    tips: '合箱时间-播种时间；【达成】合箱时间小于等于合箱考核时间；【未达成】合箱时间大于合箱考核时间；或者下一个环节为空白时间。'
  },
  packageCheckTime: {
    width: 200,
    title: '组包考核时间'
  },
  packTime: {
    title: '组包时间'
  },
  packageDuration: {
    width: 200,
    title: '组包时长',
    tips: '组包时间-合箱时间；【达成】组包时间小于等于组包考核时间；【未达成组包时间大于组包考核时间；或者下一个环节为空白时间。'
  },
  packageBigBagNo: {
    width: 200,
    title: '组包大包号',
    tips: '组包环节小包对应的大包号，有多个取最后一个。'
  },

  // outStockCheckTime: {
  //   title: '出库KPI考核时长'
  // },

}

