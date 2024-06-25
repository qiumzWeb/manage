import React from 'react';
import { ASelect, Button, Message, AFormTable, NumberPicker  } from '@/component';
import $http from 'assets/js/ajax'
import { transMultipleToStr, isJSON } from 'assets/js'
import API from 'assets/api'
import { getStepBaseData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { getCountry, packageTypeOptions } from '@/report/apiOptions'
import { getServiceTypeOptions } from '@/pages/warehouseConfiguration/warehouseConfig/step30/config'
import { getVirtualWarehouseList } from '@/pages/warehouseConfiguration/warehouseConfig/step20/config'
const isEditable = () => !getStepBaseData().readOnly
const isTMall = () => getStepBaseData().isTMall
// 获取入库匹配列表
export function getInstockConfigList(data) {
  return $http({
    url: '/sys/instockConfig/list',
    method: 'get',
    data: {
      pageNum: 1,
      pageSize: 1000,
      ...data,
    }
  }).then(res => {
    return res && res.data || []
  }).catch(e => {
    Message.error(e.message);
    return []
  })
}


// 重量规则
export const weightRuleOption = [{label: '重量', value: '1'}]

// 重量规则单位
export const weightRuleUnitOption = [{label: '克（g）', value: '1'}]

// 体积规则
export const volumeRuleOption = [
  {"label": "长", "value": "1"},
  {"label": "宽", "value": "2"},
  {"label": "高", "value": "3"},
  {"label": "三边和", "value": "4"}
]

// 体积规则
export const volumeUnitOption = [{"label": "厘米（cm）", "value": "1"}]

// 规则 条件
export const RuleConditionOption = [
  {"label": "小于", "value": "<"},
  {"label": "小于等于", "value": "<="},
  {"label": "大于", "value": ">"},
  {"label": "大于等于", "value": ">="}
]

// 是否配置
export const isTrueOrNotOption = [
  { label: '是', value: '1' },
  { label: '否', value: '0' }
]

// 是否配置
export const isTrueOrNotOptionNum = [
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]

// 特殊标记配置
export const specialPackageFlagOption = [
  { label: '直邮', value: 2 },
  { label: '包包计划', value: 1 },
  { label: '无', value: 0 }
];

// 包裹属于配置
export const packagePropsOption = [
  { label: '无需判断', value: 0 },
  { label: '大包', value: 1 },
  { label: '中包', value: 3 },
  { label: '小包', value: 2 }
]


// 基础信息
export const baseInfo = {
  vwhCode: {
    label: '虚仓名称',
    component: ASelect,
    format: transMultipleToStr,
    disabled: data => data.readOnly,
    show: () => isTMall(),
    attrs: {
      mode: 'multiple',
      getOptions: async() => {
        const baseData = getStepBaseData()
        const res = await getVirtualWarehouseList({
          warehouseId: baseData.warehouseId,
          companyId: baseData.companyId
        })
        return res.map(r => ({
          ...r,
          label: r.virtualWarehouseName,
          value: r.virtualWarehouseCode
        }))
      }
    }
  },
  serviceType: {
    label: '业务类型',
    component: ASelect,
    disabled: data => data.readOnly,
    required: true,
    attrs: {
      showSearch: true,
      getOptions: async() => {
        return await getServiceTypeOptions
      }
    }
  },
  countryArea: {
    label: '国家',
    required: true,
    component: ASelect,
    disabled: data => data.readOnly,
    attrs: {
      showSearch: true,
      mode: 'multiple',
      getOptions: async() => {
        return await getCountry
      }
    }
  },
  packageType: {
    label: '包裹属性',
    disabled: data => data.readOnly,
    component: ASelect,
    required: true,
    attrs: {
      getOptions: async() => packagePropsOption,
      onChange: (val, vm) => {
        vm.setOpenData({
          packageType: val
        })
      }
    }
  },
  labelWidth: {
    label: '标签宽度(cm)',
    component: NumberPicker,
    disabled: data => data.readOnly,
    required: true,
    attrs: {
      min: 0,
      max: 1000
    }
  },
  labelHeight: {
    label: '标签高度(cm)',
    component: NumberPicker,
    disabled: data => data.readOnly,
    required: true,
    attrs: {
      min: 0,
      max: 1000
    }
  },
  labelUrl: {
    label: '标签URL',
    fixedSpan: 24,
    disabled: data => data.readOnly,
    required: true,
    attrs: {
      placeholder: '请输入正确的Url地址'
    }
  },
  needWeight: {
    label: '需要称重',
    disabled: data => data.readOnly,
    component: ASelect,
    required: true,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOption
    }
  },
}
// 校验规则配置
export const InstoreRuleInfo = [
{
  directLargeIntercept: {
    label: '直邮大包拦截入库',
    required: true,
    component: ASelect,
    show: data => isTMall() && data.packageType == 1,
    disabled: data => data.readOnly,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOptionNum
    }
  },
  isAutoSign: {
    label: '手动入库自动签收',
    tips: '手动入库时对未签收的小包做自动签收处理',
    component: ASelect,
    disabled: data => data.readOnly,
    required: true,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOptionNum
    }
  },
},
{
  validWeight: {
    label: '是否校验重量',
    component: ASelect,
    required: true,
    disabled: data => data.readOnly,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOption
    }
  },
  // validWeightType: {
  //   label: '特殊包裹标记(重量) - 都 不要',
  //   component: ASelect,
  //   required: true,
  //   show: data => data.validWeight == 1,
  //   disabled: data => data.readOnly,
  //   attrs: {
  //     mode: 'multiple',
  //     getOptions: async() => specialPackageFlagOption
  //   }
  // },
  validWeightRule: {
    label: '',
    show: data => data.validWeight == 1,
    component: AFormTable,
    format: function (val, { action }) {
      const result = {
        inset: typeof val === 'string' && isJSON(val) &&  JSON.parse(val) || [],
        output: Array.isArray(val) && JSON.stringify(val) || ''
      }
      return result[action]
    },
    span: 24,
    attrs: {
      hasAdd: isEditable,
      maxLength: 100,
      defaultData: {
        ruleField: '1',
        ruleUnit: '1'
      },
      columns: {
        ruleField: {
          title: '重量规则字段',
          required: true,
          edit: isEditable,
          component: ASelect,
          attrs: {
            getOptions: async() => weightRuleOption
          }
        },
        ruleCondition: {
          title: '重量规则条件',
          required: true,
          edit: isEditable,
          component: ASelect,
          attrs: {
            getOptions: async() => RuleConditionOption
          }
        },
        ruleValue: {
          title: '重量规则值',
          edit: isEditable,
          required: true,
        },
        ruleUnit: {
          title: '重量规则单位',
          edit: isEditable,
          required: true,
          component: ASelect,
          attrs: {
            getOptions: async() => weightRuleUnitOption
          }
        }
      }
    }
  },
  validVolume: {
    label: '是否校验体积',
    component: ASelect,
    required: true,
    disabled: data => data.readOnly,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOption
    }
  },
  // validVolumeType: {
  //   label: '特殊包裹标记(体积) - 都不要',
  //   component: ASelect,
  //   required: true,
  //   show: data => data.validVolume == 1,
  //   disabled: data => data.readOnly,
  //   attrs: {
  //     mode: 'multiple',
  //     getOptions: async() => specialPackageFlagOption
  //   }
  // },
  validVolumeRule: {
    label: '',
    component: AFormTable,
    show: data => data.validVolume == 1,
    format: function (val, { action }) {
      const result = {
        inset: typeof val === 'string' && isJSON(val) &&  JSON.parse(val) || [],
        output: Array.isArray(val) && JSON.stringify(val) || ''
      }
      return result[action]
    },
    span: 24,
    attrs: {
      hasAdd: isEditable,
      maxLength: 100,
      defaultData: {
        ruleUnit: '1'
      },
      // 体积规则
      columns: {
        ruleField: {
          title: '体积规则字段',
          required: true,
          edit: isEditable,
          component: ASelect,
          attrs: {
            getOptions: async() => volumeRuleOption
          }
        },
        ruleCondition: {
          title: '体积规则条件',
          required: true,
          edit: isEditable,
          component: ASelect,
          attrs: {
            getOptions: async() => RuleConditionOption
          }
        },
        ruleValue: {
          title: '体积规则值',
          edit: isEditable,
          required: true,
        },
        ruleUnit: {
          title: '体积规则单位',
          edit: isEditable,
          required: true,
          component: ASelect,
          attrs: {
            getOptions: async() => volumeUnitOption
          }
        }
      }
    }
  }
}
]

// 入库提示
export const instoreTipsInfo = {
  alertDivision: {
    label: '国家或者地区显示',
    component: ASelect,
    disabled: data => data.readOnly,
    span: 6,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOption
    }
  },
  alertService: {
    label: '业务类型显示',
    component: ASelect,
    disabled: data => data.readOnly,
    span: 6,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOption
    }
  },
  alertElectric: {
    label: '是否带电显示',
    component: ASelect,
    disabled: data => data.readOnly,
    span: 6,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOption
    }
  },
  alertResult: {
    label: '入库推荐结果显示',
    component: ASelect,
    disabled: data => data.readOnly,
    span: 6,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOption
    }
  },
  alertDivisionSpecial: {
    label: '国家或者地区特殊显示',
    component: ASelect,
    disabled: data => data.readOnly,
    span: 6,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOption
    }
  },
  alertServiceSpecial: {
    label: '业务类型特殊显示',
    component: ASelect,
    disabled: data => data.readOnly,
    span: 6,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOption
    }
  },
  alertElectricSpecial: {
    label: '是否带电特殊显示',
    component: ASelect,
    disabled: data => data.readOnly,
    span: 6,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOption
    }
  },
  alertResultSpecial: {
    label: '入库推荐结果特殊显示',
    component: ASelect,
    disabled: data => data.readOnly,
    span: 6,
    attrs: {
      isRadio: true,
      getOptions: async() => isTrueOrNotOption
    }
  },

}