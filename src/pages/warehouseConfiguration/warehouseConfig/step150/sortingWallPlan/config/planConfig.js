import { Input, Select } from '@/component'
import ASelect from '@/component/ASelect/index'
import {deepAssign, deepClone, getWid, _getName} from 'assets/js'
export const qStatus = ['禁用', '启用']
/**
 * @params  isMoreRule 是否可以新增多条规则
 *  @params  isShowEachSlotOrderCount 是否需要填写单格口订单数
 */
export const noShelvsOptions = [
  {label: '无货架粗分一', value: 'NONE_SHELVES_INITIAL', isMoreRule: false, isShowEachSlotOrderCount: true, isDisabled: true},
  {label: '无货架粗分二', value: 'NONE_SHELVES_SECOND', isMoreRule: false, isShowEachSlotOrderCount: true, isDisabled: true},
  {label: '无货架细分', value: 'NONE_SHELVES_FINAL', isMoreRule: false, isShowEachSlotOrderCount: true, isDisabled: true},
  {label: '无货架入库分拣', value: 'NONE_SHELVES_INSTOCK', isMoreRule: true, isShowEachSlotOrderCount: false, isDisabled: true},
]
export const qSortingType = [
  {label: '细分', value: '1', isMoreRule: true, isShowEachSlotOrderCount: false, isDisabled: false},
  {label: '粗分', value: '2', isMoreRule: true, isShowEachSlotOrderCount: false, isDisabled: false},
  ...noShelvsOptions
]
export const qSearch = {
  warehouseName: {
    label: '仓库名称',
    disabled: true,
  },
}

export const commonConfig = {
  solutionName: {
    label: '分拣计划名称',
    component: Input,
    required: true,
    attrs: {
      placeholder: '请输入'
    }
  },
  status: {
    label: '状态',
    component: Select,
    required: true,
    attrs: {
      style: {
        width: '100%'
      },
      dataSource: ([{label: '全部', value: ''}]).concat(qStatus.map((val, index) => ({ label: val, value: index})))
    }
  },
  sortingType: {
    label: '分拣类型',
    component: Select,
    required: true,
    disabled: (data) => {
      return (!data.isAdd && (!!qSortingType.find(q => q.value == data.sortingType && q.isDisabled)))
    },
    attrs: {
      style: {
        width: '100%'
      },
      dataSource: qSortingType
    }
  }
}

export const formModel = {
  ...deepAssign({...qSearch}, deepClone(commonConfig), {
    eachSlotOrderCount: {
      label: '单格口订单数',
      required: true,
      show: data => !!qSortingType.find(q => q.value == data.sortingType && q.isShowEachSlotOrderCount),
      // 必填项
      // {label: '无货架粗分一', value: 'NONE_SHELVES_INITIAL'},
      // {label: '无货架粗分二', value: 'NONE_SHELVES_SECOND'},
      // {label: '无货架细分', value: 'NONE_SHELVES_FINAL'},
    }
  })
}

export const tColumns = {
  solutionName: {
    title: '分拣计划名称'
  },
  status: {
    title: '状态',
    width: 150,
    cell: (val) => {
      return val === 1 ? qStatus[val] : qStatus[0]
    }
  },
  sortingType: {
    title: '分拣类型',
    cell: (val) => {
      return _getName(qSortingType, val, '-')
    }
  },
  eachSlotOrderCount: {
    title: '单格口订单数',
    width: 80
  },
  gmtCreate: {
    title: '创建时间',
    width: 200
  },
  gmtModified: {
    title: '修改时间',
    width: 200
  },
  updateBy: {
    title: '操作人',
    width: 150
  },
  make: {
    title: '操作',
    lock: 'right',
    width: 150
  }
}

// 规则选项
export const nameOptions = [
  {label: '集运仓库区', value: 'store_no'},
  {label: '是否尾包', value: 'is_tail'},
  {label: '是否单包尾包', value: 'is_single_tail'},
  {"label": "是否已有出库订单","value": "is_outstock_pkg"},
  {"label": "是否异常包裹", "value": "is_exception_pkg"}
]
// 默认规则配置
export const defaultConds = nameOptions.map(c => ({name: c.value, op: 'eq', v: c.value != 'store_no' ? '0' : ''}))


export const opOptions = [
  {label: '包含', value: 'contain'},
  {label: '等于', value: 'eq'}
]
// 优化级配置
export const pOptions = new Array(20).fill().map((_,index) => ({
  label: index + 1,
  value: index + 1
}))

// 匹配值
export const vOptions = [
  {label: '是', value: '1'},
  {label: '否', value: '0'}
]