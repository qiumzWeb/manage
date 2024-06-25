import React from 'react';
import Page from '@/atemplate/queryTable';
import { ASelect, Input, Message, Dialog, DatePicker2 } from '@/component';
import { getWid, getStringCodeToArray } from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils'

// 查询接口
export const searchApiUrl = '/noprealert/manage/search'

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
    deliveryCode: {
      label: '包裹号',
    },
    searchTime: {
      label: '登记时间',
      fixedSpan: 24,
      needExpandToData: true,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      transTimeCode: ['startTime', 'endTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        // hasClear: false,
      }
    },
  }
]

// 列表
export const tColumns = {
  deliveryCode: {
    title: '包裹号',
  },
  recordTime: {
    title: '登记时间',
  },
  operatorName: {
    title: '登记人',
  }
}

