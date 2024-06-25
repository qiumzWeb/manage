import React from 'react';
import { ASelect, Input, DatePicker2  } from '@/component';
import { getWid, getStringCodeToArray } from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils'
// 查询接口
export const searchApiUrl = '/bigBag/pageListNotGenerateWaveBigBag'


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
    makeTime: {
      label: '统计时间',
      fixedSpan: 24,
      needExpandToData: true,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      transTimeCode: ['startTime', 'endTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        hasClear: false,
      }
    },
    bigBagRfids: {
      label: '尾包大包号',
      fixedSpan: 24,
      component: Input,
      format: (val) => {
        return getStringCodeToArray(val)
      },
      attrs: {
        placeholder: '批量查询以空格分隔'
      }
    },
  }
]

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
  },
  bigBagRfid: {
    title: '尾包大包号',
  },
  bigBagGenerateTime: {
    title: '集包时间',
  },
}
