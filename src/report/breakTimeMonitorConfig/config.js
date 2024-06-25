import React from 'react'
import ASelect from '@/component/ASelect'
import {getWid, isEmpty} from 'assets/js'
import {
  breakTimeTypeOption,
  breakTimeEnableOptions
} from '@/report/options'
import { packageTypeOptions } from '@/report/apiOptions'

import { getSLAOptions } from './editConfig/computeParams'

// 查询接口
export const searchUrl = '/sys/kpi/segmentConfig/list'

// 新增接口
export const addUrl = '/sys/kpi/segmentConfig/create'

// 修改接口 
export const modifyUrl = '/sys/kpi/segmentConfig/modify'

// 删除接口
export const deleteUrl = '/sys/kpi/segmentConfig/delete/{id}'


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
    kpiType: {
      label: '考核类型',
      component: ASelect,
      attrs: {
        // mode: 'multiple',
        getOptions: async() => {
          return breakTimeTypeOption
        }
      }
    },
    turnoverType: {
      label: '包裹类型',
      component: ASelect,
      attrs: {
        mode: 'multiple',
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
  kpiName: {
    title: '考核方案名称',
  },
  turnoverType: {
    title: '包裹类型',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => packageTypeOptions}></ASelect>
  },
  kpiType: {
    title:'考核类型',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => breakTimeTypeOption}></ASelect>
  },
  startNode: {
    title: '时长考核起算节点',
    listKey: 'segmentConfig.configNodeList',
    cell: (val, index, record) =>  <ASelect isDetail value={val} getOptions={async() => {
        const data =  await getSLAOptions
        return record.kpiType == '1' ? data.inStockNodeStart : data.outStockNodeStart
    }}></ASelect>,
  },
  endNode: {
    title: '时长考核止算节点',
    listKey: 'segmentConfig.configNodeList',
    cell: (val, index, record) =>  <ASelect isDetail value={val} getOptions={async() => {
      const data =  await getSLAOptions
      return record.kpiType == '1' ? data.inStockNodeStop : data.outStockNodeStop
  }}></ASelect>,
  },
  ruleTimeLen: {
    title: '考核时长',
    listKey: 'segmentConfig.configNodeList',
    cell: (val, index, record, item) => {
      return <div>
        {val}
        <ASelect isDetail value={item.ruleUnit} getOptions={async() => {
          const data =  await getSLAOptions
          return data.timeUnit
        }}></ASelect>
      </div>
    },
  },
  kpiStartEffectiveDate: {
    title: '考核方案开始时间',
  },
  kpiEndEffectiveDate: {
    title: '考核方案结束时间',
  },
  isEnable: {
    title: '是否启用',
    cell: (val) => <ASelect isDetail value={val} getOptions={async() => breakTimeEnableOptions}></ASelect>
  },
  make: {
    title: '操作',
    lock: 'right'
  }
}
