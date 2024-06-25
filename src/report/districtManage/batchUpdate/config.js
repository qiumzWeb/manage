import React from 'react'
import { Input, Select, Button, Radio, DatePicker2, NumberPicker } from '@/component'
import moment from 'moment'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import $http from 'assets/js/ajax'
import API from 'assets/api'
import { getCountry } from '@/report/apiOptions'
import { getStorageTypeOptions } from '../config'
// 修改接口
export const modifyUrl = API.modifyWareHouseDistrict
const recommendOption = [
  {
      value: 1,
      label: '推荐开启'
  },
  {
      value: 0,
      label: '推荐关闭'
  },
  {
      value: 2,
      label: '首单推荐关闭'
  },
  {
      value:"",
      label:'不作变更'
  }
];

export const conditionModel = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    defaultValue: getWid(),
    required: true,
    attrs: {
      showSearch: true,
      onChange: (val, vm, action) => {
        action && vm.field.setValue('districtIds', [])
      }
    }
  },
  storageTypeCode: {
    label: '库区存储类型',
    component: ASelect,
    required: true,
    attrs: {
      showSearch: true,
      getOptions: async({field}) => {
        return await getStorageTypeOptions.then(data => data.filter(f => [5,8, 10].includes(f.value)))
      },
      onChange: (val, vm, action) => {
        action && vm.field.setValue('districtIds', [])
      }
    }
  },
  districtIds: {
    label: '库区',
    component: ASelect,
    required: true,
    disabled: data => !data.storageTypeCode,
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
}
// 新增修改
export const dataModel = {
  pkgNumLimit: {
    label: '库区包裹数量上限',
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },
  firstPkgNumLimit: {
    label: '库区首单数量上限',
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },
  volumeLimit: {
    label: '库区体积上限(m³)',
    component: NumberPicker,
    attrs: {
      min: 0,
    }
  },
  areaCode: {
    label: '国家',
    component: ASelect,
    attrs: {
      showSearch: true,
      mode: 'multiple',
      getOptions: async() => {
        return await getCountry
      }
    }
  },
  recommendType: {
    label: '库位推荐类型',
    component: ASelect,
    defaultValue: '',
    attrs: {
      getOptions: async({field}) => {
        return recommendOption
      }
    }
  },
}
