import React from 'react';
import { ASelect, TimePicker2, NumberPicker, AFormTable, Message } from '@/component';
import { getWid } from 'assets/js';
import { getBigJobTeamGroup } from '../api'
import { timeTypeOptions } from '@/report/options';
// 总计划

export const TotalModel = {
  dynamicPlanInstock: {
    label: '动态计划入库',
    component: NumberPicker,
    attrs: {
      min: 0
    }
  },
  dynamicPlanMerge: {
    label: '动态计划合箱',
    component: NumberPicker,
    attrs: {
      min: 0
    }
  },
  dynamicPlanEffect: {
    label: '动态计划人效',
    component: NumberPicker,
    attrs: {
      min: 0
    }
  },
  dynamicPlanWorkingHours: {
    label: '动态计划综合工时',
    component: NumberPicker,
    attrs: {
      min: 0
    }
  },
}




// 子计划
export const base2Model = {
  upphSubDynamicSign: {
    label: '签收动态计划量配置值',
    component: NumberPicker,
    attrs: {
      min: 0,
      precision: 2
    }
  },
  upphSubDynamicManualInstock: {
    label: '人工分拣动态计划量配置值',
    component: NumberPicker,
    attrs: {
      min: 0,
      precision: 2
    }
  },
  upphSubDynamicAutoInstock: {
    label: '自动分拣动态计划量配置值',
    component: NumberPicker,
    attrs: {
      min: 0,
      precision: 2
    }
  },
  upphSubDynamicPackBag: {
    label: '收包动态计划量配置值',
    component: NumberPicker,
    attrs: {
      min: 0,
      precision: 2
    }
  },
  upphSubDynamicOnShelve: {
    label: '上架动态计划量配置值',
    component: NumberPicker,
    attrs: {
      min: 0,
      precision: 2
    }
  },
  upphSubDynamicOffShelve: {
    label: '下架动态计划量配置值',
    component: NumberPicker,
    attrs: {
      min: 0,
      precision: 2
    }
  },
  upphSubDynamicSorting: {
    label: '播种动态计划量配置值',
    component: NumberPicker,
    attrs: {
      min: 0,
      precision: 2
    }
  },
  upphSubDynamicMerge: {
    label: '合箱动态计划量配置值',
    component: NumberPicker,
    attrs: {
      min: 0,
      precision: 2
    }
  },
}



// 批次发运
export const base3Model = {
  disWarehouseDeliveryTime: {
    label: '分拨仓发货时间',
    component: TimePicker2,
    timeFormat: 'HH:mm:ss',
  }
}


// 异常预警
export const base4Model = [{
  orderFlowRateProductConfigList: {
    label: '',
    component: AFormTable,
    span: 12,
    attrs: {
      hasAdd: true,
      maxLength: 50,
      beforeAdd: (record, index, tableData, tableFields) => {
        if (tableData[0].largeJobTeamGroupId == getWid()) {
          Message.warning('选择全仓后只能配置一条产能配置')
          return false
        }
      },
      columns: {
        largeJobTeamGroupId: {
          title: '大组',
          component: ASelect,
          attrs: {
            formatOptions: (val, options, field, {fields, ...props}) => {
              return options.map(o => ({
                ...o,
                disabled: (val == getWid() && o.value !== getWid()) || (fields.length > 1 && o.value == getWid())
              }))
            },
            getOptions: async (props) => {
              const initOptions = [{
                label: '全仓',
                value: getWid()
              }]
              try {
                const options = await getBigJobTeamGroup({
                  warehouseId: getWid()
                })
                return initOptions.concat(options || [])
              } catch (e) {
                return initOptions
              }
            }
          },
          edit: true,
        },
        productionValue: {
          title: '产能',
          edit: true
        }
      }
    }
  }
}]


// UPPH
export const base5Model = {
  upphCalculateStartTime: {
    label: '工作起止时间',
    component: TimePicker2.RangePicker,
    useDetailValue: true,
    fixedSpan: 18,
    transTimeCode: ['upphCalculateStartTime', 'upphCalculateEndTime'],
    format: ['HH:mm:ss', 'HH:mm:ss'],
  },
  morningWorkTimeStart: {
    label: '早班起止时间',
    component: TimePicker2.RangePicker,
    useDetailValue: true,
    fixedSpan: 18,
    transTimeCode: ['morningWorkTimeStart', 'morningWorkTimeEnd'],
    format: ['HH:mm:ss', 'HH:mm:ss'],
  },
  middleWorkTimeStart: {
    label: '中班起止时间',
    component: TimePicker2.RangePicker,
    useDetailValue: true,
    fixedSpan: 18,
    transTimeCode: ['middleWorkTimeStart', 'middleWorkTimeEnd'],
    format: ['HH:mm:ss', 'HH:mm:ss'],
  },
  nightWorkTimeStart: {
    label: '晚班起止时间',
    component: TimePicker2.RangePicker,
    useDetailValue: true,
    fixedSpan: 18,
    transTimeCode: ['nightWorkTimeStart', 'nightWorkTimeEnd'],
    format: ['HH:mm:ss', 'HH:mm:ss'],
  },

  // startCalculationTime: {
  //   label: '开始时间类型',
  //   component: ASelect,
  //   attrs: {
  //     getOptions: async() => {
  //       return timeTypeOptions
  //     }
  //   }
  // },
  // upphCalculateStartTime: {
  //   label: '开始时间',
  //   component: TimePicker2,
  //   timeFormat: 'HH:mm:ss',
  // },
  // endCalculationTime: {
  //   label: '结束时间类型',
  //   component: ASelect,
  //   attrs: {
  //     getOptions: async() => {
  //       return timeTypeOptions
  //     }
  //   }
  // },
  // upphCalculateEndTime: {
  //   label: '结束时间',
  //   component: TimePicker2,
  //   timeFormat: 'HH:mm:ss',
  // },
}