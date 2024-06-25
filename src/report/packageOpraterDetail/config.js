import React from 'react';
import Page from '@/atemplate/queryTable';
import { ASelect, Input, Message, Dialog, DatePicker2 } from '@/component';
import { getWid, getStringCodeToArray } from 'assets/js';
import $http from 'assets/js/ajax';
import { getDistrictOptions } from '@/report/apiOptions'
import { defaultSearchTime } from '@/report/utils'
import { slaEnableOptions, timeEfficiencyTypeOptions } from '@/report/options'

// 查询接口
export const searchApiUrl = '/report/collect/pagingTasks'

// 操作环节
export const operateNodeOptions = [
  {label: '入库', value: '0'},
  {label: '上架', value: '1'},
  {label: '下架', value: '2'},
  {label: '播种', value: '3'},
  {label: '质检', value: '4'},
]


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
    searchTime: {
      label: '操作时间',
      fixedSpan: 24,
      needExpandToData: true,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      transTimeCode: ['operateStartTime', 'operateEndTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      }
    },
    referLogisticsCode: {
      label: '一段LP号',
    },
    orderReferLogisticsCode: {
      label: '二段LP号',
    },
    dispatchCode: {
      label: '二段运单号',
    },
    containerCode: {
      label: '容器号',
    },
    operateNode: {
      label: '操作环节',
      component: ASelect,
      span: 12,
      defaultValue: '0',
      attrs: {
        isRadio: true,
        getOptions: async() => operateNodeOptions,
        onChange: (val, queryList, action) => {
          queryList.refresh()
        }
      }
    }
  }
]

// 列表
export const tColumns = {
  operateNodeName: {
    title: '操作环节',
  },
  referLogisticsCode: {
    title: '一段LP号',
  },
  orderReferLogisticsCode: {
    title: '二段LP号',
  },
  containerCode: {
    title: '容器号',
  },
  storeCode: {
    title: '库位',
  },
  operateStartTime: {
    title: '操作开始时间'
  },
  operateEndTime: {
    title: '操作结束时间',
  },
  operateTime: {
    title: '操作时长（秒）'
  },
  accountName: {
    title: '操作人'
  },
}
