import React from 'react';
import { ASelect, Input, Message, Dialog, DatePicker2, AFormTable, TimePicker2 } from '@/component';
import { getWid, AsyncDebounce } from 'assets/js';
import $http from 'assets/js/ajax';
import API from 'assets/api'
import { getDistrictGroupOptions } from '@/report/apiOptions'

// 查询接口
export const searchApiUrl = '/sys/storageAreaGroup/get/waveTime'

// 新增修改
export function getAddConfig(data) {
  return $http({
    url: '/sys/storageAreaGroup/addOrUpdate/waveTime',
    method: 'post',
    data
  })
}

// 删除
export function getDeleteConfig(data) {
  return $http({
    url: '/sys/storageAreaGroup/delete/waveTime',
    method: 'post',
    data
  })
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
  }
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
  },
  groupName: {
    title: '库区组简称',
  },
  waveTimeList: {
    title: '波次时间',
    cell: val => {
      return Array.isArray(val) && val.map(item => {
        return item.waveStartTime + '-' + item.waveEndTime
      }) + '' || '-'
    }
  },
}

// 详情
// 明细column
export const addFormModel = {
  warehouseId: {
    label: '仓库名称',
    defaultValue: getWid(),
    component: ASelect,
    required: true,
    disabled: data => !data.isAdd,
    attrs: {
      hasClear: false
    }
  },
  groupId: {
    label: '库区组简称',
    disabled: data => !data.isAdd,
    component: ASelect,
    attrs: {
      showSearch: true,
      watchKey: 'warehouseId',
      getOptions: getDistrictGroupOptions
    }
  },
  waveTimeList: {
    label: '波次时间配置',
    component: AFormTable,
    span: 24,
    validate: (val) => {
      console.log(val)
      if (Array.isArray(val) && val.length > 1) {
        if (val.some((v, index) => {
          if (index > 0 && v.startEndTime[0] < val[index - 1].startEndTime[1]) {
            Message.warning('波次配置上一时间段结束时间不能大于下一时间段开始时间')
            return true
          }
        })) {
          return false
        }
      }
      return true
    },
    attrs: {
      columns: {
        startEndTime: {
          title: '波次起止时间',
          required: true,
          useDetailValue: true,
          transTimeCode: ['waveStartTime', 'waveEndTime'],
          format: ['HH:mm', 'HH:mm'],
          component: TimePicker2.RangePicker,
          validate: [{ key: 'waveStartTime', msg: '开始时间必填' }, { key: 'waveEndTime', msg: '结束时间必填' }],
          attrs: {
            format: 'HH:mm',
          },
          edit: true
        }
      },
      hasAdd: true,
      maxLength: 24
    }
  }
}
