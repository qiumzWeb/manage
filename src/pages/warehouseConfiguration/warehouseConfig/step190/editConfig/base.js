import React from 'react'
import { DatePicker2, TimePicker2, NumberPicker  } from '@/component'
import ASelect from '@/component/ASelect/index'
import { kpiTypeOption } from '@/report/options'
import { packageTypeOptions } from '@/report/apiOptions'
export default {
  kpiName: {
    label: 'KPI方案名称',
    required: true
  },
  kpiType: {
    label: 'KPI类型',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
        return kpiTypeOption
      },
      onChange: (val,vm, action) => {
        vm.setOpenData({kpiType: val})
      }
    }
  },
  speedType: {
    label: '包裹类型',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
        return  await packageTypeOptions
      }
    }
  },
  kpiStartEffectiveDate: {
    label: 'KPI生效开始时间',
    component: DatePicker2,
    required: true,
    attrs: {
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: true
    }
  },
  kpiEndEffectiveDate: {
    label: 'KPI生效结束时间',
    component: DatePicker2,
    required: true,
    attrs: {
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: true
    }
  },
  isDefault: {
    label: '默认KPI方案',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
        return [
          {label: 'Y', value: 'Y'},
          {label: 'N', value: 'N'}
        ]
      }
    }
  },
  isEnable: {
    label: '方案状态',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
        return [
          {label: '启用', value: '1'},
          {label: '禁用', value: '2'}
        ]
      }
    }
  }
}