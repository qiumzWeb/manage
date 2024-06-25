import React from 'react';
import { ASelect, Input, NumberPicker, DatePicker2, Message } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';
import { qSearch as SummarySearchModel, tColumns as SummaryColumnsModel } from '../summary/config'
// 查询接口
export const searchApiUrl = '/dingApi/monitor/listUsingMonitorRecord'

export const qSearch = {
  ...SummarySearchModel,
}

// 列表
export const tColumns = {
  ...SummaryColumnsModel,
  usingUserCount: {
    title: '用户量',
    show: false
  },
  usingCount: {
    title: '访问量',
    show: false
  },
  employeeNo: {
    title: '员工工号',
  },
  employeeName: {
    title: '员工姓名',
  },
  operatingTime: {
    title: '访问时间'
  }
}
