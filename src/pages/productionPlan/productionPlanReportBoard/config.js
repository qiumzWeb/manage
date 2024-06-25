
import React from 'react';
import { DatePicker2, ASelect, Message  } from '@/component';
import { isEmpty, getWid } from 'assets/js';
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';


// 展示维度
export const timeTypeOptions = [
  {label: '天', value: '1'},
  {label: '小时', value: '2'}
]

// 预测数据来源
export const dataSourceOptions = [
  {label: '导入', value: '0'},
  {label: '履行下发', value: '1'},
  {label: '内部计算', value: '2'}
]

export const searchModel = {
  timeType: {
    label: '展示维度',
    component: ASelect,
    defaultValue: '1',
    attrs: {
      isRadio: true,
      getOptions: async() => timeTypeOptions
    }
  },
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    defaultValue: getWid(),
    attrs: {
      hasClear: false
    }
  },
  // 天
  startDateTime: {
    label: '日期',
    show: (data) => {
      return data.timeType == 1
    },
    fixedSpan: 16,
    defaultValue: [
      dayjs().subtract(1, 'month').startOf('day'),
      dayjs().endOf('day')
    ],
    component: DatePicker2.RangePicker,
    useDetailValue: true,
    transTimeCode: ['startDateTime', 'endDateTime'],
    format: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
    attrs: {
      hasClear: false,
      format: 'YYYY-MM-DD',
    }
  },
  // 小时
  endDateTime: {
    label: '日期',
    defaultValue: dayjs(),
    component: DatePicker2,
    useDetailValue: true,
    show: (data) => {
      return data.timeType == 2
    },
    format: (val) => {
      if (dayjs(val).isValid()) {
        return {
          startDateTime: dayjs(val).format("YYYY-MM-DD 00:00:00"),
          endDateTime: dayjs(val).format("YYYY-MM-DD 23:59:59")
        }
      } else {
        return {
          startDateTime: "",
          endDateTime: ''
        }
      }
    },
    attrs: {
      hasClear: false,
      format: 'YYYY-MM-DD',
    }
  },
  dataSource: {
    label: '预测数据来源',
    component: ASelect,
    defaultValue: '2',
    attrs: {
      hasClear: false,
      getOptions: async() => dataSourceOptions
    }
  },
  searchBtn: {
    label: '  ',
    fixedSpan: 12,
    // 不参与查询
    onlyShow: true,
    // 自定义查询不显示
    outsider: true
  },
}

// 筛选条件
export const preChildren = [
  {label: '批次到达预测量', value: 'preBatchArrive', active: false, key: '0'},
  {label: '通知出库预测量', value: 'preNoticeOutstock', active: false, key: '1'},
  {label: '批次发运(订单)预测量', value: 'preBatchDelivery', active: false, key: '2'},
]

export const planChildren = [
  // {label: '批次到达计划量', value: 'planBatchArrive', active: true},
  {label: '签收计划量', value: 'planSign', active: false},
  {label: '入库计划量', value: 'planInstock', active: true},
  {label: '上架计划量', value: 'planOnshelves', active: false},
  {label: '通知出库计划量', value: 'planNoticeOutstock', active: true},
  {label: '下架计划量', value: 'planOffshelve', active: true},
  {label: '播种计划量', value: 'planSorting', active: false},
  {label: '合箱(包裹量)计划量', value: 'planMerge', active: true},
  {label: '组包（订单量）计划量', value: 'planAssembling', active: false},
  {label: '批次发运(订单量)计划量', value: 'planBatchDelivery', active: false},
]

export const aclChildren = [
  {label: '批次到达实际量', value: 'aclBatchArrive', active: false},
  {label: '签收实际量', value: 'aclSign', active: false},
  {label: '入库实际量', value: 'aclInstock', active: true},
  {label: '上架实际量', value: 'aclOnshelves', active: false},
  {label: '通知出库实际量', value: 'aclNoticeOutstock', active: true},
  {label: '下架实际量', value: 'aclOffshelve', active: true},
  {label: '播种实际量', value: 'aclSorting', active: false},
  {label: '合箱(包裹量)实际量', value: 'aclMerge', active: true},
  {label: '组包（订单量）实际量', value: 'aclAssembling', active: false},
  {label: '批次发运(订单量)实际量', value: 'aclBatchDelivery', active: false},
]

export const filterTypeOptions = {
  pre: {
    title: '预测量',
    children: preChildren
  },
  plan: {
    title: '计划量',
    children: planChildren
  },
  acl: {
    title: '实际量',
    children: aclChildren
  },
}

// 获取数据
export async function getSearchData(data) {
  const getData = (dataType) => $http({
    url: '/pcs/production/plan/dashboard/list',
    method: 'post',
    data: {
      ...data,
      dataType
    }
  }).catch(e => {
    Message.error(e.message)
    return []
  })
  const [r1, r2, r3] = await Promise.all([getData('pre'), getData('plan'), getData('acl')])
  const getArr = (filter, arr) => {
    if (isEmpty(arr)) return []
    const keys = filter.map(f => f.value)
    return arr.map(a => {
      const n = {
        time: data.timeType == 1 ? dayjs(a.jobDate).format('YYYY-MM-DD') : a.jobTime,
        timeType: data.timeType
      }
      keys.forEach(k => {
        n[k] = a[k]
      })
      return n
    })
  }

  const list = [
    ...getArr(preChildren, r1),
    ...getArr(planChildren, r2),
    ...getArr(aclChildren, r3)
  ]
  // 合并相同时间数据
  const newList = {}
  list.forEach(l => {
    if (newList[l.time]) {
      Object.assign(newList[l.time], l)
    } else {
      newList[l.time] = l
    }
  })
  return Object.values(newList)
}

// 导出时间配置
export const exportFormConfig = {
  exportDate: {
    label: '导出时间范围最大不能超过7天',
    span: 24,
    required: true,
    defaultValue: [
      dayjs().subtract(1, 'day').startOf('day'),
      dayjs().endOf('day')
    ],
    component: DatePicker2.RangePicker,
    useDetailValue: true,
    transTimeCode: ['startDateTime', 'endDateTime'],
    format: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
    attrs: {
      hasClear: false,
      format: 'YYYY-MM-DD',
    }
  }
}