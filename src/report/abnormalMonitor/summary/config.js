import React from 'react'
import { Input, Select, Button, Radio, DatePicker2 } from '@/component'
import moment from 'moment'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import Api from 'assets/api'
import $http from 'assets/js/ajax'

// 异常包裹类型
export const getPackageTypeNameList = $http({
  url: Api.getPackageTypeNameList,
  method: 'get'
})
// 异常标记节点
export const getMarkNodeTypeNameList = $http({
  url: Api.getMarkNodeTypeNameList,
  method: 'get'
})
// 确认异常
export const getConfirmStatusNameList = $http({
  url: Api.getConfirmStatusNameList,
  method: 'get'
})

// 默认查询时间
export const defaultSearchTime = [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')]
export const getTime = (s) => {
   return s && s.format && s.format('YYYY-MM-DD HH:mm:ss') || s || '';
}

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
    packageTypeCodeList: {
      label: '异常包裹类型',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        placeholder: "请选择",
        getOptions: async() => {
          const data = await getPackageTypeNameList
          return Array.isArray(data) && data.map(d => ({
            label: d.description,
            value: d.code
          })) || []
        }
      }
    },
    markNodeTypeCodeList: {
      label: '异常标记节点',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        placeholder: "请选择",
        getOptions: async() => {
          const data = await getMarkNodeTypeNameList
          return Array.isArray(data) && data.map(d => ({
            label: d.description,
            value: d.code
          })) || []
        }
      }
    },
    confirmedStatusCodeList: {
      label: '异常确认类型',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        getOptions: async() => {
          const data = await getConfirmStatusNameList
          return Array.isArray(data) && data.map(d => ({
            label: d.description,
            value: d.code
          })) || []
        }
      }
    },
    markingTime: {
      label: '统计起止时间',
      fixedSpan: 22,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true
      }
    },
  }
]
// 列表
export const tColumns = {
  intervalTime: {
    title: '统计时间',
    width: 320,
    cell: (val) => {
      const [s, e] = (val || '').split('~')
      const start = moment(s).format('YYYY-MM-DD HH:mm:ss')
      const end = moment(e).format('YYYY-MM-DD HH:mm:ss')
      return start + '~' + end
    }
  },
  warehouseName: {
    title: '仓库名称',
  },
  packageTypeName: {
    title: '异常包裹类型',
  },
  markedNodeName: {
    title: '异常标记节点',
  },
  confirmedStatusName: {
    title: '异常确认类型',
  },
  taskTypeName: {
    title: '处理策略',
  },
  toatlNum: {
    title: '包裹总数',
  },
}

