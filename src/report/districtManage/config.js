import React from 'react'
import { Input, Select, Button, Radio, DatePicker2, NumberPicker } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid, isTrue} from 'assets/js'
import $http from 'assets/js/ajax'
import API from 'assets/api'
import { getCountry, packageTypeOptions, getStorageTypeOptions } from '@/report/apiOptions'
import { recommendOption } from '@/report/storageAreaGroupConfig/config'
import {
  qcTypeOptions,
  specialParcelSignOptions,
  packageTypeList,
  userTypeOptions,
  areaPriorityOptions,
} from '@/report/options'

// 查询接口
export const searchUrl = API.getWareHouseDistrictList
// 新增接口
export const addUrl = API.addWareHouseDistrict
// 修改接口
export const modifyUrl = API.modifyWareHouseDistrict
// 删除接口
export const deleteUrl = API.deleteWareHouseDistrict
export {
  getStorageTypeOptions
}
//  业务类型
export const getServiceTypeOptions = $http({
  url: API.getServiceTypeIndexList,
}).then(data => {
  return Array.isArray(data) && data || []
}).catch(e => [])



// 行政区域默认
const defaultList = [
  // {label: '无分区', value: 'NULL_AREA'}
]



export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      attrs: {
        hasClear: false,
        onChange: (val, vm, action) => {
          action && vm.field.setValue('districtIds', [])
        }
      }
    },
    storageTypeCode: {
      label: '存储类型',
      component: ASelect,
      attrs: {
        showSearch: true,
        getOptions: async({field}) => {
          return await getStorageTypeOptions
        },
        onChange: (val, vm, action) => {
          action && vm.field.setValue('districtIds', [])
        }
      }
    },
    districtIds: {
      label: '库区简称(可多选)',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        showSearch: true,
        watchKey: 'warehouseId,storageTypeCode',
        getOptions: async({field}) => {
          const warehouseId = field.getValue('warehouseId')
          const storageTypeCode = field.getValue('storageTypeCode')
          const list = await $http({
            url: API.getDistrictNames.replace("{warehouseId}", warehouseId),
            method: 'post',
            data:{
              storageTypeList: storageTypeCode && [storageTypeCode]
            }
          }).then(d=> {
            return Array.isArray(d) && d.map(e => ({
              ...e,
              label: e.name,
              value: e.id
            }))
          }).catch(e => [])
          return list
        }
      }
    },
    districtName: {
      label: '库区简称(模糊查询)',
    },
    areaCodes: {
      label: '国家(可多选)',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        showSearch: true,
        getOptions: async() => {
          return await getCountry
        }
      }
    },
    administrativeArea: {
      label: '关联行政区域',
      component: ASelect,
      attrs: {
        watchKey: 'areaCodes',
        getOptions: async({field}) => {
          const areaCode = field.getValue('areaCodes')
          const list = await $http({
            url: API.getAdministrativeAreaList,
            method: 'get',
            data: {areaCode}
          }).then(data => {
            return Array.isArray(data) && [...defaultList, ...data] || defaultList
          }).catch(e => defaultList)
          return list
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
  name: {
    title: '库区简称'
  },
  areaName: {
    title: '国家',
  },
  serviceTypeName: {
    title: '业务类型',
  },
  storageTypeLabel: {
    title: '库区存储类型',
  },
  recommendTypeLabel: {
    title: '库区推荐类型',
  },
  areaPriority: {
    title: '推荐优先级'
  },
  qcType: {
    title: '质检类型',
    cell: (val) => <ASelect value={val} getOptions={async() => qcTypeOptions} isDetail defaultValue="无"></ASelect> 
  },
  specialParcelSign: {
    title: '特殊包裹标识',
    cell: (val) => <ASelect value={val} getOptions={async() => specialParcelSignOptions} isDetail defaultValue="无"></ASelect> 
  },
  administrativeArea: {
    title: '行政区域',
    cell: (val) => {
      defaultList.forEach(item => {
        val = val.replace(new RegExp(item.value, 'g'), item.label)
      })
      return val || '-'
    }
  },
  defaultStorageLength: {
    title: '默认库位长(cm)',
  },
  defaultStorageWidth: {
    title: '默认库位宽(cm)',
  },
  defaultStorageHeight: {
    title: '默认库位高(cm)',
  },
  defaultStorageVolume: {
    title: '默认库位体积(cm³)',
    width: 160
  },
  locationPkgNumLimit: {
    title: '库位包裹数量上限',
  },
  locationCapacityWarnning: {
    title: '库容预警百分比(%)',
    width: 100,
  },
  isAllocation: {
    title: '物理分配标识',
    cell: (val) => {
      return val == 'Y' ? '√' : '-'
    }
  },
  owner: {
    title: '责任人'
  },
  ownerTelephone: {
    title: '责任人电话'
  },
  make: {
    title: '操作',
    lock: 'right',
    width: 180
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
  name: {
    label: '库区简称',
    required: true,
    attrs: {
      maxLength: 256,
      trim: true,
    }
  },
  areaCode: {
    label: '国家',
    required: true,
    component: ASelect,
    attrs: {
      showSearch: true,
      mode: 'multiple',
      getOptions: async() => {
        return await getCountry
      }
    }
  },
  serviceType: {
    label: '业务类型',
    component: ASelect,
    required: true,
    attrs: {
      showSearch: true,
      mode: 'multiple',
      getOptions: async() => {
        return await getServiceTypeOptions
      }
    }
  },
  packageType: {
    label: '大小件',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
        return packageTypeList
      }
    }
  },
  storageTypeCode: {
    label: '库区存储类型',
    component: ASelect,
    attrs: {
      showSearch: true,
      getOptions: async({field}) => {
        return await getStorageTypeOptions
      },
      onChange: (val, vm) => {
        if (val != '12') {
          vm.field.setValue('receiveTimeE', '')
          vm.field.setValue('receiveTimeS', '')
          vm.field.setValue('bagTypeCode', '')
        }
      }
    }
  },
  defaultStorageLength: {
    label: '默认库位长(cm)',
    component: NumberPicker,
    required: true,
    attrs: {
      min: 0,
    }
  },
  defaultStorageWidth: {
    label: '默认库位宽(cm)',
    component: NumberPicker,
    required: true,
    attrs: {
      min: 0,
    }
  },
  defaultStorageHeight: {
    label: '默认库位高(cm)',
    component: NumberPicker,
    required: true,
    attrs: {
      min: 0,
    }
  },
  locationPkgNumLimit: {
    label: '库位包裹数量上限',
    component: NumberPicker,
    required: true,
    attrs: {
      min: 0,
    }
  },
  locationCapacityWarnning: {
    label: '库容预警百分比(%)',
    component: NumberPicker,
    required: true,
    attrs: {
      placeholder: '请输入 0 ~ 100 的整数',
      min: 0,
      max: 100
    }
  },
  firstPkgNumWarning: {
    label: '首单预警百分比(%)',
    component: NumberPicker,
    // required: true,
    attrs: {
      placeholder: '请输入 0 ~ 100 的整数',
      min: 0,
      max: 100
    }
  },
  zipGroup: {
    label: '邮编组',
    component: ASelect,
    attrs: {
      mode: 'multiple',
      showSearch: true,
      watchKey: 'warehouseId',
      getOptions: async({field}) => {
        const warehouseId = field.getValue('warehouseId')
        const list = await $http({
          url: API.getZipGroup,
          method: 'get',
          data:{
            warehouseId: warehouseId
          }
        }).then(d=> {
          return Array.isArray(d) && d || []
        }).catch(e => [])
        return list
      }
    }
  },
  recommendType: {
    label: '库区推荐开关（只对库区生效）',
    component: ASelect,
    defaultValue: '0',
    disabled: (data) => data.isAdd, 
    attrs: {
      getOptions: async({field}) => {
        return recommendOption
      }
    }
  },
  qcType: {
    label: '质检类型',
    component: ASelect,
    required: true,
    defaultValue: '0',
    attrs: {
      getOptions: async({field}) => {
        return qcTypeOptions
      }
    }
  },
  specialParcelSign: {
    label: '特殊包裹',
    component: ASelect,
    attrs: {
      mode: 'multiple',
      getOptions: async({field}) => {
        return specialParcelSignOptions
      }
    }
  },
  administrativeArea: {
    label: '关联行政区域',
    component: ASelect,
    attrs: {
      watchKey: 'areaCode',
      mode: 'multiple',
      getOptions: async({field}) => {
        const areaCode = field.getValue('areaCode')
        const list = await $http({
          url: API.getAdministrativeAreaList,
          method: 'get',
          data: {areaCode}
        }).then(data => {
          return Array.isArray(data) && [...defaultList, ...data] || defaultList
        }).catch(e => defaultList)
        return list
      }
    }
  },
  receiveTimeS: {
    label: '包裹签收时间',
    component: DatePicker2,
    disabled: data => data.storageTypeCode != 12,
    attrs: {
      format: 'YYYY-MM-DD HH:mm',
      showTime: true,
      timePanelProps: {
        format: 'HH:mm',
      }
    }
  },
  receiveTimeE: {
    label: '包裹结束时间',
    component: DatePicker2,
    disabled: data => data.storageTypeCode != 12,
    attrs: {
      format: 'YYYY-MM-DD HH:mm',
      showTime: true,
      timePanelProps: {
        format: 'HH:mm',
      }
    }
  },
  bagTypeCode: {
    label: '新增包裹类型',
    component: ASelect,
    format: (val, {data, action}) => {
      let value = ''
      if (Array.isArray(val)) {
        value = [...val];
        value.sort((a, b) => b-a);
      } else {
        value = isTrue(val) && val + '' || ''
      }
      const result = {
        output: Array.isArray(value) && value.reduce((a, b) => {
          return a + '' + b
        }, '') || '',
        inset: typeof value === 'string' && value.split('') || []
      }
      return result[action]
    },
    attrs: {
      mode: 'multiple',
      getOptions: async({field}) => {
        return await packageTypeOptions
      }
    }
  },
  pkgNumLimit: {
    label: '库区包裹数量上限',
    component: NumberPicker,
    required: true,
    attrs: {
      min: 0,
    }
  },
  firstPkgNumLimit: {
    label: '库区首单数量上限',
    component: NumberPicker,
    required: true,
    attrs: {
      min: 0,
    }
  },
  volumeLimit: {
    label: '库区体积上限(m³)',
    component: NumberPicker,
    required: true,
    attrs: {
      min: 0,
    }
  },
  consolidatedBatchOrderLimit:{
    label: '库区订单数量上限',
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },
  owner: {
    label: '责任人'
  },
  ownerTelephone: {
    label: '责任人电话'
  },
  buyerVipCode: {
    label: '客户',
    component: ASelect,
    format: (val, {action}) => {
      const getValue = {
        inset: typeof val === 'string' ? val.split(',') : [],
        output: Array.isArray(val) ? val.join(',') : ''
      }
      return getValue[action]
    },
    attrs: {
      showSearch: true,
      mode: 'multiple',
      watchKey: 'warehouseId',
      getOptions: async({field}) => {
        const warehouseId = field.getValue('warehouseId')
        if (!warehouseId) return []
        const data = await $http({
          url: '/sys/warehouseDistrict/getKeyCustomers',
          method: 'get',
          data: {warehouseId}
        })
        let options = []
        if (data && typeof data === 'object') {
          options = Object.entries(data).map(([key, val]) => {
            return { label: val, value: key}
          })
        }
        return options
      }
    }
  },
  userType: {
    label: '用户类型',
    component: ASelect,
    defaultValue: '0',
    attrs: {
      getOptions: async() => userTypeOptions
    }
  },
  areaPriority: {
    label: '推荐优先级',
    // component: ASelect,
    component: NumberPicker,
    attrs: {
      min: 0,
      // getOptions: async() => areaPriorityOptions
    }
  }
}
