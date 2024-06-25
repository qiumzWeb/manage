import React from 'react'
import { TimePicker2, NumberPicker  } from '@/component'
import ASelect from '@/component/ASelect/index'
import { kpiAchieveDateOptions, kpiEndOperationOptions } from '@/report/options'

const kpiRuleUnitOptions = [
    {"label": "时间", "value": "1"},
    {"label": "小时", "value": "2"},
    {"label": "分钟", "value": "3"}
]
export default {
  kpiEndOperation: {
    label: 'KPI止算时间类型',
    component: ASelect,
    required: true,
    attrs: {
        getOptions: async() => {
            return kpiEndOperationOptions
        }
    }
  },
  kpiRuleField: {
    label: '规则字段',
    component: ASelect,
    required: true,
    attrs: {
        getOptions: async() => {
            return kpiAchieveDateOptions
        }
    }
  },
  kpiRuleCondition: {
    label: '规则条件',
    required: true,
    component: ASelect,
    attrs: {
        getOptions: async() => {
            return [
                {label: '等于', value: '='},
                {label: '加', value: '+'}
            ]
        }
    }
  },
  kpiRuleUnit: {
    label: '规则值单位',
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => {
        return kpiRuleUnitOptions
      }
    }
  },
  kpiRuleValue1: {
    label: '规则值',
    component: TimePicker2,
    required: true,
    show: data => data.kpiRuleUnit == '1',
    defaultValue: '00:00:00',
    attrs: {
      format: 'HH:mm:ss',
    }
  },
  kpiRuleValue2: {
    label: '规则值',
    required: true,
    show: data => data.kpiRuleUnit != '1',
    component: NumberPicker,
    attrs: {
      placeholder: '请输入',
    }
  },
}