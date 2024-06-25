import React from 'react'
import { Input, Select, Button, Radio, DatePicker } from '@/component'
import ASelect from '@/component/ASelect'
import { getJobNode, getJobTeamGroup } from '../api'
import {getWid} from 'assets/js'
import moment from 'moment'
const formItem = {
  labelCol: null,
  wrapperCol: null
}
export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      // span: 5,
      component: ASelect,
      defaultValue: getWid(),
      formItem,
      attrs: {
        // mode: 'multiple'
      }
    },
    jobDate: {
      label: '日期',
      // span: 5,
      component: DatePicker,
      formItem,
      defaultValue: moment()
    }
  }
]

export const tColumns = {
  warehouseName: {
    title: '集运仓',
    width: 200,
    lock: 'left',
  },
  jobDate: {
    title: '日期',
    width: 150,
  },
  jobTime: {
    title: '时间',
    width: 150,
  },
  // 入库报表字段
  historyPackageNum: {
    title: <span>历史合单包裹数（T-7)</span>,
    width: 120
  },
  historyOrderRate: {
    title: <span>历史合单小时分布占比数据(T-7)</span>,
    width: 120,
  },
  yesterdayPackageNum: {
    title: <span>昨日实际合单量</span>,
    width: 120,
  },
  forecastPackageNum: {
    title: <span>今日预测合单量</span>,
    width: 120,
  },
  // 出库报表字段
  packageNum: {
    title: <span>今日实际合单量</span>,
    width: 120
  },
  kpiPackageNum: {
    title: <span>KPI合单量</span>,
    width: 120,
  }
}
