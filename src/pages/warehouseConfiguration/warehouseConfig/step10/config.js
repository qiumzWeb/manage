import React from 'react'
import { Input } from '@/component'
import ASelect from '@/component/ASelect'
import $http from 'assets/js/ajax'
import API from 'assets/api'
// 查询接口
export const searchUrl = API.getWarehouseList
// 新增接口
export const addUrl = API.createWarehouse
// 修改接口
export const modifyUrl = API.modifyWarehouse

// 获取公司列表
export const getCompanyList = $http({
  url: API.getCompanyNameList,
}).then(data => {
  return Array.isArray(data) && data.map(d => ({
    ...d,
    label: d.companyName,
    value: d.companyId
  })) || []
}).catch(_ => [])

// 新增修改
export const formModel = {
  companyId: {
    label: '所属公司',
    component: ASelect,
    required: true,
    disabled: (data) => {
      return data.isReadOnly || !data.isAdd
    }, 
    attrs: {
      hasClear: false,
      showSearch: true,
      getOptions: async() => {
        return await getCompanyList
      }
    }
  },
  warehouseName: {
    label: '仓库名称',
    required: true,
    disabled: (data) => data.isReadOnly || !data.isAdd, 
    attrs: {
      maxLength: 256,
      trim: true,
    }
  },
  warehouseCode: {
    label: '仓库代号',
    required: true,
    disabled: (data) => data.isReadOnly || !data.isAdd, 
    attrs: {
      maxLength: 60,
      trim: true
    }
  },
  owner: {
    label: '仓库责任人',
    disabled: (data) => data.isReadOnly, 
    attrs: {
      trim: true,
    }
  },
  ownerTelephone: {
    label: '仓库责任人电话',
    disabled: (data) => data.isReadOnly, 
    attrs: {
      trim: true
    }
  },
  warehouseDescription: {
    label: '仓库描述',
    span: 24,
    component: Input.TextArea,
    disabled: (data) => data.isReadOnly, 
    required: true,
    attrs: {
      maxLength: 100,
      showLimitHint: true,
      placeholder: `请描述仓库用途或业务等`
    }
  },
}
