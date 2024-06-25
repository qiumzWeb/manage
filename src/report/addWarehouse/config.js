import React from 'react'
import { Input, ASelect } from '@/component'
import $http from 'assets/js/ajax'
import API from 'assets/api'
import { isYOrNOptions } from '@/report/options'
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

export const qSearch = [
  {
    companyId: {
      label: '公司名称',
      component: ASelect,
      fixedSpan: 14,
      attrs: {
        hasClear: false,
        showSearch: true,
        getOptions: async() => {
          return await getCompanyList
        }
      }
    },
    warehouseCode: {
      label: '仓库代号',
      attrs: {
        maxLength: 60,
        trim: true
      }
    },
  }
]

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库ID',
    lock: 'left'
  },
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  warehouseCode: {
    title: '仓库代号'
  },
  companyName: {
    title: '所属公司',
  },
  owner:{
    title: '仓库责任人'
  },
  ownerTelephone: {
    title: '仓库责任人电话'
  },
  lastModifiedBy: {
    title: '操作人',
  },
  lastModifiedTime: {
    title: '操作时间',
  },
  make: {
    title: '操作',
    width: 100
  }
}

// 新增修改
export const formModel = {
  companyId: {
    label: '所属公司',
    component: ASelect,
    span: 12,
    disabled: data => !data.isAdd,
    required: true,
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
    span: 12,
    attrs: {
      maxLength: 256,
      trim: true,
    }
  },
  warehouseCode: {
    label: '仓库代号',
    required: true,
    disabled: data => !data.isAdd,
    span: 12,
    attrs: {
      maxLength: 60,
      trim: true
    }
  },
  owner: {
    label: '仓库责任人',
    span: 12,
    attrs: {
      trim: true,
    }
  },
  ownerTelephone: {
    label: '仓库责任人电话',
    span: 12,
    attrs: {
      trim: true
    }
  },
  crossAreaGroupRecom: {
    label: '是否支持跨库区组推荐',
    span: 12,
    component: ASelect,
    defaultValue: 'N',
    attrs: {
      getOptions: async() => isYOrNOptions,
      hasClear: false
    }
  },
  warehouseDescription: {
    label: '仓库描述',
    span: 24,
    component: Input.TextArea,
    required: true,
    attrs: {
      maxLength: 512,
      showLimitHint: true,
      placeholder: `请描述仓库用途或业务等`
    }
  },
}
