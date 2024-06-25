import React from 'react';
import { ASelect, NumberPicker, DatePicker2, Message, AFormTable } from '@/component';
import {getWid, isEmpty, getWName, getStringCodeToArray  } from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils';
// 查询接口
export const searchApiUrl = '/task/shelvesTask/listNoOwnerPackageList'

// 状态配置
export const statusOptions = [
  {label: '已上架', value: '15'},
  {label: '已下架', value: '20'}
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
    deliveryCodes: {
      label: '包裹运单号',
      format: (val) => getStringCodeToArray(val),
      attrs: {
        placeholder: '多个包裹号请用 空格分隔'
      }
    },

    onShelveTime: {
      label: '上架时间',
      fixedSpan: 20,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      useDetailValue: true,
      transTimeCode: ['onShelveStartTime', 'onShelveEndTime'],
      format: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
      attrs: {
        format: 'YYYY-MM-DD',
      }
    },
    offShelveTime: {
      label: '下架时间',
      fixedSpan: 20,
      // defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      useDetailValue: true,
      transTimeCode: ['offShelveStartTime', 'offShelveEndTime'],
      format: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
      attrs: {
        format: 'YYYY-MM-DD',
      }
    },
    status: {
      label: '状态',
      component: ASelect,
      attrs: {
        getOptions: async({field}) => {
          return statusOptions
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
  deliveryCode: {
    title: '包裹运单号',
  },
  onShelveOperator: {
    title: '上架操作人',
  },
  onShelveTime: {
    title: '上架时间',
  },
  offShelveTime: {
    title: '下架时间',
  },
  status: {
    title: '状态',
    cell: val => <ASelect value={val} getOptions={async() => statusOptions} isDetail defaultValue="-"></ASelect>
  },
}
