import React from 'react';
import { AFormTable, ASelect, Input, Upload, Button, Icon, NumberPicker, Message } from '@/component'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { recommendOption } from '@/report/storageAreaGroupConfig/config';
import FenPeiList from './fenpei'
import API from 'assets/api'

const isEditable = () => !getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall

// 查询接口
export const searchUrl = API.getWarehouseDistrictGroupList
// 新增接口
export const addUrl = API.addWarehouseDistrictGroup
// 修改接口
export const modifyUrl = API.modifyWarehouseDistrictGroup

// 删除接口
export const deleteUrl = API.deleteWarehouseDistrictGroup

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
  warehouseName: {
    label: '仓库名称',
    disabled: true
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

// 批量导入
export const batchExportModel = {
  file: {
    fileName: 'lanewayUploadExcel.xlsx',
    componentType: 'import',
  }
}

// 分配库区配置
export const fenpeiModel = {
  fenpeiDetail: {
    label: '',
    span: 24,
    component: FenPeiList
  }
}

// 关联库区查询查询接口
export const fenpeiSearchUrl = API.getWarehouseDistrictAssignedList

// 列表
export const fenpeiTColumns = {
  name: {
    title: '库区简称',
  },
  areaName: {
    title: '国家',
    width: 350
  },
  serviceTypeName: {
    title: '业务类型',
  },
  packageTypeName: {
    title: '大小件',
  }
}
