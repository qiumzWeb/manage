import React from 'react';
import { AFormTable, ASelect, Input, NumberPicker } from '@/component';
import {getWid} from 'assets/js';
import $http from 'assets/js/ajax';
// 查询接口
export const searchApiUrl = '/sys/flowPick/reBatch/position/list'

// 新增
export function addConfig(data) {
  return $http({
    url: '/sys/flowPick/reBatch/position/add',
    method: 'post',
    data
  })
}

// 更新 启用/禁用
export function updateConfig({id, status}) {
  return $http({
    url:`/sys/flowPick/reBatch/position/update?id=${id}&status=${status}`,
    method: 'post',
  })
}

// 获取所有设备
export const getDevice = (warehouseId) => {
  return $http({
    url: `/sys/flowPick/reBatch/position/getDeviceCode/${warehouseId}`,
    method: 'get',
  }).then(res=> {
    return Array.isArray(res) && res.map(r => ({
      label: r,
      value: r
    })) || []
  }).catch(e => [])
}

// 获取库位
export const getLocalPositionCode = (warehouseId) => {
  return $http({
    url: `/sys/flowPick/reBatch/position/getCodeAndName/${warehouseId}`,
    method: 'get',
  }).then(res=> {
    return Array.isArray(res) && res.map(r => ({
      label: r,
      value: r
    })) || []
  }).catch(e => [])
}

// 获取可配置设备
export const getNewDevice = (warehouseId) => {
  return $http({
    url: `/sys/flowPick/reBatch/position/getPositionDevice/${warehouseId}`,
    // url: `/sys/flowPick/reBatch/position/getDeviceCode/${warehouseId}`,
    method: 'get',
  }).then(res=> {
    return Array.isArray(res) && res.map(r => ({
      label: r,
      value: r
    })) || []
  }).catch(e => [])
}

// 修改库位扫描配置
export const getModifyPositionScanConfig = (data) => {
  return $http({
    url: `/sys/flowPick/reBatch/position/batchUpdate`,
    method: 'post',
    data
  })
}


// 获取库位停留时长 配置
// 修改库位扫描配置
export const getWaveOccupiedMinTimeConfig = (data) => {
  return $http({
    url: `/sys/flowPick/reBatch/position/getWaveOccupiedMinTime`,
    method: 'post',
    data
  })
}
// 修改库位扫描配置
export const saveWaveOccupiedMinTimeConfig = (data) => {
  return $http({
    url: `/sys/flowPick/reBatch/position/setWaveOccupiedMinTime`,
    method: 'post',
    data
  })
}


// 保存库位停留时长 配置


// 状态
export const statusOptions = [
  {label: '使用中', value: '1'},
  {label: '已禁用', value: '0'}
]

// 库位类型
export const typeOptions = [
  {label: '正常', value: '0'},
  {label: '异常', value: '1'}
]

// 是否扫描库区
export const isNeedScanOptions = [
  {label: '是', value: '1'},
  {label: '否', value: '0'}
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
    deviceCode: {
      label: '关联设备',
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
    codeList: {
      label: '库位代码',
      component: ASelect,
      attrs: {
        showSearch: true,
        mode: 'multiple',
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const warehouseId = field.getValue('warehouseId')
          return getLocalPositionCode(warehouseId)
        }
      }
    },
    name: {
      label: '库位简称'
    },
    type: {
      label: '库位类型',
      component: ASelect,
      attrs: {
        getOptions: async() => typeOptions
      }
    },
    status: {
      label: '状态',
      component: ASelect,
      attrs: {
        getOptions: async() => statusOptions
      }
    }
  }
]

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: (val) => <ASelect value={val} isDetail defaultValue={val}></ASelect>
  },
  deviceCode: {
    title: '关联设备',
  },
  code: {
    title: '库位代码',
  },
  name: {
    title: '库位简称',
  },
  type: {
    title: '库位类型',
    cell: (val) => <div className={val == 1 ? 'warn-color': ''}>
      <ASelect value={val} getOptions={async() => typeOptions} isDetail defaultValue={val}></ASelect>
    </div>
  },
  status: {
    title: '状态',
    cell: (val) => <ASelect value={val} getOptions={async() => statusOptions} isDetail defaultValue={val}></ASelect>
  },
  isNeedScan: {
    title: '是否需要扫描库位',
    cell: val => <div className={val !=1 ? 'warn-color': ''}>
        <ASelect value={val} getOptions={async() => isNeedScanOptions} isDetail defaultValue={val}></ASelect>
    </div>
  }
}

// 新增
export const formModeConfig = {
  list: {
    label: '',
    component: AFormTable,
    span: 24,
    attrs: {
      hasAdd: true,
      maxLength: 100,
      defaultData: {warehouseId: getWid(), isNeedScan: '1'},
      cellProps: (rowIndex, colIndex) => {
        if (rowIndex == 0 && colIndex == 0) {
          return {
            rowSpan: 100
          }
        }
      },
      columns: {
        warehouseId: {
          title: '仓库名称',
          required: true,
          component: ASelect,
          edit: true,
          attrs: {
            isDetail: true,
          }
        },
        type: {
          title: '库位类型',
          required: true,
          edit: true,
          component: ASelect,
          attrs: {
            getOptions: async() => typeOptions
          }
        },
        deviceCode: {
          title: '关联设备',
          edit: true,
          component: React.forwardRef(function(props){
            const { field } = props
            const data = field.getValues()
            if (data.type == 1) {
              return <Input {...props}></Input>
            }
            return <ASelect {...props}></ASelect>
          }),
          attrs: {
            // mode: 'multiple',
            watchKey: 'warehouseId',
            getOptions: async({field}) => {
              const warehouseId = field.getValue('warehouseId')
              return getDevice(warehouseId)
            }
          }
        },
        code: {
          title: '库位代码',
          edit: true
        },
        name: {
          title: '库位简称',
          edit: true
        },
        // isNeedScan: {
        //   title: '是否需要扫描',
        //   edit: true,
        //   component: ASelect,
        //   attrs: {
        //     isRadio: true,
        //     getOptions: async() => isNeedScanOptions
        //   }
        // }
      }
    }
  }
}


// 修改绑定设备是否扫描
export const modifyConfig = [{
  warehouseId: {
    label: '仓库名称',
    required: true,
    component: ASelect,
    span: 12,
    disabled: true,
  },
}, {
  deviceCode: {
    label: '关联设备',
    component: ASelect,
    required: true,
    span: 12,
    attrs: {
      // mode: 'multiple',
      showSearch: true,
      watchKey: 'warehouseId',
      getOptions: async({field}) => {
        const warehouseId = field.getValue('warehouseId')
        return getNewDevice(warehouseId)
      }
    }
  },
  isNeedScan: {
    label: '是否需要扫描',
    component: ASelect,
    required: true,
    span: 12,
    attrs: {
      isRadio: true,
      getOptions: async() => isNeedScanOptions
    }
  }
}]

// 库位停留时长配置
export const storeStopTimeConfig = {
  type: {
    label: '库位类型',
    component: ASelect,
    attrs: {
      getOptions: async() => typeOptions,
      onChange: (value, vm, action) => {
        action && getWaveOccupiedMinTimeConfig({warehouseId: getWid(), type: value}).then(res => {
          vm.field.setValue('occupiedMinTime', res || '')
        })
      }
    }
  },
  occupiedMinTime: {
    label: '库位停留时长（小时）',
    component: NumberPicker,
    attrs: {
      step: 0.5,
      min: 0,
      placeholder: '请输入0.5的倍数的正整数',
      onChange: (val, vm, action) => {
        const a = parseInt(val)
        if (val > a) {
          vm.field.setValue('occupiedMinTime', a + 0.5)
        }
      }
    }
  }
}