import React from 'react'
import { Input, Select, Button, Radio, DatePicker } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { getSortCodeOptions } from '../api'

// 容器类型
const typeOptions = [
  {label: '上架框', value: 1},
  {label: '下架框', value: 0},
  {label: '闪电播尾包容器', value: 2},
  {label: '分流向容器', value: 3},
  {label: '尾包集分容器', value: 4}
]

// 容器状态
const statusOptions = [
  {label: '空闲', value: 1},
  {label: '占用', value: 2},
  {label: '禁用', value: 3},
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '集运仓',
    width: 200,
    // lock: 'left',
  },
  containerGroup: {
    title: '容器组',
    width: 150
  },
  code: {
    title: '容器编码',
    width: 150,
  },
  type: {
    title: '容器类型',
    width: 150,
    cell: (val) => {
      return <ASelect isdetail value={val} getOptions={async() => typeOptions}></ASelect>
    }
  },
  sortCode: {
    title: '流向'
  },
  status: {
    title: '容器状态',
    width: 150,
    cell: (val) => {
      return <ASelect isdetail value={val} getOptions={async() => statusOptions}></ASelect>
    }
  },
  userName: {
    title: '当前使用人',
    width: 150
  },
  counts: {
    title: '单据清单',
    width: 120,
    lock: 'right'
  },
}

// 清单 列表
export const listColumns = {
  orderType: {
    title: '单据类型',
    width: 150,
  },
  orderCode: {
    title: '单据号',
    width: 200
  }
}

// 新增

export const addConfig = {
  warehouseName: {
    label: '仓库名称',
    span: 12,
    disabled: true,
  },
  type: {
    label: '容器类型',
    span: 12,
    required: true,
    component: ASelect,
    attrs: {
      placeholder: "请选择",
      getOptions: async() => {
        return typeOptions
      }
    }
  },
  sortCode: {
    label: '流向',
    span: 12,
    required: data => data.type == 3,
    component: ASelect,
    attrs: {
      getOptions: async() => await getSortCodeOptions
    }
  },
  containerGroup: {
    label: '容器组',
    span: 12,
    required: (data) => data.type == 2,
    component: Input
  },
  code: {
    label: '容器编码',
    span: 24,
    required: true,
    component: Input.TextArea,
    attrs: {
      autoHeight: {
        minRows: 4,
        maxRows: 10
      },
      placeholder: '支持多个编码批量新增，多个编码请使用回车换行进行分隔'
    }
  },
}