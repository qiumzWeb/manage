import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { getDistrictGroup, packageTypeOptions } from '@/report/apiOptions'
import { defaultSearchDate } from '@/report/utils'
import { 
  searchRangeOption,
  pickingModelOptions
} from '@/report/options'
import { timeTypeOption } from '../summary/config'


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
    searchRangeType: {
      label: '统计维度',
      defaultValue: '0',
      component: ASelect,
      attrs: {
        hasClear: false,
        getOptions: async() => {
          return searchRangeOption
        }
      }
    },
    districtGroupList: {
      label: '库区组维度',
      component: ASelect,
      show: data => data.searchRangeType === '1',
      attrs: {
        mode: 'multiple',
        placeholder: "请选择",
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          const {data} = await getDistrictGroup(values)
          return Array.isArray(data) && data.map(d => ({
            label: d.name,
            value: d.code
          })) || []
        }
      }
    },
    districtList: {
      label: '库区维度',
      component: ASelect,
      show: data => data.searchRangeType === '2',
      attrs: {
        mode: 'multiple',
        watchKey: 'warehouseId',
        getOptions: async({field}) => {
          const values = field.getValues()
          const {data} = await getDistrictGroup(values)
          return Array.isArray(data) && data.map(d => ({
            label: d.name,
            value: d.code
          })) || []
        }
      }
    },
    operatingTimeType: {
      label: '时间类型',
      component: ASelect,
      defaultValue: '1',
      attrs: {
        hasClear: false,
        getOptions: async() => {
          return timeTypeOption
        }
      }
    },
    makeTime: {
      label: '统计时间',
      fixedSpan: 22,
      defaultValue: defaultSearchDate,
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD',
        hasClear: false
      }
    },
    turnoverTypes: {
      label: '包裹类型',
      component: ASelect,
      defaultValue: async() => {
        const val = await packageTypeOptions
        return val.map(v => v.value)
      },
      attrs: {
        mode: 'multiple',
        hasClear: false,
        getOptions: async() => {
          return await packageTypeOptions
        }
      }
    },
    pickingMode: {
      label: '拣货模式',
      component: ASelect,
      attrs: {
        getOptions: async() => pickingModelOptions
      }
    }
  }
]
