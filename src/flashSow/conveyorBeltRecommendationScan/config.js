import React from 'react';
import { AFormTable, ASelect, Input, TimePicker2 } from '@/component';
import {getWid} from 'assets/js';
import $http from 'assets/js/ajax';
import { getDevice } from '@/flashSow/flashSowPackageConfig/config'
// 查询接口
export const searchApiUrl = '/sys/sortingConfig/pageReBatchRecDeviceData'

// 新增
export function addConfig(data) {
  return $http({
    url: '/sys/sortingConfig/newReBatchDeviceRecConfig',
    method: 'post',
    data
  })
}
// 修改
export function updateConfig(data) {
  return $http({
    url: '/sys/sortingConfig/updReBatchDeviceRecConfig',
    method: 'post',
    data
  })
}

// 删除
export function deleteConfig(data) {
  return $http({
    url: `/sys/sortingConfig/delConfig/${data.id}`,
    method: 'delete'
  })
}


// 查询
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
    deviceCode: {
      label: '闪电播设备',
      component: ASelect,
      attrs: {
        // mode: 'multiple',
        showSearch: true,
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const warehouseId = field.getValue('warehouseId')
          return getDevice(warehouseId)
        }
      }
    },
  }
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
  },
  deviceCode: {
    title: '闪电播设备',
  },
  startTime: {
    title: '开始时间',
    listKey: 'recommendTime'
  },
  endTime: {
    title: '结束时间',
    listKey: 'recommendTime'
  },
  updaterName: {
    title: '操作人',
  },
  gmtModified: {
    title: '操作时间',
  }
}

// 新增
export const formModeConfig = {
  warehouseId: {
    label: '仓库名称',
    defaultValue: getWid(),
    component: ASelect,
    required: true,
    attrs: {
      hasClear: false
    }
  },
  deviceCode: {
    label: '闪电播设备',
    component: ASelect,
    required: true,
    attrs: {
      // mode: 'multiple',
      showSearch: true,
      watchKey: 'warehouseId',
      getOptions: async({field}) => {
        const warehouseId = field.getValue('warehouseId')
        return getDevice(warehouseId)
      }
    }
  },
  recommendTime: {
    label: '',
    component: AFormTable,
    span: 24,
    attrs: {
      hasAdd: true,
      maxLength: 100,
      columns: {
        timeScope: {
          title: '时间范围',
          required: true,
          edit: true,
          component: TimePicker2.RangePicker,
          useDetailValue: true,
          transTimeCode: ['startTime', 'endTime'],
          format: ['HH:mm:ss', 'HH:mm:ss'],
          attrs: {
      
          }
        },
      }
    }
  }
}