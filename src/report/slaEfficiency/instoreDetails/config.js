import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { defaultSearchTime } from '@/report/utils'
import { packageTypeOptions } from '@/report/apiOptions'
import { goDetailsKeys } from '@/report/slaEfficiency/instoreSummary/config'
// 包裹状态
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
      label: 'KPI考核时间',
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
    packageType: {
      label: '包裹类型',
      component: ASelect,
      attrs: {
        getOptions: async({field}) => {
          return  await packageTypeOptions
        }
      }
    },
    logisticsPackageCode: {
      label: '一段LP号',
    },
    deliveryNo: {
      label: '包裹号',
    },
    type: {
      label: '包裹状态',
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
  deliveryCode: {
    title: '包裹号',
  },
  packageType: {
    title: '包裹类型',
    cell: val => <ASelect isDetail value={val} getOptions={async() => await packageTypeOptions.then(op => [{label: '无', value: '0'}].concat(op))} defaultValue="无"></ASelect>
  },
  kpiEndTime: {
    title: 'KPI考核时间',
  },
  instockKpiAcieve: {
    width: 200,
    title: '入库KPI是否达成',
    tips: '【是】上架完成时间<=KPI考核时间；【否】上架完成时间>KPI考核时间【否】没有上架完成时间，且KPI考核时间<=当前系统时间。'
  },
  allInstockDuration: {
    width: 200,
    title: '入库总时长',
    tips: '上架时间批次打卡时间。'
  },
  instockKpiOverDuration: {
    width: 200,
    title: '入库超时时长',
    tips: '【是】上架完成时间-KPI考核时间为负数；【否】上架完成时间-KPI考核时间为正数【否】没有上架完成时间，当前系统时间-KPI考核时间为正数。'
  },
  arriveTime: {
    title: '批次打卡时间'
  },
  signCheckTime: {
    title: '签收考核时间',
  },
  signTime: {
    title: '签收时间'
  },
  signDuration: {
    title: '签收时长',
    tips: '签收时间-批次打卡时间；【达成】为正数且小于等于签收考核时间；【未达成】为正数且大于签收考核时间；或者为负数；再或者下一个环节为空白时间。'
  },
  signBigBagNo: {
    width: 200,
    title: '签收大包号',
    tips: '签收环节小包对应的大包号，有多个取最后一个。'
  },
  instockCheckTime: {
    title: '入库考核时间',
  },
  instockTime: {
    title: '入库时间'
  },
  instockDuration: {
    width: 200,
    title: '入库时长',
    tips: '入库时间-签收时间；【达成】为正数且小于等于入库考核时间；；【未达成】为正数且大于入库考核时间；或者为负数；再或者下一个环节为空白时间。'
  },
  instockBigBagNo: {
    title: '入库大包号',
    tips: '入库环节小包对应的大包号，有多个取最后一个。'
  },
  onShelvesCheckTime: {
    title: '上架考核时间',
  },
  onShelvesTime:{
    title: '上架时间'
  },
  onShelvesBigBagNo: {
    width: 200,
    title: '入库容器号'
  },
  onShelvesDuration: {
    title: '上架时长',
    tips: '上架时间-入库时间；【达成】为正数且小于等于上架考核时间；；【未达成】为正数且大于上架考核时间；或者为负数；再或者下一个环节为空白时间。'
  },
  // instockKpiCheckTime: {
  //   width: 200,
  //   title: '入库KPI考核时长'
  // },
}

