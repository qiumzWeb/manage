import React from 'react';
import { getCompanyList } from '../step10/config'
import { AFormTable, ASelect, Input, Upload, Button, Icon, Message, DatePicker2, NumberPicker  } from '@/component'
import $http from 'assets/js/ajax'
import { transMultipleToStr } from 'assets/js'
import API from 'assets/api'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { getCountry, packageTypeOptions } from '@/report/apiOptions'
import { recommendOption } from '@/report/storageAreaGroupConfig/config'
import {
  qcTypeOptions,
  specialParcelSignOptions,
  packageTypeList,
} from '@/report/options'
const isEditable = () => !getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall
// 查询库区列表数据
export function getWareHouseDistrictList(data) {
  return $http({
    url: '/sys/warehouseDistrict/tab/list',
    method: 'get',
    data: {
      ...data,
    }
  }).then(res => {
    console.log(res,'===========')
    return res || []
  }).catch(e => {
    Message.error(e.message);
    return []
  })
}
// 新增接口
export const addUrl = API.addWareHouseDistrict
// 修改接口
export const modifyUrl = API.modifyWareHouseDistrict
// 删除接口
export const deleteUrl = API.deleteWareHouseDistrict

// 存储类型
export const getStorageTypeOptions = $http({
  url: API.getDistrictStorageTypeNames,
}).then(data => {
  return Array.isArray(data) && data.map(d => ({
    ...d,
    value: d.code
  }))
}).catch(e => [])

//  业务类型
export const getServiceTypeOptions = $http({
  url: API.getServiceTypeIndexList,
}).then(data => {
  return Array.isArray(data) && data || []
}).catch(e => [])

// 行政区域默认
const defaultList = [
  {label: '无分区', value: 'NULL_AREA'}
]


// 基础信息
export const baseInfo = {
  name: {
    label: '库区简称',
    required: true,
    disabled: data => data.readOnly
  },
  owner: {
    label: '责任人',
    disabled: data => data.readOnly
  },
  ownerTelephone: {
    label: '责任人电话',
    disabled: data => data.readOnly
  },
}
// 存储属性
export const storageProperty = {
  areaCode: {
    label: '国家',
    required: true,
    component: ASelect,
    disabled: data => data.readOnly,
    format: transMultipleToStr,
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
    disabled: data => data.readOnly,
    required: true,
    format: transMultipleToStr,
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
    disabled: data => data.readOnly,
    required: true,
    attrs: {
      getOptions: async() => {
        return packageTypeList
      }
    }
  },
  bagTypeCode: {
    label: '新增包裹类型',
    component: ASelect,
    disabled: data => data.readOnly,
    show: () => !isTMall(),
    attrs: {
      getOptions: async({field}) => {
        return await packageTypeOptions
      }
    }
  },
  specialParcelSign: {
    label: '特殊包裹',
    component: ASelect,
    disabled: data => data.readOnly,
    format: transMultipleToStr,
    attrs: {
      mode: 'multiple',
      getOptions: async({field}) => {
        return specialParcelSignOptions
      }
    }
  },
  administrativeArea: {
    label: '行政区域',
    component: ASelect,
    disabled: data => data.readOnly,
    show: () => isTMall(),
    format: transMultipleToStr,
    attrs: {
      watchKey: 'areaCode',
      mode: 'multiple',
      getOptions: async({field}) => {
        const areaCode = field.getValue('areaCode') + ''
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
  storageTypeCode: {
    label: '库区存储类型',
    component: ASelect,
    disabled: data => data.readOnly,
    attrs: {
      showSearch: true,
      getOptions: async({field}) => {
        return await getStorageTypeOptions
      },
      onChange: (val, vm) => {
        if (val != '12') {
          vm.setOpenData({
            storageTypeCode: val,
            receiveTimeE: '',
            receiveTimeS: '',
            bagTypeCode: ''
          })
        } else {
          vm.setOpenData({
            storageTypeCode: val,
          })
        }
        
      }
    }
  },
  locationPkgNumLimit: {
    label: '库位包裹数量上限',
    component: NumberPicker,
    required: true,
    disabled: data => data.readOnly,
    attrs: {
      min: 0,
    }
  },
  defaultStorageLength: {
    label: '默认库位长(cm)',
    component: NumberPicker,
    required: true,
    disabled: data => data.readOnly,
    attrs: {
      min: 0,
    }
  },
  defaultStorageWidth: {
    label: '默认库位宽(cm)',
    component: NumberPicker,
    disabled: data => data.readOnly,
    required: true,
    attrs: {
      min: 0,
    }
  },
  defaultStorageHeight: {
    label: '默认库位高(cm)',
    component: NumberPicker,
    disabled: data => data.readOnly,
    required: true,
    attrs: {
      min: 0,
    }
  },
}

// 校验规则
export const verificationRules = {
  recommendType: {
    label: '库区推荐开关（只对库区生效）',
    component: ASelect,
    disabled: data => data.readOnly,
    defaultValue: 0,
    disabled: true, 
    attrs: {
      getOptions: async({field}) => {
        return recommendOption
      }
    }
  },
  pkgNumLimit: {
    label: '库区包裹数量上限',
    component: NumberPicker,
    required: true,
    disabled: data => data.readOnly,
    attrs: {
      min: 0,
    }
  },
  firstPkgNumLimit: {
    label: '库区首单数量上限',
    component: NumberPicker,
    required: true,
    disabled: data => data.readOnly,
    attrs: {
      min: 0,
    }
  },
  volumeLimit: {
    label: '库区体积上限(m³)',
    component: NumberPicker,
    required: true,
    disabled: data => data.readOnly,
    attrs: {
      min: 0,
    }
  },
  locationCapacityWarnning: {
    label: '库容预警百分比(%)',
    component: NumberPicker,
    disabled: data => data.readOnly,
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
    disabled: data => data.readOnly,
    // required: true,
    attrs: {
      placeholder: '请输入 0 ~ 100 的整数',
      min: 0,
      max: 100
    }
  },

  receiveTimeS: {
    label: '包裹签收时间',
    component: DatePicker2,
    show: data => data.storageTypeCode == 12 && !isTMall(),
    disabled: data => data.readOnly,
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
    disabled: data => data.readOnly,
    show: data => {
      return data.storageTypeCode == 12 && !isTMall()
    },
    attrs: {
      format: 'YYYY-MM-DD HH:mm',
      showTime: true,
      timePanelProps: {
        format: 'HH:mm',
      }
    }
  },
  // qcType: {
  //   label: '质检类型 - 都不用，需要传默认值 0',
  //   component: ASelect,
  //   show: false,
  //   required: true,
  //   disabled: data => data.readOnly,
  //   defaultValue: '0',
  //   attrs: {
  //     getOptions: async({field}) => {
  //       return qcTypeOptions
  //     }
  //   }
  // },
}
