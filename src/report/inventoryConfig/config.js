import React from 'react'
import $http from 'assets/js/ajax'
import ASelect from '@/component/ASelect'
import { DatePicker2, NumberPicker } from '@/component';
import { getWid, isEmpty, getStringCodeToArray } from 'assets/js'
import { Input } from '@/component'
import API from 'assets/api'
import dayjs from 'dayjs'


// 查询接口
export const searchUrl = '/sys/cycleCountConfig/pageConfig'

// 新增接口
export const addUrl = '/sys/cycleCountConfig/newConfig'

// 修改接口 
export const modifyUrl = '/sys/cycleCountConfig/updConfig'

// 删除接口
export const deleteUrl = '/sys/cycleCountConfig/delConfig/'



export const getDictionaryData = (warehouseId) => new Promise(resolve => {
  $http({
    url: API.getDistrictScopeList,
    method: 'get',
    data: {
      districtType: '2',
      warehouseId
    }
  }).then(data => {
    let list = data && data.data || []
    resolve(list.map(l => ({
      ...l,
      value: l.code,
      label: l.name
    })))
  })
})




// 是否 选项
const yesNoType = [
  { "label": "否", "value": 0 },
  { "label": "是", "value": 1 }
];

// 是否 选项
const switchType = [
  { "label": "禁用", "value": 0 },
  { "label": "启用", "value": 1 }
];

// 重复盘点
const repeatCountType = [
  { "label": "全部盘点", "value": 0 },
  { "label": "不盘7天内已盘点库位", "value": 1 },
  { "label": "不盘15天内已盘点库位", "value": 2 },
  { "label": "不盘30天内已盘点库位", "value": 3 },
];

// 时间类型
const inTimeType = [
  { "label": "小时", "value": 0 },
  { "label": "天", "value": 1 }
];

// 查询的字段
export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      attrs: {
        // 是否可以清空
        hasClear: false
      }
    }
  }
]

// 列表
export const tColumns = {
  warehouseName: {
    // 列名
    title: '仓库名称',
    // 固定
    lock: 'left'
  },
  name: {
    title: '配置名称',
  },
  cycleCountRangeName: {
    title: '抽盘库区',
  },
  cycleCountRate: {
    title: '抽盘比例(%)',
    // 列宽度
    width: 100,
  },
  cycleCountMaxPositions: {
    title: '最大库位数',
    width: 110,
  },
  genCycleTime: {
    title: '循环抽盘周期',
    width: 120,
  },
  repeatType: {
    title: '重复盘点',
    width: 100,
    cell: val => <ASelect value={val} getOptions={async () => repeatCountType} defaultValue="-" isDetail></ASelect>
  },
  emptyPositionEnable: {
    title: '是否包含空库位',
    width: 140,
    cell: val => <ASelect value={val} getOptions={async () => yesNoType} defaultValue="-" isDetail></ASelect>
  },
  status: {
    title: '配置开关',
    width: 90,
    cell: val => <ASelect value={val} getOptions={async () => switchType} defaultValue="-" isDetail></ASelect>
  },
  startEffectiveTime: {
    title: '配置生效时间',
    width: 180,
  },
  updaterName: {
    title: '操作人',
    width: 90,
  },
  gmtModified: {
    title: '更新时间',
    width: 180,
  },
  make: {
    title: '操作',
    lock: 'right'
  }
}

// 新增修改
export const groupModel = {
  invConfig: {
    model: {
      warehouseId: {
        // 名称
        label: '仓库名称',
        // 默认值
        defaultValue: getWid(),
        // 是否必填
        required: false,
        // 组件
        component: ASelect,
        disabled: data => !data.isAdd,
        attrs: {
          hasClear: false,
          onChange: (val, vm, action) => {
            vm.setOpenData({ invConfig: val })
            if (action) {
              vm.field.setValue('cycleCountRange', [])
            }
          }
        }
      },
      name: {
        label: '配置名称',
        required: true,
      },
      cycleCountRange: {
        label: '抽盘库区(多选)',
        component: ASelect,
        required: true,
        format: (val, { action }) => {
          const result = {
            inset: typeof val === 'string' && val.split(',') || [],
            output: Array.isArray(val) && val.join() || ''
          }
          return result[action]
        },
        attrs: {
          getOptions: async ({ field }) => {
            const warehouseId = field.getValue('warehouseId')
            const list = await getDictionaryData(warehouseId)
            return list
          },
          mode: "multiple",
          showSearch: true,
          watchKey: 'warehouseId'
        }
      },
      cycleCountRate: {
        label: '抽盘库位比例(%)',
        component: NumberPicker,
        required: true,
        attrs: {
          hasTrigger: false,
          precision: 2,
          min: 0,
          max: 100
        }
      },
      cycleCountMaxPositions: {
        label: '最大库位数',
        component: NumberPicker,
        required: true,
        attrs: {
          precision: 0,
          min: 0,
          max: 99999999
        }
      },
      emptyPositionEnable: {
        label: '是否包含空库位',
        component: ASelect,
        required: true,
        attrs: {
          getOptions: async () => {
            return yesNoType;
          },
        }
      },
      repeatType: {
        label: '重复盘点',
        component: ASelect,
        required: true,
        attrs: {
          getOptions: async () => {
            return repeatCountType;
          }
        }
      }
    },
  },
  inConfig: {
    title: '入库抽盘周期',
    model: {
      inboundTimeType: {
        label: '时间类型',
        component: ASelect,
        attrs: {
          getOptions: async () => {
            return inTimeType
          }
        }
      },
      inboundTimeCycle: {
        label: '入库抽盘周期',
        component: NumberPicker,
        attrs: {
          hasTrigger: false,
          precision: 2,
          min: 0,
          max: 99999999
        }
      }
    }
  },
  outConfig: {
    title: '出库抽盘周期',
    model: {
      outboundTimeType: {
        label: '时间类型',
        component: ASelect,
        attrs: {
          getOptions: async () => {
            return inTimeType
          }
        }
      },
      outboundTimeCycle: {
        label: '出库抽盘周期',
        component: NumberPicker,
        attrs: {
          hasTrigger: false,
          precision: 2,
          min: 0,
          max: 99999999
        }
      }
    }
  },
  cycleConfig: {
    model: {
      genCycleTime: {
        label: '循环抽盘周期(天)',
        component: NumberPicker,
        required: true,
        attrs: {
          hasTrigger: false,
          min: 0,
          max: 99999999
        }
      },
      startEffectiveTime: {
        label: '配置生效时间',
        component: DatePicker2,
        required: true,
        format: (val, { action }) => {
          const result = {
            inset: dayjs(val),
            output: val && val.format && val.format('YYYY-MM-DD HH:mm:ss')
          }
          return result[action]
        },
        attrs: {
          showTime: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        }
      },
      status: {
        label: '开关',
        component: ASelect,
        required: true,
        attrs: {
          getOptions: async () => {
            return switchType
          }
        }
      }
    }
  }
}
