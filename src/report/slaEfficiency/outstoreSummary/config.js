import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { orderType } from '@/report/options'
import { defaultSearchTime } from '@/report/utils'
import { packageTypeOptions } from '@/report/apiOptions'
// 查询接口
export const searchApiUrl = '/sla/monitor/outstock/statistic'

// 计算汇总查询接口
export const searchSumApiUrl = '/sla/monitor/outstock/statisticSum'

export const goDetailsKeys = {
  'kpiNonAchievePackageNum': { value: 'outKpiNonAchievePackage', label: 'KPI未达成包裹数'}, // KPI未达成包裹数
  'kpiNonAchieveOrderNum': { value: 'outKpiNonAchieveOrder', label: 'KPI未达成订单数'}, // KPI未达成订单数
  'offShelvesNonAchievePackageNum': { value: 'offShelvesNonAchievePackage', label: '下架未达成包裹数'}, // 下架未达成包裹数
  'offShelvesNonAchieveSecondOrderNum' : { value: 'offShelveNonAchieveOrder', label: '下架未达成订单数'}, // 下架未达成订单数
  // 'offShelvesNonAchieveBigBagNum': '4', //下架未达成大包数   --不需要
  'allotNonAchievePackageNum': { value: 'allotNonAchievePackage', label: '播种未达成包裹数'}, // 播种未达成包裹数
  'allotNonAchieveSecondOrderNum': { value: 'allotNonAchieveOrder', label: '播种未达成订单数'}, //  播种未达成订单数
  // 'allotNonAchieveBigBagNum': '6', //播种未达成大包数  --不需要
  'mergeNonAchievePackageNum': { value: 'mergeNonAchievePackage', label: '合箱未达成包裹数'}, //合箱未达成包裹数
  'mergeNonAchieveSecondOrderNum': { value: 'mergeNonAchieveOrder', label: '合箱未达成订单数'},// 合箱未达成订单数
  'packageNonAchievePackageNum': { value: 'packageNonAchievePackage', label: '组包未达成包裹数'}, //组包未达成包裹数
  'packageNonAchieveSecondOrderNum': { value: 'packageNonAchieveOrder', label: '组包未达成订单数'}, // 组包未达成订单数
  // 'packageNonAchieveBigBagNum': '9', //组包未达成大包数   --不需要
  'mergeNonAchieveBigBagNum' : { value: 'mergeNonAchieveBigBagNum', label: '合箱未达成大包数'}, // 合箱未达成大包数
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
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD',
        // timePanelProps: {
        //   format: 'HH:mm:ss'
        // },
        // showTime: true,
      }
    },
    turnoverType: {
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
    title: '统计时间',
  },
  turnoverType: {
    title: '包裹类型',
    cell: val => <ASelect value={val} getOptions={async() => await packageTypeOptions.then(op => [{label: '无', value: '0'}].concat(op))} isDetail defaultValue="-"></ASelect>
  },
  packageNum: {
    title: '包裹数',
    tips: 'KPI考核时间在选择时间范围内的一段包裹总数'
  },
  orderNum: {
    title: '订单数',
    tips: 'KPI考核时间在选择时间范围内的订单总数'
  },
  outstockAvgDuration: {
    width: 170,
    title: '出库总平均时长',
    tips: 'KPI考核时间在选择时间范围内包裹的出库总时长的平均值'
  },
  offShelvesAvgDuration: {
    width: 170,
    title: '下架平均时长',
    tips: 'KPI考核时间在选择时间范围内订单的下架时长的平均值'
  },
  allotAvgDuration: {
    width: 170,
    title: '播种平均时长',
    tips: 'KPI考核时间在选择时间范围内订单的播种时长的平均值'
  },
  mergeAvgDuration: {
    title: '合箱平均时长',
    tips: 'KPI考核时间在选择时间范围内订单的播种时长的平均值'
  },
  packageAvgDuration: {
    width: 170,
    title: '组包平均时长',
    tips: 'KPI考核时间在选择时间范围内包裹的组包时长的平均值'
  },
  kpiAchievePackageNum: {
    title: 'KPI达成包裹数',
    tips: 'KPI考核是否达成为【是】的包裹总数'
  },
  kpiAchieveOrderNum: {
    title: 'KPI达成订单数',
    tips: 'KPI考核是否达成为【是】的包裹总数'
  },
  offShelvesAchievePackageNum: {
    title: '下架达成包裹数',
    width: 170,
    tips: '下架扫描时间<=下架考核时间的包裹总数'
  },
  allotAchievePackageNum: {
    width: 170,
    title: '播种达成包裹数',
    tips: '播种扫描时间<=播种考核时间的包裹总数'
  },
  mergeAchievePackageNum: {
    title: '合箱达成包裹数',
    tips: '合箱扫描时间<=合箱考核时间的包裹总数'
  },
  packageAchievePackageNum: {
    width: 170,
    title: '组包达成包裹数',
    tips: '组包扫描时间<=组包考核时间的包裹总数'
  },
  kpiNonAchievePackageNum: {
    title: 'KPI未达成包裹数',
    width: 170,
    tips: 'KPI考核是否达成为【否】的包裹总数'
  },
  kpiNonAchieveOrderNum: {
    width: 170,
    title: 'KPI未达成订单数',
    tips: 'KPI考核是否达成为【否】的包裹对应的订单总数{需要根据二段LP号去重}'
  },
  offShelvesNonAchievePackageNum: {
    title: '下架未达成包裹数',
    width: 170,
    tips: '下架扫描时间>下架考核时间的包裹总数'
  },
  allotNonAchievePackageNum: {
    width: 170,
    title: '播种未达成包裹数',
    tips: '播种扫描时间>播种考核时间的包裹总数'
  },
  mergeNonAchievePackageNum: {
    width: 170,
    title: '合箱未达成包裹数',
    tips: '合箱扫描时间>合箱考核时间的包裹总数'
  },
  packageNonAchievePackageNum: {
    width: 170,
    title: '组包未达成包裹数',
    tips: '组包扫描时间>组包考核时间的包裹总数'
  },
  offShelvesNonAchieveSecondOrderNum: {
    title: '下架未达成订单数',
    width: 170,
    tips: '下架时长>下架考核时间的二段订单数'
  },
  allotNonAchieveSecondOrderNum: {
    title: '播种未达成订单数',
    width: 170,
    tips: '播种时长>播种考核时间的二段订单数'
  },
  mergeNonAchieveSecondOrderNum: {
    title: '合箱未达成订单数',
    width: 170,
    tips: '合箱时长>合箱考核时间的二段订单数'
  },
  packageNonAchieveSecondOrderNum : {
    title: '组包未达成订单数',
    width: 170,
    tips: '：组包时长>组包考核时间的二段订单数'
  },
  offShelvesNonAchieveBigBagNum: {
    title: '下架未达成大包数',
    width: 170,
    tips: '下架扫描时间>下架时效的包裹对应的大包数{需要根据大包号去重}'
  },
  allotNonAchieveBigBagNum: {
    width: 170,
    title: '播种未达成大包数',
    tips: '播种扫描时间>播种时效的包裹对应的大包数{需要根据大包号去重}'
  },

  mergeNonAchieveBigBagNum: {
    width: 170,
    title: '合箱未达成大包数',
    tips: '播种扫描时间>播种时效的包裹对应的大包数'
  },
  packageNonAchieveBigBagNum: {
    width: 170,
    title: '组包未达成大包数',
    tips: '组包扫描时间>组包时效的包裹对应的大包数{需要根据大包号去重}'
  },

  // offShelvesCheckTime: {
  //   title: '下架考核时间',
  // },

  // allotCheckTime: {
  //   width: 200,
  //   title: '播种考核时间'
  // },

  // mergeCheckTime: {
  //   title: '合箱考核时间'
  // },

  // packageCheckTime: {
  //   width: 200,
  //   title: '组包考核时间'
  // },

}

