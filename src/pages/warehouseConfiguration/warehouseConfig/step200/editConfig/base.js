import React from 'react'
import { DatePicker2, TimePicker2, NumberPicker  } from '@/component'
import ASelect from '@/component/ASelect/index'
import { breakTimeTypeOption, breakTimeEnableOptions } from '@/report/options'
import { packageTypeOptions } from '@/report/apiOptions'
import { isInvalidDate } from 'assets/js'

export default {
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
    validate: (val, data, setError) => {
      if (isInvalidDate(data.kpiStartEffectiveDate) || isInvalidDate(data.kpiEndEffectiveDate)) {
        setError('考核方案起止时间不能为空')
        return false
      }
      return true
    },
    attrs: {
      hasClear: false,
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
    defaultValue: '0',
    attrs: {
      hasClear: false,
      isRadio: true,
      getOptions: async() => breakTimeEnableOptions
    }
  }
}