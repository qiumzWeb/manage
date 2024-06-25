import React from 'react';
import { ASelect, NumberPicker, DatePicker2, Message, AFormTable } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils';
import { jobModuleOptions } from '@/pcs/distributionGroup/config';
// 查询接口
export const searchApiUrl = '/sys/shiftManage/summaryList'

export const qSearch = {
    warehouseId: {
      label: '仓库名称',
      defaultValue: getWid(),
      component: ASelect,
      attrs: {
        hasClear: false
      }
    },
    jobModule: {
      label: '模块',
      component: ASelect,
      attrs: {
        getOptions: async() => jobModuleOptions,
      }
    },
    searchTime: {
      label: '统计时间',
      fixedSpan: 20,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      useDetailValue: true,
      transTimeCode: ['startTime', 'endTime'],
      format: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
      attrs: {
        hasClear: false,
        format: 'YYYY-MM-DD',
      }
    },
  }

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => getWName(val) || '-'
  },
  calculateDate: {
    title: ' 统计时间',
  },
  jobModule: {
    title: '模块',
    cell: val => <ASelect value={val} isDetail getOptions={async() => jobModuleOptions} defaultValue="-"></ASelect>
  },
  countNum: {
    title: '交接日志数量',
  }
}
