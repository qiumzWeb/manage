import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { defaultCurrentTime } from '@/report/utils'

// 查询接口
export const searchUrl = '/jobWaveTask/list'

// 开始作业完成作业接口
export const UpdataeTaskStatusUrl = '/jobWaveTask/update'

// 任务实操状态,-1:待生成；0:已生成；1：进行中；2：已完成
export const taskStatusOptions = [
  {label: '待生成', value: '-1'},
  {label: '已生成', value: '0'},
  {label: '进行中', value: '1'},
  {label: '已完成', value: '2'},
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
    taskStatus: {
      label: '任务状态',
      component: ASelect,
      attrs: {
        getOptions: async() => taskStatusOptions
      }
    },
    gmtCreate: {
      label: '创建时间',
      fixedSpan: 22,
      defaultValue: defaultCurrentTime,
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        timePanelProps: {
          format: 'HH:mm:ss'
        },
        showTime: true,
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
  taskCode: {
    title: '任务标识',
  },
  taskStatus: {
    title: '任务状态',
    width: 100,
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => taskStatusOptions} defaultValue="-"></ASelect>
  },
  operateUserName: {
    title: '操作人',
  },
  gmtCreate: {
    title:'创建时间',
    width: 200,
  },
  gmtModified: {
    title: '更新时间',
    width: 200,
  },
  make: {
    title: '操作',
    width: 200,
    lock: 'right'
  }
}
