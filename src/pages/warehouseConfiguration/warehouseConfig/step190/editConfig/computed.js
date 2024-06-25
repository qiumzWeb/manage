import React from 'react'
import { DatePicker2, TimePicker2, NumberPicker  } from '@/component'
import ASelect from '@/component/ASelect/index'
import { kpiTimeTypeOption, kpiEndOperationOptions } from '@/report/options'

const timeTypeOptions = [
    {"label": "T-1", "value": "1"},
    {"label": "T", "value": "2"},
    {"label": "T+1", "value": "3"}
]
export default {
    kpiStartOperation: {
    label: 'KPI起算时间类型',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
          return kpiTimeTypeOption
      }
    }
  },
  startCalculationTime: {
    label: '开始时间类型',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
        return timeTypeOptions
      }
    }
  },
  kpiStartCalculationTime: {
    label: 'KPI起算开始时间',
    required: true,
    component: TimePicker2,
    attrs: {
        format: 'HH:mm:ss',
        style: {width: '100%'}
    }
  },
  endCalculationTime: {
    label: '结束时间类型',
    component: ASelect,
    required: true,
    attrs: {
        getOptions: async() => {
            return timeTypeOptions
        }
    }
  },
  kpiEndCalculationTime: {
    label: 'KPI起算结束时间',
    component: TimePicker2,
    required: true,
    attrs: {
        format: 'HH:mm:ss'
    }
  },

  // kpiEndOperation: {
  //   label: 'KPI止算时间',
  //   component: ASelect,
  //   required: true,
  //   attrs: {
  //       getOptions: async() => {
  //           return kpiEndOperationOptions
  //       }
  //   }
  // },
}