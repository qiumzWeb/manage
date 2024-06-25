import React from 'react'
import { Input, NumberPicker } from '@/component'
import ASelect from '@/component/ASelect'
import AFormTable from '@/component/AFormTable/index'
import { pOptions, vOptions, noShelvsOptions, flashSowOptions, opOptions, qSearch, defaultConds, nameOptions, qSortingType, getSlotNo } from '../config/planConfig'
import { deepAssign, deepClone, isTrue } from 'assets/js'
import $http from 'assets/js/ajax';
// 查询接口
export const searchUrl = '/warehouses/${warehouseId}/sorting-solutions/details/list?solutionId=${id}'

export const bindContainerNoOptions = [{ label: '是', value: true }, { label: '否', value: false }]
const opKey = '_op'
// 将修改details 数据 转换成 conds 字段数据
export function getContsData(d) {
  const c = {}
  console.log(d, '99999')
  Object.entries(d).forEach(([k, v]) => {
    if (nameOptions.some(n => k.startsWith(n.value))) {
      const key = k.split(opKey)[0]
      if (!d.hasOwnProperty(key)) return;
      if (!c[key]) {
        c[key] = {}
      }
      if (k.endsWith(opKey)) {
        c[key]['op'] = v
      } else {
        c[key]['name'] = key
        c[key]['v'] = v
      }
    }
  })
  return Object.values(c)
}
// 将 conds 数据转化成 details 格式数据
export function getDetailsData(d) {
  const data = {}
  Array.isArray(d.conds) && d.conds.forEach(c => {
    data[c.name] = c.v
    data[c.name + opKey] = c.op
  })
  return data
}
// 列表
export const tColumns = {
  name: {
    title: '规则名称',
  },
  bindContainerNo: {
    title: '是否需要绑定容器-RFID卡片',
    cell: (val) => <ASelect isDetail value={val} getOptions={async () => bindContainerNoOptions}></ASelect>
  },
  slotNo: {
    title: '格口号',
  },
  slotPriority: {
    title: '格口优先级'
  },
  gmtCreate: {
    title: '创建时间',
    width: 200
  },
  gmtModified: {
    width: 200,
    title: '修改时间',
  },
  make: {
    title: '操作'
  }
}

// 新增修改

// 基本信息
// 规则展示信息
export const baseViewConfig = deepAssign({}, deepClone(qSearch), {
  warehouseId: { disabled: true },
  solutionName: { disabled: true },
  status: { disabled: true },
  sortingType: { disabled: true },
})
// 修改配置
export const baseModel = [
  { ...baseViewConfig },
  {
    name: {
      label: '规则名称',
      required: true,
    },
    bindContainerNo: {
      label: '是否需要绑定容器-RFID卡片',
      required: true,
      component: ASelect,
      defaultValue: false,
      attrs: {
        getOptions: async () => {
          return bindContainerNoOptions
        }
      },
    },
    isFlowpickDeviceBinded: {
      label: '是否关联闪电播区域',
      required: true,
      component: ASelect,
      defaultValue: true,
      show: data => ['MACHINE_BELT'].includes(data.sortingType),
      attrs: {
        getOptions: async() => bindContainerNoOptions
      }
    },
    slotNo: {
      label: '格口号',
      required: true,
      expandKeys: ['slot'],
      component: React.forwardRef(function Com(props){
        const { field } = props
        const { sortingType, warehouseId, projectId } = field.getValues()
        const isFlashSow = flashSowOptions.map(f => f.value).includes(sortingType)
        let options = []
        if (isFlashSow) {
          return <ASelect showSearch {...props} getOptions={async() => {
            options = await getSlotNo({sortingType, warehouseId, projectId})
            return options
          }} onChange={(val, ...args) => {
            typeof props.onChange === 'function' && props.onChange(val, ...args);
            field.setValue('slotNo', val);
            field.setValue('slot', (options.find(o => o.code == val) || {}));
          }}></ASelect>
        } else {
          return <Input {...props}></Input>
        }
      }),
      attrs: {
        watchKey: 'warehouseId,sortingType'
      },
    },
    packageLimit: {
      label: '数量上限',
      required: data => !flashSowOptions.map(f => f.value).includes(data.sortingType),
      show: (data) => {
        return (data.sortingType == 1 && data.bindContainerNo) || flashSowOptions.map(f => f.value).includes(data.sortingType);
      },
      component: NumberPicker,
      attrs: {
        min: 0,
        max: 99999999
      }
    },
    slotPriority: {
      label: '格口优先级',
      required: true,
      show: data => noShelvsOptions.map(n => n.value).includes(data.sortingType),
      component: NumberPicker,
      attrs: {
        precision: 0,
        min: 1
      }
    },
    isAutoSortReport: {
      label: '是否自动集包',
      reuqired: true,
      show: data => flashSowOptions.map(f => f.value).includes(data.sortingType),
      component: ASelect,
      defaultValue: false,
      attrs: {
        getOptions: async() => bindContainerNoOptions
      }
    }
  }
]
let rulesData = {}

// 显示无货架选项
function isNoShelf(data) {
  return noShelvsOptions.some(n => n.value == rulesData.sortingType)
}

// 是否为传送带模式
function isFlashSow() {
  return rulesData.sortingType === 'MACHINE_BELT'
}
// 配置规则
export const rulesModel = {
  details: {
    label: '',
    component: React.forwardRef(function App(props, ref) {
      const sortingType = props.field && props.field.getValue('sortingType')
      // {label: '无货架粗分一', value: 'NONE_SHELVES_INITIAL'},
      // {label: '无货架粗分二', value: 'NONE_SHELVES_SECOND'},
      // {label: '无货架细分', value: 'NONE_SHELVES_FINAL'},
      // 以上三种情况 不可以新增多条
      const hasAdd = !!qSortingType.find(q => q.value == sortingType && q.isMoreRule)
      return <AFormTable {...props} hasAdd={hasAdd} ref={ref}></AFormTable>
    }),
    show: data => rulesData = data,
    span: 24,
    attrs: {
      onlyNeedShowKey: true,
      defaultData: (index) => ({ p: index + 1, ...getDetailsData({ conds: defaultConds }) }),
      maxLength: 20,
      columns: {
        // p: {
        //   title: '优先级',
        //   required: true,
        //   width: 130,
        //   edit: true,
        //   component: ASelect,
        //   show: () => !isFlashSow(),
        //   attrs: {
        //     getOptions: async () => {
        //       return pOptions
        //     }
        //   }
        // },
        store_no: {
          title: '集运仓库区(支持多个)',
          required: true,
          width: 400,
          edit: true,
          show: () => !isFlashSow(),
          component: getDefineComponent('store_no_op', Input),
          attrs: {
            placeholder: '支持填写多个库区，逗号隔开',
          }
        },
        is_tail: {
          title: '是否尾包',
          required: true,
          width: 220,
          edit: true,
          show: () => !isFlashSow(),
          component: getDefineComponent('is_tail_op'),
          attrs: {
            getOptions: async () => {
              return vOptions
            }
          }
        },
        is_single_tail: {
          title: '是否单包尾包',
          required: true,
          width: 220,
          edit: true,
          show: () => !isFlashSow(),
          component: getDefineComponent('is_single_tail_op'),
          attrs: {
            getOptions: async () => {
              return vOptions
            }
          }
        },
        is_outstock_pkg: {
          title: '是否已有出库订单',
          width: 220,
          edit: true,
          required: true,
          show: isNoShelf,
          component: getDefineComponent('is_outstock_pkg_op'),
          attrs: {
            getOptions: async () => {
              return vOptions
            }
          }
        },
        is_exception_pkg: {
          title: '是否异常包裹',
          width: 220,
          edit: true,
          required: true,
          show: isNoShelf,
          component: getDefineComponent('is_exception_pkg_op'),
          attrs: {
            getOptions: async () => {
              return vOptions
            }
          }
        },
        flowPick_device_no: {
          title: '闪电播设备号',
          width: 200,
          edit: true,
          required: true,
          show: isFlashSow,
          attrs: {
            onChange: (val, index, field) => {
              field.setValue('flowPick_device_no_op', 'eq')
            }
          }
        },
        rfid_prefix: {
          title: '容器号前缀(RFID)',
          width: 200,
          edit: true,
          required: true,
          show: isFlashSow,
          attrs: {
            onChange: (val, index, field) => {
              field.setValue('rfid_prefix_op', 'eq')
            }
          }
        }
      }
    },
  },
}


// 规则组件
function getDefineComponent(key, Com = ASelect) {
  return React.forwardRef(function (props, ref) {
    const { field } = props
    const value = field.getValue(key)
    return <div ref={ref} style={{ display: 'flex' }}>
      <ASelect style={{ width: 80 }} value={value} getOptions={async () => {
        return opOptions
      }} onChange={(val) => {
        field.setValue(key, val)
      }} hasClear={false}></ASelect>
      <Com {...props}></Com>
    </div>
  })
}
