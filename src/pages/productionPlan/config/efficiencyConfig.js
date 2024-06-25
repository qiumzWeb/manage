import React from 'react'
import { Input, Select, Button, Radio, DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import { getJobNode } from '../api'
import {getWid} from 'assets/js'
import { defaultSearchDate } from '@/report/utils'
const formItem = {
  labelCol: null,
  wrapperCol: null
}
export const getJobNodeOptions = async () => {
  try {
    const options = await getJobNode()
    return (options || []).map(o => ({
      ...o,
      label: o.jobNode,
      value: o.jobNodeCode
    }))
  } catch (e) {
    return []
  }
}
export const qSearch = [
  {
    type: {
      label: '展示维度',
      formItem,
      span: 12,
      defaultValue: 0,
      component: Radio.Group,
      attrs: {
        dataSource: [
          {label: '自动-作业环节', value: 0},
          {label: '手动-作业环节   ', value: 1}
        ],
        onChange: (val, vm) => {
          // if (vm.searchParams) {
          //   vm.refresh()
          // } else {
            vm.setState({
              tableData: []
            })
          // }
        }
      }
    },
  },
  {
    warehouseId: {
      label: '仓库名称',
      component: ASelect,
      defaultValue: getWid(),
      formItem
    },
    jobDateRang: {
      label: '日期区间',
      fixedSpan: 24,
      formItem,
      component: DatePicker2.RangePicker,
      defaultValue: defaultSearchDate,
      show: data => data.type === 0
    },
    jobDate: {
      label: '日期',
      formItem,
      component: DatePicker2,
      show: data => data.type === 1,
    },
    jobTime: {
      label: '时间',
      // span: 5,
      formItem,
      show: (data) => {
        return data.type === 1
      },
      component: Input,
      attrs: {
        placeholder: "如： 1-5 或  2-3,5-7,9-12"
      }
    },
    jobNodeCodeList: {
      label: '作业环节',
      // span: 5,
      formItem,
      component: ASelect,
      attrs: {
        mode: 'multiple',
        getOptions: getJobNodeOptions
      }
    },
  }
]

export const tColumns = {
  warehouseName: {
    title: '集运仓',
    width: 200,
    lock: 'left',
  },
  jobData: {
    title: '日期',
    width: 150,
  },
  jobTime: {
    title: '小时',
    width: 150,
    show: isZuoYeFZ
  },
  jobNode: {
    title: '作业环节',
    width: 150,
  },
  // AE报表
  bigPkgSignCount: {
    title: <span>过去n天<br/>作业单量</span>,
    width: 120,
    show: isZuoYeHj,
    cell: (val, index, record) => {
      return record.packageNum
    }
  },
  pkgSignCount: {
    title: <span>过去n天<br/>作业工时</span>,
    width: 120,
    show: isZuoYeHj,
    cell: (val, index, record) => {
      return record.workingHours
    }
  },
  // 天猫报表
  packageNum: {
    title: <span>过去1天<br/>作业单量</span>,
    width: 120,
    show: isZuoYeFZ
  },
  workingHours: {
    title: <span>过去1天<br/>作业工时</span>,
    width: 120,
    show: isZuoYeFZ
  },
  nvalue: {
    title: 'n值',
    width: 120,
    show: isZuoYeHj
  },
  effectValue: {
    title: "环节人效值",
    width: 120,
  },
  employeeCount: {
    title: '实际人力',
    width: 120,
    show: isZuoYeFZ
  },
  planHandle: {
    title: '计划处理',
    width: 120,
    show: isZuoYeFZ
  },
  actualHandle: {
    title: '实际处理',
    width: 120,
    show: isZuoYeFZ
  },
  superDropProduct: {
    title: '超落产',
    width: 120,
    show: isZuoYeFZ
  },
  actualEffect: {
    title: '实际效率',
    width: 120,
    show: isZuoYeFZ
  },
  make: {
    title: '操作',
    // lock: 'right',
    width: 150,
    show: false
  }
}


function isZuoYeHj (that) {
  return that.field && that.field.getValue('type') === 0
}
function isZuoYeFZ (that) {
  return !isZuoYeHj(that)
}
function isDateTime (that) {
  return that.field && that.field.getValue('type') === 1
}