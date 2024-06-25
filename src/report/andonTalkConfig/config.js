import ASelect from '@/component/ASelect'
import {getWid, isEmpty, getStringCodeToArray} from 'assets/js'
import { Input } from '@/component'

// 查询接口
export const searchUrl = '/andon/config/queryList'

// 新增接口
export const addUrl = '/andon/config/creatAndonConfig'

// 修改接口 
export const modifyUrl = '/andon/config/modifyAndonConfig'

// 删除接口
export const deleteUrl = '/andon/config/deleteAndonConfig'


export const qSearch = [
  {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      attrs: {
        hasClear: false
      }
    },
    barCodeList: {
      label: '条码号',
      span: 12,
      format: val => getStringCodeToArray(val),
      attrs: {
        placeholder: '批量查询请使用空格分隔'
      }
    },
  }
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  barCode: {
    title: '条码号',
  },
  positionDescription: {
    title: '位置描述',
    width: 500
  },
  make: {
    title: '操作',
    lock: 'right'
  }
}

// 新增修改
export const editModel = {
  warehouseId: {
    label: '仓库名称',
    component: ASelect,
    span: 12,
    defaultValue: getWid(),
    required: true,
    disabled: data => !data.isAdd,
    attrs: {
      hasClear: false
    }
  },
  barCode: {
    label: '条码号',
    span: 12,
    required: true,
  },
  positionDescription: {
    label: '位置描述',
    component: Input.TextArea,
    span: 24,
    required: true,
    attrs: {
      rows: 4,
      placeholder: '请输入位置描述'
    }
  }
}