import React from 'react';
import { ASelect, NumberPicker, DatePicker2, Message, AFormTable } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils';
// 查询接口
export const searchApiUrl = '/delay/package/report/summary'

// 配置提交
export function getStatusModify(data) {
  return $http({
    url: '/delay/package/config/add',
    method: 'post',
    data
  })
}

// 配置查询
export function getConfigData() {
  return $http({
    url: `/delay/package/config/list`,
    method: 'get',
    data: {warehouseId: getWid()}
  })
}


// 统计维度
export const statusTypeOptions = [
  {label: '包裹', value: 'P'},
  {label: '订单',  value: 'O'},
]

// 包裹状态
export const packageStatusOptions = [
  {label: '待签收（已生成）', value: '1'},
  {label: '待入库（已签收）',  value: '5'},
  {label: '待上架（已入库）', value: '10'},
  {label: '待下架（已上架）', value: '15'}
]

// 订单状态
export const orderStatusOptions = [
  {label: '待播种（已下架）', value: '15'},
  {label: '待合箱（已分拨）',  value: '18'},
  {label: '待合板（已合箱打单）', value: '20'},
  {label: '待出库（已码板/装袋）', value: '25'},
  {label: '待合板（已称重校验）', value: '23'}
]


export const qSearch = {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      attrs: {
        hasClear: false
      }
    },
    delayCalculateTime: {
      label: '统计时间',
      fixedSpan: 20,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      useDetailValue: true,
      transTimeCode: ['startDateTime', 'endDateTime'],
      attrs: {
        hasClear: false,
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true
      }
    },
    statusType: {
      label: '统计维度',
      component: ASelect,
      defaultValue: 'O',
      attrs: {
        hasClear: false,
        getOptions: async() => statusTypeOptions,
        onChange: (val, vm, action) => {
          if (action) {
            vm.field.setValue('status', '')
          }
        }
      }
    },
    status: {
      label: '状态',
      component: ASelect,
      attrs: {
        watchKey: 'statusType',
        getOptions: async({field}) => {
          const type = field.getValue('statusType')
          const options = {
            O: orderStatusOptions,
            P: packageStatusOptions
          }
          return options[type] || []
        }
      }
    }
  }

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => getWName(val) || '-'
  },
  calculateDateRange: {
    title: ' 统计时间',
  },
  type: {
    title: '统计维度',
    cell: val => <ASelect value={val} isDetail getOptions={async() => statusTypeOptions} defaultValue="-"></ASelect>
  },
  status: {
    title: '状态',
  },
  delayNum: {
    title: '滞留数量',
  },
  totalNum: {
    title: '总数量',
  },
  delayPercent: {
    title: '滞留比(%)',
  }
}


// 配置
export const formConfigModel = {
  configList: {
    label: '',
    component: AFormTable,
    span: 24,
    attrs: {
      hasAdd: true,
      maxLength: 50,
      columns: {
        statusType: {
          title: '统计维度',
          component: ASelect,
          required: true,
          edit: true,
          attrs: {
            getOptions: async() => statusTypeOptions,
            onChange: (val, index, field, fields, action) => {
              if (action) {
                field.setValue('status', '')
              }
            }
          }
        },
        status: {
          title: '状态',
          component: ASelect,
          required: true,
          edit: true,
          attrs: {
            watchKey: 'statusType',
            formatOptions: (val, options, field, {fields}) => {
              const statusType = field.getValue('statusType');
              const hasSelected = fields && fields.filter(f=> f.getValue('statusType') == statusType).map(f => f.getValue('status')) || []
              return options.map(o => ({
                ...o,
                disabled: hasSelected.some(h => h == o.value)
              }))
            },
            getOptions: async ({ field, fields }) => {
              const type = field.getValue('statusType')
              const options = {
                O: orderStatusOptions,
                P: packageStatusOptions
              }
              return options[type] || []
            },
          }
        },
        delayCalculateTime: {
          title: '滞留起算时长（分钟）',
          component: NumberPicker,
          required: true,
          edit: true,
          attrs: {
            min: 0,
          }
        }
      }
    }
  }
}