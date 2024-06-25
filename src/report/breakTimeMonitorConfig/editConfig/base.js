import React from 'react'
import { DatePicker2, TimePicker2, NumberPicker  } from '@/component'
import ASelect from '@/component/ASelect/index'
import { breakTimeTypeOption, breakTimeEnableOptions } from '@/report/options'
import { packageTypeOptions } from '@/report/apiOptions'
export default {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    required: true,
    disabled: data => !data.isAdd
  },
  kpiName: {
    label: '考核方案名称',
    required: true
  },
  turnoverType: {
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
    label: '考核方案起止时间',
    component: DatePicker2.RangePicker,
    required: true,
    fixedSpan: 22,
    useDetailValue: true,
    transTimeCode: ['kpiStartEffectiveDate', 'kpiEndEffectiveDate'],
    format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
    attrs: {
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
    }
  },

  kpiType: {
    label: '考核类型',
    component: ASelect,
    required: true,
    attrs: {
      hasClear: false,
      getOptions: async() => breakTimeTypeOption,
      onChange: (val, form) => {
        form.setOpenData({kpiType: val})
      }
    }
  },
  isEnable: {
    label: '是否启用',
    component: ASelect,
    required: true,
    attrs: {
      hasClear: false,
      getOptions: async() => breakTimeEnableOptions
    }
  }
}