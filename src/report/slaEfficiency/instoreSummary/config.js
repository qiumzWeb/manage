
import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { defaultSearchTime } from '@/report/utils'
import { packageTypeOptions } from '@/report/apiOptions'

// 查询接口
export const searchApi = '/sla/monitor/instock/statistic'

// 计算汇总查询接口
export const searchSumApi = '/sla/monitor/instock/statisticSum'

export const goDetailsKeys = {
  'kpiNonAchievePackageNum': {value: "inKpiNonAchievePackage", label: 'KPI未达成包裹数'}, // KPI未达成包裹数
  'signNonAchievePackageNum': {value: "signNonAchievePackage", label: '签收未达成包裹数'}, // 签收未达成包裹数
  'instockNonAchievePackageNum': {value: "instockNonAchievePackage", label: '入库未达成包裹数'}, //入库未达成包裹数
  'onShelvesNonAchievePackageNum': {value: "onShelvesNonAchievePackage", label: '上架未达成包裹数'} //上架未达成包裹数
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
      label: 'KPI考核时间',
      fixedSpan: 22,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      attrs: {
        // format: 'YYYY-MM-DD HH:mm:ss',
        // timePanelProps: {
        //   format: 'HH:mm:ss'
        // },
        // showTime: true,
      }
    },
    packageType: {
      label: '包裹类型',
      component: ASelect,
      attrs: {
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
  kpiEndTime: {
    title: 'KPI考核时间',
  },
  packageType: {
    title: '包裹类型',
    cell: val => <ASelect isDetail value={val} getOptions={async() => await packageTypeOptions.then(op => [{label: '无', value: '0'}].concat(op))} defaultValue="-"></ASelect>
  },
  packageNum: {
    title: '包裹数',
    tips: 'KPI考核时间在选择时间范围内的包裹总数'
  },
  allInstockAvgDuration: {
    width: 200,
    title: '入库总平均时长',
    tips: 'KPI考核时间在选择时间范围内包裹的入库总时长的平均值'
  },
  avgSignDuration: {
    title: '签收平均时长',
    tips: 'KPI考核时间在选择时间范围内包裹的签收时长的平均值'
  },
  avgInstockDuration: {
    title: '入库平均时长',
    tips: 'KPI考核时间在选择时间范围内包裹的入库时长的平均值'
  },
  avgOnshelvesDuration: {
    width: 160,
    title: '上架平均时长',
    tips: 'KPI考核时间在选择时间范围内包裹的上架时长的平均值'
  },
  kpiAchievePackageNum: {
    title: 'KPI达成包裹数',
    tips: 'KPI考核是否达成为【是】的包裹总数'
  },
  signAchievePackageNum: {
    width: 160,
    title: '签收达成包裹数',
    tips: '签收时长<=签收考核时间的包裹总数'
  },
  instockAchievePackageNum: {
    width: 160,
    title: '入库达成包裹数',
    tips: '入库时长<=入库考核时间的包裹总数'
  },
  onShelvesAchievePackageNum: {
    title: '上架达成包裹数',
    tips: '上架时长<=上架考核时间的包裹总数'
  },
  kpiNonAchievePackageNum: {
    title: 'KPI未达成包裹数',
    width: 160,
    tips: 'KPI考核是否达成为【否】的包裹总数'
  },
  signNonAchievePackageNum: {
    title: '签收未达成包裹数',
    width: 170,
    tips: '签收时长>签收考核时间的包裹总数'
  },
  signNonAchieveBigBagNum: {
    title: '签收未达成大包数',
    width: 170,
    tips: '签收时长>签收考核时间的包裹对应的大包数{需要根据大包号去重}'
  },
  instockNonAchievePackageNum: {
    width: 170,
    title: '入库未达成包裹数',
    tips: '入库时长>入库考核时间的包裹总数'
  },
  instockNonAchieveBigBagNum: {
    width: 170,
    title: '入库未达成大包数',
    tips: '入库时长>入库考核时间的包裹对应的大包数{需要根据大包号去重}'
  },
  onShelvesNonAchievePackageNum: {
    title: '上架未达成包裹数',
    width: 170,
    tips: '上架时长>上架考核时间的包裹总数'
  },
  onShelvesAchieveBigBagNum: {
    title: '上架达成大包数',
    tips: '上架时长>上架时效的包裹对应的大包数{需要根据大包号去重}'
  },
}

