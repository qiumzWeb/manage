import React from 'react';
import { ASelect, NumberPicker, DatePicker2, Message, AFormTable } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils';
import { getDingApiMenuData } from '@/report/apiOptions'
// 查询接口
export const searchApiUrl = '/dingApi/monitor/listUsingMonitorSummary'

// 包裹状态
export const userIdentifiedTypeOptions = [
  {label: '组长工作台', value: '0'},
  {label: '主管工作台',  value: '1'},
  {label: '超管工作台', value: '2'},
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
    searchDate: {
      label: '统计时间',
      fixedSpan: 20,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      useDetailValue: true,
      transTimeCode: ['queryStartTime', 'queryEndTime'],
      attrs: {
        hasClear: false,
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true
      }
    },
    userIdentifiedType: {
      label: '平台',
      component: ASelect,
      attrs: {
        getOptions: async() => userIdentifiedTypeOptions,
        onChange: (val, vm) => {
          vm.field.setValues({
            firstMenu: '',
            secondMenu: '',
            servletPath: ''
          })
        }
      }
    },
    firstMenu: {
      label: '一级功能模块',
      component: ASelect,
      attrs: {
        watchKey: 'userIdentifiedType',
        getOptions: async({field}) => {
          const userIdentifiedType = field.getValue('userIdentifiedType')
          const opd = await getDingApiMenuData
          return Object.keys(opd?.[userIdentifiedType] || {}).map(m => ({label: m, value: m}))
        },
        onChange: (val, vm) => {
          vm.field.setValues({
            secondMenu: '',
            servletPath: ''
          })
        }
      }
    },
    secondMenu: {
      label: '二级功能模块',
      component: ASelect,
      attrs: {
        watchKey: 'firstMenu,userIdentifiedType',
        getOptions: async({field}) => {
          const key = field.getValue('firstMenu')
          const userIdentifiedType = field.getValue('userIdentifiedType')
          const opd = await getDingApiMenuData
          const cp = opd?.[userIdentifiedType]?.[key] || {}
          return Object.keys(cp).map(m => ({label: m, value: m}))
        },
        onChange: async(val, vm) => {
          const opd = await getDingApiMenuData
          const key = vm.field.getValue('firstMenu')
          const userIdentifiedType = vm.field.getValue('userIdentifiedType')
          const cp = opd?.[userIdentifiedType]?.[key]?.[val] || undefined
          vm.field.setValue('servletPath', cp)
        }
      }
    }
  }

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
  },
  // servletPath: {
  //   title: ' 请求接口',
  // },
  userIdentifiedType: {
    title: '平台',
    cell: val => <ASelect value={val} isDetail getOptions={async() => userIdentifiedTypeOptions} defaultValue="-"></ASelect>
  },
  firstMenu: {
    title: '一级功能模块',
  },
  secondMenu: {
    title: '二级功能模块',
  },
  usingUserCount: {
    title: '用户量'
  },
  usingCount: {
    title: '访问量'
  },
}
