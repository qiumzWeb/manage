import React from 'react';

import { Input, Select, ASelect, Upload, Icon, Button } from '@/component'
import {deepAssign, deepClone, getWid, _getName} from 'assets/js'
import $http from 'assets/js/ajax'
import { isTrueOrNotOptions } from "@/report/options"
export const qStatus = ['禁用', '启用']
/**
 * @params  isMoreRule 是否可以新增多条规则
 * @params  isShowEachSlotOrderCount 是否需要填写单格口订单数
 * @params  key 用区分不同类型的模式, d 默认， n 无货架，a 闪电播， w 新无货架 
 */
// 无货架
export const noShelvsOptions = [
  {label: '无货架粗分一', value: 'NONE_SHELVES_INITIAL', key: 'n1', isMoreRule: false, isShowEachSlotOrderCount: true, isDisabled: true},
  {label: '无货架粗分二', value: 'NONE_SHELVES_SECOND', key: 'n2', isMoreRule: false, isShowEachSlotOrderCount: true, isDisabled: true},
  {label: '无货架细分', value: 'NONE_SHELVES_FINAL', key: 'n3', isMoreRule: false, isShowEachSlotOrderCount: true, isDisabled: true},
  {label: '无货架入库分拣', value: 'NONE_SHELVES_INSTOCK', key: 'n4', isMoreRule: true, isShowEachSlotOrderCount: false, isDisabled: true},
]
// 闪电播
export const flashSowOptions = [
  {label: '自动入库分拣', value: 'MACHINE_INSTOCK',key: "a1", isMoreRule: true, isShowEachSlotOrderCount: false, isDisabled: false},
  {label: '传送带分拣', value: 'MACHINE_BELT', key: 'a2', isMoreRule: true, isShowEachSlotOrderCount: false, isDisabled: false},
  {label: '集货批次分拣', value: 'GATHER_BATCH_SORT', key: "w1", isMoreRule: true, isShowEachSlotOrderCount: false, isDisabled: false},
  {label: '播种批次分拣', value: 'SOWING_BATCH_SORT', key: "w2", isMoreRule: true, isShowEachSlotOrderCount: false, isDisabled: false},
  {label: '集货+播种批次分拣', value: 'GATHER_SOWING_SORT', key: "w1w2", isMoreRule: true, isShowEachSlotOrderCount: false, isDisabled: false},
]
// 普通
export const qSortingType = [
  {label: '细分', value: '1', key: 'd1', isMoreRule: true, isShowEachSlotOrderCount: false, isDisabled: false},
  {label: '粗分', value: '2', key: 'd2', isMoreRule: true, isShowEachSlotOrderCount: false, isDisabled: false},
  ...noShelvsOptions,
  ...flashSowOptions
]

// 推送规则同步到UCS
// 选择自动入库分拣时需要推送规则同步到UCS
export const getUpdateRuleToUCS = ({ warehouseId, sortingType, solutionId }) => {
  return $http({
    url: `warehouses/${warehouseId}/sorting-solutions/pushSolutionRuleToUCS?sortingType=${sortingType}&solutionId=${solutionId}`,
    method: 'post',
  })
}

// 获取设备
export function getDeviceType(data) {
  return $http({
    url: `warehouses/${data.warehouseId}/sorting-solutions/querySorterProject?sortingType=${data.sortingType}&warehouseId=${data.warehouseId}`,
    method: 'post',
    // data: {
    //   sortingType: data.sortingType,
    //   warehouseId: data.warehouseId
    // }
  }).then(res => {
    return Array.isArray(res) && res.map(r => ({
      ...r,
      label: r.projectName,
      value: r.projectId
    })) || []
  }).catch(e => [])
}

// 获取供包台设备
export function getSupplyStation(data) {
  return $http({
    url: `warehouses/${data.warehouseId}/sorting-solutions/querySupplyStationCodeList?sortingType=${data.sortingType}&warehouseId=${data.warehouseId}&projectId=${data.projectId}`,
    method: 'post',
  }).then(res => {
    return Array.isArray(res) && res.map(r => ({
      ...r,
      label: r.supplyStationCodeName,
      value: r.supplyStationCodeId
    })) || []
  }).catch(e => [])
}



// 获取格口
export function getSlotNo(data) {
  return $http({
    url: `/warehouses/${data.warehouseId}/sorting-solutions/querySorterChute?sortingType=${data.sortingType}&warehouseId=${data.warehouseId}&projectId=${data.projectId
    }`,
    method: 'post',
  }).then(res => {
    return Array.isArray(res) && res.map(r => ({
      ...r,
      label: r.name,
      value: r.code
    })) || []
  }).catch(e => [])
}

// 导入规则模板
export function getImportRules(fileData) {
  const fileList = fileData.sortingSolutionFile
  const formData = new FormData()
  Array.isArray(fileList) && fileList.forEach(file => {
    formData.append('sortingSolutionFile', file.originFileObj)
  })
  return $http({
    url: `warehouses/${getWid()}/sorting-solutions/upload`,
    data: formData,
    method: 'post',
    timeout: 60000,
    dataType: 'form',
  })
}


export const qSearch = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    defaultValue: getWid(),
    attrs: {
      hasClear: false
    }
  },
  solutionName: {
    label: '分拣计划名称',
    component: Input,
    attrs: {
      placeholder: '请输入'
    }
  },
  sortingType: {
    label: '分拣类型',
    component: Select,
    attrs: {
      style: {
        width: '100%'
      },
      dataSource: qSortingType,
      onChange(val, {field}) {
        const data = field.getValues()
        if (data.isAdd && flashSowOptions.map(f => f.value).includes(val)) {
          field.setValue('status', '0')
        }
      }
    }
  },
  status: {
    label: '状态',
    component: Select,
    attrs: {
      style: {
        width: '100%'
      },
      dataSource: qStatus.map((val, index) => ({ label: val, value: index}))
    }
  },

}

export const formModel = {
  ...deepAssign({}, deepClone(qSearch), {
    warehouseId: {
      required: true, 
      disabled: data => !data.isAdd
    },
    solutionName: { required: true},
    status: {
      required: true, 
      disabled: data => flashSowOptions.map(f => f.value).includes(data.sortingType),
    },
    sortingType: {
      required: true,
      disabled: (data) => {
        // return (!data.isAdd && (!!qSortingType.find(q => q.value == data.sortingType && q.isDisabled)))
        return !data.isAdd
      }
    },
    eachSlotOrderCount: {
      label: '单格口订单数',
      required: true,
      show: data => !!qSortingType.find(q => q.value == data.sortingType && q.isShowEachSlotOrderCount),
      // 必填项
      // {label: '无货架粗分一', value: 'NONE_SHELVES_INITIAL'},
      // {label: '无货架粗分二', value: 'NONE_SHELVES_SECOND'},
      // {label: '无货架细分', value: 'NONE_SHELVES_FINAL'},
      
    },
    // 自动入库分拣，传送带分拣时显示
    projectId: {
      label: '设备',
      component: ASelect,
      required: true,
      show: data => flashSowOptions.map(f => f.value).includes(data.sortingType),
      attrs: {
        watchKey: 'warehouseId,sortingType',
        getOptions: async({field}) => {
          const { warehouseId, sortingType } = field.getValues()
          return await getDeviceType({ warehouseId, sortingType })
        }
      }
    },
    xfSortingFinished: {
      label: '是否开启关包',
      component: ASelect,
      show: data => data.sortingType == '2',
      defaultValue: false,
      attrs: {
        getOptions: async() => isTrueOrNotOptions
      }
    },
    gatheringBatchSupplyStationCodeList: {
      label: '集货批分拣供包台编号集合',
      component: ASelect,
      required: true,
      show: data => flashSowOptions.filter(f => f.key?.includes('w1')).map(m => m.value).includes(data.sortingType),
      attrs: {
        mode: 'multiple',
        watchKey: 'warehouseId,sortingType,sowingBatchSupplyStationCodeList,projectId',
        formatOptions: (val, options, field) => {
          const {sowingBatchSupplyStationCodeList} = field.getValues()
          return options.map(o => ({
            ...o,
            disabled: Array.isArray(sowingBatchSupplyStationCodeList) && sowingBatchSupplyStationCodeList.includes(o.value)
          }))
        },
        getOptions: async({field}) => {
          const { warehouseId, sortingType, projectId } = field.getValues()
          try {
            return await getSupplyStation({ warehouseId, sortingType, projectId })
          } catch(e) {
            return []
          }
        },
      }
    },
    sowingBatchSupplyStationCodeList: {
      label: '播种批次分拣供包台号集合',
      component: ASelect,
      required: true,
      show: data => flashSowOptions.filter(f => f.key?.includes('w2')).map(m => m.value).includes(data.sortingType),
      attrs: {
        mode: 'multiple',
        watchKey: 'warehouseId,sortingType,gatheringBatchSupplyStationCodeList,projectId',
        formatOptions: (val, options, field) => {
          const {gatheringBatchSupplyStationCodeList} = field.getValues()
          return options.map(o => ({
            ...o,
            disabled: Array.isArray(gatheringBatchSupplyStationCodeList) &&  gatheringBatchSupplyStationCodeList.includes(o.value)
          }))
        },
        getOptions: async({field}) => {
          const { warehouseId, sortingType, projectId } = field.getValues()
          try {
            return await getSupplyStation({ warehouseId, sortingType, projectId })
          } catch(e) {
            return []
          }
        }
      }
    },
    remark: {
      label: '备注',
      component: Input.TextArea,
      required: true,
      fixedSpan: 24,
      show: data => flashSowOptions.map(f => f.value).includes(data.sortingType),
      attrs: {
        rows: 4,
        maxLength: 200,
        showLimitHint: true,
        placeholder: '请输入'
      }
    },
  })
}

export const tColumns = {
  solutionName: {
    title: '分拣计划名称'
  },
  status: {
    title: '状态',
    // width: 150,
    cell: (val) => {
      return qStatus[val] || '-'
    }
  },
  sortingType: {
    title: '分拣类型',
    cell: (val) => {
      return _getName(qSortingType, val, '-')
    }
  },
  eachSlotOrderCount: {
    title: '单格口订单数',
    width: 80
  },
  gmtCreate: {
    title: '创建时间',
    width: 160
  },
  gmtModified: {
    title: '修改时间',
    width: 160
  },
  updateBy: {
    title: '操作人',
    width: 150
  },
  make: {
    title: '操作',
    lock: 'right',
    width: 150
  }
}

// 规则选项
export const handerInputOptions = [
  // 此三个配置不需要默认值
  {label: '集运仓库区', value: 'store_no'},
  {"label": "闪电播设备号","value": "flowPick_device_no"},
  {"label": "容器号前缀(RFID)", "value": "rfid_prefix"}
]
export const nameOptions = [
  // {label: '集运仓库区', value: 'store_no'},
  ...handerInputOptions,
  // 以下配置默认为否
  {label: '是否尾包', value: 'is_tail'},
  {label: '是否单包尾包', value: 'is_single_tail'},
  {"label": "是否已有出库订单","value": "is_outstock_pkg"},
  {"label": "是否异常包裹", "value": "is_exception_pkg"},
  // {"label": "闪电播设备号","value": "flowPick_device_no"},
  // {"label": "容器号前缀(RFID)", "value": "field_name_rfid_prefix"}
]
// 默认规则配置

export const defaultConds = nameOptions.map(c => ({
  name: c.value,
  op: 'eq',
  v: !handerInputOptions.some(h => h.value.includes(c.value)) ? '0' : ''
}))


export const opOptions = [
  {label: '包含', value: 'contain'},
  {label: '等于', value: 'eq'}
]
// 优化级配置
export const pOptions = new Array(20).fill().map((_,index) => ({
  label: index + 1,
  value: index + 1
}))

// 匹配值
export const vOptions = [
  {label: '是', value: '1'},
  {label: '否', value: '0'}
]


// 批量导入分拣计划规则
export const batchImportModel = {
  sortingSolutionFile: {
    fileName: 'uploadSortingSolution.xlsx',
    componentType: 'import'
  }
}