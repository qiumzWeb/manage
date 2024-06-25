import React from 'react'
import ASelect from '@/component/ASelect'
import AliDateRangePicker from '@/component/AliDateRangePicker/index'
import {getWid, _getName, isTrue} from 'assets/js'
import dayjs from 'dayjs'
import { getAliWeekRange, getAliWeekFromWeek, getRingRatioDisplay } from '@/report/utils'


// 表格查询
export const tabelSearchUrl = '/job/ae/manage/abnormalPackage/total/list'

// 图表查询
export const chartSearchUrl = '/job/ae/manage/abnormalPackage/line/chart/list'

// 时间默认值
export const defaultDate = {
  date: [dayjs().subtract(6, 'day'), dayjs()],
  week: [getAliWeekRange(dayjs().subtract(3, 'week'))[0], getAliWeekRange(dayjs())[0]],
  month: [dayjs().subtract(3, 'month'), dayjs()]
}

export const dataRangOptions = [
  {label: '日', value: '1', type: 'date'},
  {label: '阿里周', value: '2', type: 'week'},
  {label: '月', value: '3', type: 'month'}
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
    showRangeType: {
      label: '展示维度',
      component: ASelect,
      defaultValue: '1',
      attrs: {
        hasClear: false,
        getOptions: async() => {
          return dataRangOptions
        },
        onChange: (val, vm, action) => {
          const type =  _getName(dataRangOptions.map(d => ({...d, label: d.type})), val, 'date')  
          vm.field.setValue('markingTime', defaultDate[type])
        }
      }
    },
    markingTime: {
      label: '日期区间',
      fixedSpan: 22,
      defaultValue: defaultDate['date'],
      component: React.forwardRef(function DateRang(props, ref){
        const {field} = props
        const d = field.getValue('showRangeType')
        const date = dataRangOptions.find(f => f.value == d)
        const mode = date && date['type']
        return <AliDateRangePicker ref={ref} {...props} mode={mode}></AliDateRangePicker>
      }),
    },
  }
]
// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left',
  },
  makingTime: {
    title: '日期',
    width: 185,
    cell: (val, index, record) => {
      if (record.showRangeType == '2') {
        const aliWeek = getAliWeekFromWeek(val)
        return aliWeek.map(a => a.format('YYYY-MM-DD HH:mm:ss')).join('至')
      }
      return val
    }
  },
  showRangeType: {
    title: '展示维度',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => dataRangOptions}></ASelect>
  },
  packageTypeName: {
    title: '异常包裹类型',
  },
  markNodeTypeName: {
    title: '异常标记节点',
  },
  confirmTypeName: {
    title: '异常确认类型',
  },
  scanPackageNum: {
    title: '扫描包裹数',
  },
  totalNum: {
    title: '包裹总数'
  },
  abnormalRate: {
    title: '异常占比（%）',
  },
  abnormalMonthOnMonthRatio: {
    title: '异常环比增长率（%）',
    width: 180,
    cell: (val, index, record) => {
      const ringRatio = getRingRatioDisplay(val)
      return val > 0 ? ringRatio.up() :
        val < 0 ? ringRatio.down() :
        (isTrue(val) ? ringRatio : '-')
    }
  }
}
export const lineConfig = {
  signMark: '签收-已标记',
  instockMark: '入库-已标记',
  onShelveMark: '上架-已标记',
  offShelveMark: '下架-已标记',
  sortingMark: '播种-已标记',
  mergeMark: '合箱-已标记',
  // assemblingMark: '组包-已标记',

  signConfirm: '签收-已确认',
  instockConfirm: '入库-已确认',
  onShelveConfirm: '上架-已确认',
  offShelveConfirm: '下架-已确认',
  sortingConfirm: '播种-已确认',
  mergeConfirm: '合箱-已确认',
  // assemblingConfirm: '组包-已确认',

}
// 获取基础结构数据
export function getBaseData(data = {}) {
  const c = Object.assign({makingTime: ''}, data)
  Object.keys(lineConfig).forEach(k => {
    c[k] = 0
  })
  return c
}
  // 获取 看板 配置
export function getLineOptions(data){
  const chartOptions = {
    xAxis: [],
    series: []
  }
  data.forEach((d, index) => {
    // 获取 X 轴数据
    chartOptions.xAxis.push(d.makingTime);
    // 生成曲线数据
    Object.entries(lineConfig).forEach(([key,name], cIndex) => {
      if (!chartOptions.series[cIndex]) {
        chartOptions.series[cIndex] = {name, data: []};
      }
      chartOptions.series[cIndex].data[index] = {
        value: d[key] || 0,
      };
    })
  })
  return chartOptions;
}

// 看板 日  周  月 时间格式配置 （1： 日， 2： 周， 3： 月）
export const timeOpts = {
    1: {
      add: t => dayjs(t).add(1, 'day'),
      value: t => dayjs(t).format('MM-DD'),
      fmt: t => dayjs(t).format('MM-DD')
    },
    2: {
      add: t => dayjs(t).add(7, 'day'),
      value: t => getAliWeekRange(t).map(t => t.format('MM-DD')).join(' ~ '),
      fmt: t => getAliWeekFromWeek(t).map(t => t.format('MM-DD')).join(' ~ ')
    },
    3: {
      add: t => dayjs(t).add(1, 'month'),
      value: t => dayjs(t).format('YYYY-MM'),
      fmt: t => dayjs(t).format('YYYY-MM')
    },
  }