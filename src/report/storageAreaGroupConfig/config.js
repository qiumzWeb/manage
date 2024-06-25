import React from 'react'
import { NumberPicker } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import $http from 'assets/js/ajax'
import API from 'assets/api'
// 查询接口
export const searchUrl = API.getWarehouseDistrictGroupList
// 新增接口
export const addUrl = API.addWarehouseDistrictGroup
// 修改接口
export const modifyUrl = API.modifyWarehouseDistrictGroup

// 删除接口
export const deleteUrl = API.deleteWarehouseDistrictGroup

export const recommendOption = [
  {label: '关闭推荐',value: 0},
  {label: '开放推荐',value: 1},
  {label: '仅开放次单推荐(关闭首单推荐)',value: 2},
]

export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      attrs: {
        hasClear: false,
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
    title: '库区组简称'
  },
  stoargeAreaName: {
    title: '库区',
  },
  owner: {
    title: '责任人'
  },
  ownerTelephone: {
    title: '责任人电话'
  },
  locationCapacityWarning: {
    title: '库容预警百分比(%)',
  },
  make: {
    title: '操作',
    lock: 'right'
  }
}

// 新增修改
export const formModel = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    disabled: data => !data.isAdd,
    required: true,
    attrs: {
      showSearch: true,
    }
  },
  groupName: {
    label: '库区组简称',
    required: true,
    attrs: {
      maxLength: 256,
      trim: true,
    }
  },
  recommendType: {
    label: '库区组推荐开关',
    required: true,
    component: ASelect,
    attrs: {
      getOptions: async() => {
        return recommendOption
      }
    }
  },
  owner: {
    label: '责任人'
  },
  ownerTelephone: {
    label: '责任人电话'
  },
  locationCapacityWarning: {
    label: '库容预警百分比(%)',
    component: NumberPicker,
    attrs: {
      max: 100,
      min: 0,
      placeholder: '请输入 0 - 100 的整数'
    }
  }
}
