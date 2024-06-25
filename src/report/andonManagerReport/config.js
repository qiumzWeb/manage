import React from 'react';
import { ASelect, NumberPicker, DatePicker2, Message, AFormTable } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils';
import { jobModuleOptions } from '@/pcs/distributionGroup/config';
// 查询接口
export const searchApiUrl = '/manager/andon/pc/page'

// 处理状态配置
export const andonStatusOption = [
  {label: '待处理', value: '0'},
  {label: '已完成', value: '1'}
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
    jobModule: {
      label: '模块',
      component: ASelect,
      attrs: {
        getOptions: async() => jobModuleOptions,
      }
    },
    andonTime: {
      label: '呼叫时间',
      fixedSpan: 20,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      useDetailValue: true,
      transTimeCode: ['dateStart', 'dateEnd'],
      format: ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
      attrs: {
        hasClear: false,
        format: 'YYYY-MM-DD',
      }
    },
    andonStatus: {
      label: '处理状态',
      component: ASelect,
      attrs: {
        getOptions: async() => andonStatusOption,
      }
    }
  }

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
  },
  andonTime: {
    title: ' 呼叫时间',
    width: 150,
  },
  jobModule: {
    title: '模块',
    width: 80,
    cell: val => <ASelect value={val} isDetail getOptions={async() => jobModuleOptions} defaultValue="-"></ASelect>
  },
  callNo: {
    title: '任务编号',
    width: 170
  },
  andonStatusName: {
    title: '处理状态',
    width: 80
  },
  teamEmployeeName: {
    title: '呼叫人'
  },
  manageEmployeeName: {
    title: '组长'
  },
  largeGroupManagerName: {
    title: '主管'
  },
  positionDescription: {
    title: '呼叫人位置'
  },
  andonReason: {
    title: '发起原因'
  },
  andonResult: {
    title: '处理结果'
  }
}
