import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { defaultSearchDate, defaultCurrentTime, getDayjsTime } from '@/report/utils'
import { getDistrictGroup, packageTypeOptions} from '@/report/apiOptions'
import {
  searchRangeOption,
  timeTypeOption,
  kpiEndOperationOptions,
  kpiTimeTypeOption
} from '@/report/options'
// 测试下
// 查询接口
export const searchApi = '/kpi/monitor/instock/recordList'
// 汇总接口查询
export const searchSumApi = '/kpi/monitor/instock/recordListSum'
// 详情跳转字段
export const goDetailsKeys = {
  'arriveNotReceiving': '3', // 到达未签包裹数量
  'receivingNotInstock': '4', // 已签未入库包裹数量
  'instockNotShelvesCount': '1', // 已入未上架包裹数量
  'delayShelvesCount': '2', //延迟上架包裹数量
  'rejectCount': '5', // 拒收包裹数量
  'delayRejectCount': '6' // 延迟拒收包裹数量
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
    searchRangeType: {
      label: '统计维度',
      defaultValue: '0',
      component: ASelect,
      attrs: {
        hasClear: false,
        getOptions: async() => {
          return searchRangeOption
        }
      }
    },
    districtGroupList: {
      label: '库区组维度',
      component: ASelect,
      show: data => data.searchRangeType === '1',
      attrs: {
        mode: 'multiple',
        placeholder: "请选择",
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          const {data} = await getDistrictGroup(values)
          return Array.isArray(data) && data.map(d => ({
            label: d.name,
            value: d.code
          })) || []
        }
      }
    },
    districtList: {
      label: '库区维度',
      component: ASelect,
      show: data => data.searchRangeType === '2',
      attrs: {
        mode: 'multiple',
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          const {data} = await getDistrictGroup(values)
          return Array.isArray(data) && data.map(d => ({
            label: d.name,
            value: d.code
          })) || []
        }
      }
    },
    operatingTimeType: {
      label: '时间类型',
      component: ASelect,
      defaultValue: '3',
      attrs: {
        getOptions: async() => {
          return timeTypeOption
        }
      }
    },
    makeTime: {
      label: '统计时间',
      fixedSpan: 22,
      defaultValue: defaultSearchDate,
      show: data => data.operatingTimeType == '3',
      component: DatePicker2.RangePicker,
      attrs: {
        hasClear: false,
        format: 'YYYY-MM-DD',
      }
    },
    makeTime1: {
      label: '统计时间',
      fixedSpan: 22,
      show: data => data.operatingTimeType != '3',
      defaultValue: [getDayjsTime({format: 'YYYY-MM-DD 00:00:00'}), getDayjsTime({format: 'YYYY-MM-DD 23:59:59'})],
      component: DatePicker2.RangePicker,
      attrs: {
        hasClear: false,
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true
      }
    },
    turnoverTypes: {
      label: '包裹类型',
      component: ASelect,
      defaultValue: async() => {
        const val = await packageTypeOptions
        return val.map(v => v.value)
      },
      attrs: {
        mode: 'multiple',
        hasClear: false,
        getOptions: async() => {
          return await packageTypeOptions
        }
      }
    },
  }
]
// 列表
export const tColumns = {
  warehouseShort: {
    title: '仓库名称',
    lock: 'left'
  },
  searchRangeType: {
    title: '统计维度',
    cell: (val) => <ASelect value={val} getOptions={async() => searchRangeOption} isDetail></ASelect>,
    // lock: 'left'
  },
  searchRangeName: {
    title: '维度名称',
    lock: 'left'
  },
  operatingDateRange: {
    title: '统计时间',
    width: 350,
    lock: 'left'
  },
  operatingTimeType: {
    title: '时间类型',
    cell: (val) => <ASelect value={val} getOptions={async() => timeTypeOption} isDetail></ASelect> 
  },
  kpiCheckNode: {
    title: 'KPI考核节点',
    width: 150,
    cell: val => <ASelect value={val} getOptions={async() => kpiTimeTypeOption} defaultValue="-" isDetail></ASelect>
  },
  packageType: {
    title: '包裹类型',
    cell: (val) => <ASelect value={val} getOptions={async() => await packageTypeOptions} defaultValue="-" isDetail></ASelect> 
  },
  arriveCount: {
    title: '批次到达包裹数量',
    tips: `时间类型（批次到达）：批次到达时间在选择的时间范围内的一段包裹总量;
时间类型（KPI考核时间）且考核节点（批次到达）：KPI考核时间在选择时间内的批次到达的一段包裹数量;
其余场景为空`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：批次到达时间：批次到达时间在选择的时间范围内的一段包裹总量;
// 时间类型+KPI考核节点=签收时间+-：-;
// 时间类型+KPI考核节点=入库时间+-：-;
// 时间类型+KPI考核节点=KPI考核时间+批次到达：KPI考核时间在选择时间内且+KPI考核节点为批次到达的一段包裹数量;
// 时间类型+KPI考核节点=KPI考核时间+签收：KPI考核时间在选择时间内且+KPI考核节点为签收的一段包裹数量;
// 时间类型+KPI考核节点=KPI考核时间+入库：KPI考核时间在选择时间内且+KPI考核节点为入库的一段包裹数量`
  },
  receivingCount: {
    title: '签收包裹数量',
    tips: `时间类型（批次到达)：批次到达的已签收的一段包裹数量
时间类型（签收时间）：签收时间在选择的时间范围内的一段包裹总量
时间类型（KPI考核时间）且考核节点（批次到达）：KPI考核时间在选择时间内批次到达的已签收一段包裹数量
时间类型（KPI考核时间）且考核节点（签收）：KPI考核时间在选择时间内已签收一段包裹数量
其余场景为空`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：批次到达的已签收的一段包裹数量
// 时间类型+KPI考核节点=签收时间+-：签收时间在选择的时间范围内的一段包裹总量
// 时间类型+KPI考核节点=入库时间+-：-
// 时间类型+KPI考核节点=KPI考核时间+批次到达：KPI考核时间在选择时间内且+KPI考核节点为批次到达的已签收一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：KPI考核时间在选择时间内且+KPI考核节点为签收的已签收一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：-`
  },
  arriveNotReceiving: {
    title: '到达未签包裹数量',
    tips: `时间类型（批次到达）：批次到达的包裹中未签收的一段包裹数量
时间类型（KPI考核时间）且考核节点（批次到达）：KPI考核时间在选择时间内批次到达的包裹中未签收的一段包裹数量
其余场景为空`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：批次到达的包裹中未签收的一段包裹数量
// 时间类型+KPI考核节点=签收时间+-：-
// 时间类型+KPI考核节点=入库时间+-：-
// 时间类型+KPI考核节点=KPI考核时间+批次到达：KPI考核时间在选择时间内且+KPI考核节点为批次到达的包裹中未签收的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：-
// 时间类型+KPI考核节点=KPI考核时间+入库：-`
  },
  instockCount: {
    title: '入库包裹数量',
    tips: `时间类型（批次到达)：批次到达的包裹中已入库的包一段裹数量
时间类型（签收时间）：签收的包裹中已入库的包裹数量
时间类型(入库时间)：入库时间在选择的时间范围内的一段包裹总量
时间类型(KPI考核时间)且考核节点（批次到达）：KPI考核时间在选择时间内批次到达的包裹中已入库的一段包裹数量
时间类型（KPI考核节点）且考核节点（签收）：KPI考核时间在选择时间内签收的包裹中已入库的一段包裹数量
时间类型（KPI考核节点）且考核节点（入库）：KPI考核时间在选择时间内已入库的一段包裹数量
其余场景为空`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：批次到达的包裹中已入库的包一段裹数量
// 时间类型+KPI考核节点=签收时间+-：签收的包裹中已入库的包裹数量
// 时间类型+KPI考核节点=入库时间+-：入库时间在选择的时间范围内的一段包裹总量
// 时间类型+KPI考核节点=KPI考核时间+批次到达：KPI考核时间在选择时间内且+KPI考核节点为批次到达的包裹中已入库的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：KPI考核时间在选择时间内且+KPI考核节点为签收的包裹中已入库的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：KPI考核时间在选择时间内且+KPI考核节点为入库的一段包裹数量`
  },
  receivingNotInstock: {
    title: '已签未入库包裹数量',
    tips: `时间类型(批次到达时间）：批次到达的包裹中已签收未入库的一段包裹数量
时间类型（签收时间）：签收的包裹中已签收未入库的包裹数量
时间类型（KPI考核时间）且考核节点（批次到达）：KPI考核时间在选择时间内批次到达的包裹中已签收未入库的一段包裹数量
时间类型（KPI考核时间）且考核节点（签收）：KPI考核时间在选择时间内签收的包裹中已签收未入库的一段包裹数量
其余场景为空`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：批次到达的包裹中已签收未入库的一段包裹数量
// 时间类型+KPI考核节点=签收时间+-：签收的包裹中已签收未入库的包裹数量
// 时间类型+KPI考核节点=入库时间+-：-
// 时间类型+KPI考核节点=KPI考核时间+批次到达：KPI考核时间在选择时间内且+KPI考核节点为批次到达的包裹中已签收未入库的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：KPI考核时间在选择时间内且+KPI考核节点为签收的包裹中已签收未入库的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：-`
  },
  shelvesCount: {
    title: '已上架包裹数量',
    tips: `时间类型（批次到达时间)：批次到达的包裹中已上架的一段包裹数量
时间类型（签收时间）：签收的包裹中已上架的包裹数量
时间类型（入库时间）：入库的包裹已上架的包裹数量
时间类型（KPI考核时间）且考核节点（批次到达）：KPI考核时间在选择时间内批次到达的包裹中已上架的一段包裹数量
时间类型（KPI考核时间）且考核节点（签收）：KPI考核时间在选择时间内签收的包裹中已上架的包裹数量
时间类型（KPI考核节点）且考核节点（入库）：KPI考核时间在选择时间内入库的包裹已上架的包裹数量`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：批次到达的包裹中已上架的一段包裹数量
// 时间类型+KPI考核节点=签收时间+-：签收的包裹中已上架的包裹数量
// 时间类型+KPI考核节点=入库时间+-：入库的包裹已上架的包裹数量
// 时间类型+KPI考核节点=KPI考核时间+批次到达：KPI考核时间在选择时间内且+KPI考核节点为批次到达的包裹中已上架的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：KPI考核时间在选择时间内且+KPI考核节点为签收的包裹中已上架的包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：KPI考核时间在选择时间内且+KPI考核节点为入库的包裹已上架的包裹数量`
  },
  instockNotShelvesCount: {
    title: '已入未上架包裹数量',
    width: 200,
    tips: `时间类型（批次到达时间)：批次到达的包裹中已入库未上架的一段包裹数量
时间类型（签收时间）：签收的包裹中已入库未上架的包裹数量
时间类型（入库时间）：入库的包裹中已入库未上架的包裹数量
时间类型（KPI考核时间）且考核节点（批次到达）：KPI考核时间在选择时间内批次到达的包裹中已入库未上架的一段包裹数量
时间类型（KPI考核时间）且考核节点（签收）：KPI考核时间在选择时间内签收的包裹中已签收未上架的包裹数量
时间类型（KPI考核节点）且考核节点（入库）：KPI考核时间在选择时间内已入库的包裹中已入库未上架的包裹数量`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：批次到达的包裹中已入库未上架的一段包裹数量
// 时间类型+KPI考核节点=签收时间+-：签收的包裹中已入库未上架的包裹数量
// 时间类型+KPI考核节点=入库时间+-：入库的包裹中已入库未上架的包裹数量
// 时间类型+KPI考核节点=KPI考核时间+批次到达：KPI考核时间在选择时间内且+KPI考核节点为批次到达的包裹中已入库未上架的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：KPI考核时间在选择时间内且+KPI考核节点为签收的包裹中已入库未上架的包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：KPI考核时间在选择时间内且+KPI考核节点为入库的包裹中已入库未上架的包裹数量`
  },
  shouldShelvesCount: {
    title: '应上架包裹数量',
    // cell: (val, index, record) => record.instockNotShelvesCount,
    tips: `时间类型（批次到达时间)：批次到达一段包裹数量
时间类型（签收时间）：签收的一段包裹数量
时间类型（入库时间）：入库的一段包裹数量
时间类型（KPI考核时间）且考核节点（批次到达）：KPI考核时间在选择时间内批次到达一段包裹数量
时间类型（KPI考核时间）且考核节点（签收）：KPI考核时间在选择时间内签收的一段包裹数量
时间类型（KPI考核节点）且考核节点（入库）：KPI考核时间在选择时间内入库的一段包裹数量`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：批次到达一段包裹数量
// 时间类型+KPI考核节点=签收时间+-：签收的一段包裹数量
// 时间类型+KPI考核节点=入库时间+-：入库的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+批次到达：KPI考核时间在选择时间内且+KPI考核节点为批次到达一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：KPI考核时间在选择时间内且+KPI考核节点为签收的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：KPI考核时间在选择时间内且+KPI考核节点为入库的一段包裹数量`
  },
  timelyShelvesCount: {
    title: '准时上架包裹数量',
    tips: `应上架包裹数量中，上架时间<=KPI考核时间的一段包裹数量`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：应上架包裹数量中，上架时间<=KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=签收时间+-：应上架包裹数量中，上架时间<=KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=入库时间+-：应上架包裹数量中，上架时间<=KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+批次到达：应上架包裹数量中，上架时间<=KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：应上架包裹数量中，上架时间<=KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：应上架包裹数量中，上架时间<=KPI考核时间的一段包裹数量`
  },
  delayShelvesCount: {
    // title: '延迟上架包裹数量',
    title: '超时上架包裹数量',
    tips: `应上架包裹数量中，(【上架时间>KPI考核时间的一段包裹数量】+【系统查询时间>KPI考核时间未上架的一段包裹数量】）的一段包裹数量`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：应上架包裹数量中，(【上架时间>KPI考核时间的一段包裹数量】+【系统查询时间>KPI考核时间未上架的一段包裹数量】）的一段包裹数量
// 时间类型+KPI考核节点=签收时间+-：应上架包裹数量中，(【上架时间>KPI考核时间的一段包裹数量】+【系统查询时间>KPI考核时间未上架的一段包裹数量】）的一段包裹数量
// 时间类型+KPI考核节点=入库时间+-：应上架包裹数量中，(【上架时间>KPI考核时间的一段包裹数量】+【系统查询时间>KPI考核时间未上架的一段包裹数量】）的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+批次到达：应上架包裹数量中，(【上架时间>KPI考核时间的一段包裹数量】+【系统查询时间>KPI考核时间未上架的一段包裹数量】）的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：应上架包裹数量中，(【上架时间>KPI考核时间的一段包裹数量】+【系统查询时间>KPI考核时间未上架的一段包裹数量】）的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：应上架包裹数量中，(【上架时间>KPI考核时间的一段包裹数量】+【系统查询时间>KPI考核时间未上架的一段包裹数量】）的一段包裹数量`
  },
  rejectCount: {
    title: '准时拒收包裹数量',
    tips: `时间类型（批次到达时间)：批次到达的包裹中，拒收时间<=KPI考核时间的一段包裹数量
时间类型（签收时间）：签收的包裹中，拒收时间<=KPI考核时间的一段包裹数量
时间类型（KPI考核时间）且考核节点（批次到达）：批次到达的包裹中，拒收时间<=KPI考核时间的一段包裹数量
时间类型（KPI考核时间）且考核节点（签收）：签收的包裹中，拒收时间<=KPI考核时间的一段包裹数量
其余场景为空`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：批次到达的包裹中，拒收时间<=KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=签收时间+-：签收的包裹中，拒收时间<=KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=入库时间+-：-
// 时间类型+KPI考核节点=KPI考核时间+批次到达：批次到达的包裹中，拒收时间<=KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：签收的包裹中，拒收时间<=KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：-`
  },
  delayRejectCount: {
    // title: '延迟拒收包裹数量',
    title: '超时拒收包裹数量',
    tips: `时间类型（批次到达时间)：批次到达的包裹中，拒收时间>KPI考核时间的一段包裹数量
时间类型（签收时间）：签收的包裹中，拒收时间>KPI考核时间的一段包裹数量
时间类型（KPI考核时间）且考核节点（批次到达）：批次到达的包裹中，拒收时间>KPI考核时间的一段包裹数量
时间类型（KPI考核时间）且考核节点（签收）：签收的包裹中，拒收时间>KPI考核时间的一段包裹数量
其余场景为空`
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：批次到达的包裹中，拒收时间>KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=签收时间+-：签收的包裹中，拒收时间>KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=入库时间+-：-
// 时间类型+KPI考核节点=KPI考核时间+批次到达：批次到达的包裹中，拒收时间>KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：签收的包裹中，拒收时间>KPI考核时间的一段包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：-`
  },
  promptness: {
    title: '上架及时率',
    tips: `（准时上架包裹数量+准时拒收的包裹数量)/应上架包裹数量`,
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：（准时上架包裹数量+准时拒收的包裹数量)/应上架包裹数量
// 时间类型+KPI考核节点=签收时间+-：（准时上架包裹数量+准时拒收的包裹数量)/应上架包裹数量
// 时间类型+KPI考核节点=入库时间+-：（准时上架包裹数量+准时拒收的包裹数量)/应上架包裹数量
// 时间类型+KPI考核节点=KPI考核时间+批次到达：（准时上架包裹数量+准时拒收的包裹数量)/应上架包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：（准时上架包裹数量+准时拒收的包裹数量)/应上架包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：（准时上架包裹数量+准时拒收的包裹数量)/应上架包裹数量`,
    cell: (val, index,record) => {
      if (!record.timelyShelvesCount || !record.shouldShelvesCount) return '0.00%'
      let promptness = (((record.timelyShelvesCount + record.rejectCount) / record.shouldShelvesCount) * 100).toFixed(2);
      return <span>{promptness + "%"}</span>;
    }
  },
  completeness: {
    title: '上架完成率',
    tips: `（已上架包裹数量+已拒收包裹数量）/应上架包裹数量`,
//     tips: `时间类型+KPI考核节点=批次到达时间(到仓时间)+-：（已上架包裹数量+已拒收包裹数量）/应上架包裹数量
// 时间类型+KPI考核节点=签收时间+-：（已上架包裹数量+已拒收包裹数量）/应上架包裹数量
// 时间类型+KPI考核节点=入库时间+-：（已上架包裹数量+已拒收包裹数量）/应上架包裹数量
// 时间类型+KPI考核节点=KPI考核时间+批次到达：（已上架包裹数量+已拒收包裹数量）/应上架包裹数量
// 时间类型+KPI考核节点=KPI考核时间+签收：（已上架包裹数量+已拒收包裹数量）/应上架包裹数量
// 时间类型+KPI考核节点=KPI考核时间+入库：（已上架包裹数量+已拒收包裹数量）/应上架包裹数量`,
    cell: (val,index,record) => {
      if (!record.shelvesCount || !record.shouldShelvesCount) return '0.00%'
      let completeness = (((record.shelvesCount + record.rejectCount + record.delayRejectCount) / record.shouldShelvesCount) * 100).toFixed(2);
      return <span>{completeness + "%"}</span>;
    }
  },
}

