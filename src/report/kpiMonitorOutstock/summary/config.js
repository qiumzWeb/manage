import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid, NumToPercentage} from 'assets/js'
import { getDistrictGroup, packageTypeOptions } from '@/report/apiOptions'
import { defaultSearchDate, getDayjsTime } from '@/report/utils'
import { 
  kpiEndOperationOptions,
  searchRangeOption,
  pickingModelOptions
} from '@/report/options'
import dayjs from 'dayjs'

/**
 * 普通KPI 查询
 */
// 查询接口 - 汇总
export const searchApi = '/kpi/monitor/outstock/ae/manage/list'
// 计算汇总接口
export const searchSumApi = '/kpi/monitor/outstock/ae/manage/listSum'

// 查询接口- 小时
export const searchHourApi = '/kpi/monitor/outstock/ae/manage/hours/list'



/**
 * 闪电播 KPI
 */
// 闪电播查询 - 汇总
export const FlowPickSearchApi = 'kpi/monitor/flowPick/list'
// 闪电播 计算汇总
export const FlowPickSearchSumApi = 'kpi/monitor/flowPick/summary'


// 闪电播跳转详情
export const goDetailOfFlowPicker = {
  // 闪电播跳转
  waitOffShelvesMissionsCount: 'waitOffshelvesWave', // title: '待下架\n任务数量',

  shouldSortingBigbagCount: 'shouldSortingBigbag',   // title: '播种\n大包数量',

  arriveBigbagCount: 'arriveBigbag',  ///    title: '播种已到达\n大包数量',

  unArriveBigbagCount: 'unArriveBigbag',   /// title: '播种未到达\n大包数量',

  shouldInstockBigbagCount: 'shouldInstockBigbag',  ///   title: '应集包入区\n大包数量',

  shouldInstockPackageCount: 'shouldInstockBigbag',  //// title: '应集包入区\n包裹数量',

  instockBigbagCount: 'instockBigbag',   ////  title: '已集包入区\n大包数量',

  instockPackageCount: 'instockBigbag',    ///// title: '已集包入区\n包裹数量',

  unInstockBigbagCount: 'unInstockBigbag',   ////  title: '未集包入区\n大包数量',

  unInstockPackageCount: 'unInstockBigbag', ////   title: '未集包入区\n包裹数量',

  flowPickUnSortingBigbagCount: 'flowPickUnSortingBigbag',  //// title: '闪电播未播种\n大包数量',

  flowPickUnSortingPackageCount: 'flowPickUnSortingBigbag',  /// title: '闪电播未播种\n包裹数量',
}

// 详情跳转字段
export const goDetailsKeys = {
  'waitOffShelvesCount': 'waitOffShelves', // 待下架订单数量
  'waitSortingWallCount': 'waitSortingWall', // 待播种订单数量
  'waitMergeCount': 'waitMerge', // 待合箱订单数量
  'waitBaggingCount': 'waitBagging', //待装袋订单数量
  'waitWarehouseOutCount': 'waitWarehouseOut', // 待发运订单数量
  'warehouseOutCount': 'warehouseOut', //发运完成订单数量
  'handoverCompletedCount': 'handoverCompleted', //交接完成订单数量
  'delayOutOrderCount': 'delayOutOrder', //延迟出库订单数量
  ...goDetailOfFlowPicker
}


// 时间类型
export const timeTypeOption = [
  {label: '订单生成时间', value: '0'},
  {label: 'KPI考核时间', value: '1'},
  {label: '预计出库时间', value: '2'},
]

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
      defaultValue: '1',
      attrs: {
        hasClear: false,
        getOptions: async() => {
          return timeTypeOption
        }
      }
    },
    makeTime: {
      label: '统计时间',
      fixedSpan: 22,
      defaultValue: defaultSearchDate,
      show: data => data.operatingTimeType == '1',
      component: DatePicker2.RangePicker,
      attrs: {
        hasClear: false,
        format: 'YYYY-MM-DD',
      }
    },
    makeTime1: {
      label: '统计时间',
      fixedSpan: 22,
      show: data => data.operatingTimeType != '1',
      defaultValue: [getDayjsTime({format: "YYYY-MM-DD 00:00:00"}), getDayjsTime({format: 'YYYY-MM-DD 18:00:00'})],
      component: DatePicker2.RangePicker,
      attrs: {
        hasClear: false,
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        addPreSet: {
          "T(0:00 - 18:00)": [getDayjsTime({format: "YYYY-MM-DD 00:00:00"}), getDayjsTime({format: 'YYYY-MM-DD 18:00:00'})],
          "T-1(18:00 - 24:00)": [getDayjsTime({format: "YYYY-MM-DD 18:00:00", add: -1}), getDayjsTime({format: 'YYYY-MM-DD 00:00:00'})],
          "T(7:00 - 19:00)": [getDayjsTime({format: "YYYY-MM-DD 07:00:00"}), getDayjsTime({format: 'YYYY-MM-DD 19:00:00'})],
          "T+1(19:00 - 7:00)": [getDayjsTime({format: "YYYY-MM-DD 19:00:00"}), getDayjsTime({format: 'YYYY-MM-DD 07:00:00', add: 1})],
        }
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
    pickingMode: {
      label: '拣货模式',
      component: ASelect,
      needExpandToData: true,
      attrs: {
        getOptions: async() => pickingModelOptions
      }
    }
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
    cell: val => <ASelect value={val} getOptions={async() => searchRangeOption} isDetail></ASelect>,
    // lock: 'left'
  },
  districtGroupName: {
    title: '维度名称',
    cell: (val, index, record) => {
      const item = searchRangeOption.find(f => f.value == record.searchRangeType)
      if (item && item.nameKey) return record[item.nameKey]
      return '-'
    },
    lock: 'left'
  },
  operatingDateRange: {
    title: '统计时间',
    width: 350,
    lock: 'left',
  },
  operatingTimeType: {//
    title: '时间类型',
    cell: val => <ASelect value={val} getOptions={async() => timeTypeOption} isDetail></ASelect>
  },
  examineNode: {
    title: 'KPI考核节点',
    cell: val => <ASelect value={val} getOptions={async() => kpiEndOperationOptions} defaultValue="-" isDetail></ASelect>
  },
  turnoverType: {
    title: '包裹类型',
    cell: val => <ASelect value={val} getOptions={async () => await packageTypeOptions} defaultValue="-" isDetail></ASelect>
  },
  orderCount: {
    title: '订单数量',
    tips: `订单生成时间在选择时间内的二段订单总数`,
    show: isNotFlowPick,
  },
  packageNum: {
    title: '包裹数量',
    tips: '订单生成时间在选择时间内的二段订单关联的一段包裹总数',
    // show: isNotFlowPick,
  },
  mergeRate: {
    title: '合单比',
    tips: '包裹数量/订单数量',
    // show: isNotFlowPick,
  },
  waitOffShelvesCount: {
    title: '待下架\n订单数量',
    tips: '订单生成时间在选择时间内的二段订单中，待下架的二段订单总数',
    // show: isNotFlowPick,
  },
  waitOffShelvesPackageCount: {
    title: '待下架\n包裹数量',
    tips: `订单生成时间在选择时间内的二段订单中，待下架的二段订单关联的一段包裹总数`,
    // show: isNotFlowPick,
  },
  tailAllotWaitOffShelveOrderCount: {
    title: '已集分待下架\n订单数量',
    tips: `订单生成时间在选择时间内已集分待下架的订单数量`,
    // show: isNotFlowPick,
  },
  tailAllotWaitOffShelvePackageCount: {
    title: '已集分待下架\n包裹数量',
    tips: `订单生成时间在选择时间内已集分待下架的包裹数量`,
    // show: isNotFlowPick,
  },
  waitSortingWallCount: {
    title: '待播种\n订单数量',
    tips: `订单生成时间在选择时间内的二段订单中，待播种的二段订单总数`,
    // show: isNotFlowPick,
  },
  waitSortingWallPackageCount: {
    title: '待播种\n包裹数量',
    tips: `订单生成时间在选择时间内的二段订单中，待播种的二段订单关联的一段包裹总数`,
    // show: isNotFlowPick,
  },
  waitMergeCount: {
    title: '待合箱\n订单数量',
    tips: `订单生成时间在选择时间内的二段订单中，待合箱的二段订单总数`,
    // show: isNotFlowPick,
  },
  waitMergePackageCount: {
    title: '待合箱\n包裹数量',
    tips: `订单生成时间在选择时间内的二段订单中，待合箱的二段订单关联的一段包裹总数`,
    // show: isNotFlowPick,
  },
  waitBaggingCount: {
    title: '待装袋\n订单数量',
    tips: `订单生成时间在选择时间内的二段订单中，待装袋的二段订单总数`,
    // show: isNotFlowPick,
  },
  waitBaggingPackageCount: {
    title: '待装袋\n包裹数量',
    tips: `订单生成时间在选择时间内的二段订单中，待装袋的二段订单关联的一段包裹总数`,
    // show: isNotFlowPick,
  },
  waitWarehouseOutCount: {
    title: '待发运\n订单数量',
    tips: `订单生成时间在选择时间内的二段订单中，待发运的二段订单总数`,
    // show: isNotFlowPick,
  },
  waitWarehouseOutPackageNum: {
    title: '待发运\n包裹数量',
    tips: `订单生成时间在选择时间内的二段订单中，待发运的二段订单关联的一段包裹总数`,
    // show: isNotFlowPick,
  },
  warehouseOutCount: {
    title: '发运完成\n订单数量',
    tips: `订单生成时间在选择时间内的二段订单中，发运完成的二段订单总数`,
    // show: isNotFlowPick,
  },
  warehouseOutPackageNum: {
    title: '发运完成\n包裹数量',
    tips: `订单生成时间在选择时间内的二段订单中，发运完成的二段订单关联的一段包裹总数`,
    // show: isNotFlowPick,
  },
  handoverCompletedCount: {
    title: '交接完成\n订单数量',
    tips: `订单生成时间在选择时间内的二段订单中，交接完成的二段订单总数`,
    // show: isNotFlowPick,
  },
  handoverCompletedPackageCount: {
    title: '交接完成\n包裹数量',
    tips: `订单生成时间在选择时间内的二段订单中，交接完成的二段订单关联的一段包裹总数`,
    // show: isNotFlowPick,
  },
  outOrderCount: {
    title: '应出库\n订单数量',
    tips: `订单生成时间在选择时间内的二段订单总数`,
    // show: isNotFlowPick,
  },
  outPackageCount: {
    title: '应出库\n包裹数量',
    tips: `订单生成时间在选择时间内的二段订单关联的一段包裹总数`,
    // show: isNotFlowPick,
  },
  timelyWarehouseOutCount: {
    title: '及时出库\n订单数量',
    tips: `订单生成时间在选择时间内的二段订单中，出库时间<=KPI考核时间的订单总数`,
    // show: isNotFlowPick,
  },
  delayOutOrderCount: {
    title: '延迟出库\n订单数量',
    tips: `订单生成时间在选择时间内的二段订单中，(【出库时间>KPI考核时间的订单数】+【系统查询时间>KPI考核时间未出库的订单数】）的订单总数`,
    // show: isNotFlowPick,
  },
  timelyWarehouseOutRate: {
    title: '出库及时率',
    tips: `及时出库订单数/应出库订单数`,
    // show: isNotFlowPick,
    cell: (val, index, record) => {
      return NumToPercentage((record.timelyWarehouseOutCount || 0) / (record.orderCount || 0));
    }
  },
  outCompleteRate: {
    title: '出库完成率',
    tips: `（【及时出库订单数】+【出库时间>KPI考核时间的订单数】）/应出库订单数`,
    // show: isNotFlowPick,
  },

  
  // ===================闪电播 字段==================
  waitOffShelvesMissionsCount: {
    title: '待下架\n任务数量',
    tips: '当前查询条件下待下架任务数量',
    show: isFlowPick
  },
  offShelvesPickerCount: {
    title: '拣选人数',
    tips: '当前查询条件下波次拣选的人数',
    show: isFlowPick
  },
  sortingWallCode: {
    title: '闪电播墙号',
    tips: '当前查询条件下待下架任务数量',
    show: isFlowPick
  },
  shouldSortingBigbagCount: {
    title: '播种\n大包数量',
    tips: '已到达+未到达的播种打包之和',
    show: isFlowPick
  },
  arriveBigbagCount: {
    title: '播种已到达\n大包数量',
    tips: '已到达大包数量',
    show: isFlowPick
  },
  unArriveBigbagCount: {
    title: '播种未到达\n大包数量',
    tips: '未到达大包数量',
    show: isFlowPick
  },
  shouldInstockBigbagCount: {
    title: '应集包入区\n大包数量',
    show: isFlowPick
  },
  shouldInstockPackageCount: {
    title: '应集包入区\n包裹数量',
    show: isFlowPick
  },
  instockBigbagCount: {
    title: '已集包入区\n大包数量',
    show: isFlowPick
  },
  instockPackageCount: {
    title: '已集包入区\n包裹数量',
    show: isFlowPick
  },
  unInstockBigbagCount: {
    title: '未集包入区\n大包数量',
    show: isFlowPick
  },
  unInstockPackageCount: {
    title: '未集包入区\n包裹数量',
    show: isFlowPick
  },
  flowPickSortingBigbagCount: {
    title: '闪电播已播种\n大包数量',
    show: isFlowPick
  },
  flowPickSortingPackageCount: {
    title: '闪电播已播种\n包裹数量',
    show: isFlowPick
  },
  flowPickUnSortingBigbagCount: {
    title: '闪电播未播种\n大包数量',
    show: isFlowPick
  },
  flowPickUnSortingPackageCount: {
    title: '闪电播未播种\n包裹数量',
    show: isFlowPick
  },
  flowPickHumanSortWallPkgCount: {
    title: '人工播种墙\n已播种包裹数量',
    show: isFlowPick
  },

  // =============闪电播字段 end  =============
}



// 判断是否是闪电播
function isFlowPick(vm) {
  const { pickingMode } = vm.field.getValues();
  return pickingMode == '7'
}

// 判断非闪电播
function isNotFlowPick(vm) {
  return !isFlowPick(vm)
}