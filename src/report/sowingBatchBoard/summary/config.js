import React from 'react';
import { ASelect, NumberPicker, DatePicker2, Message, AFormTable } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils';
// 查询批次列表接口
export const searchApiUrl = '/waveSorting/digitalSigns/getBatchList'

// 查询批次详情接口
export const singleSearchApiUrl = '/waveSorting/digitalSigns/getBatchDetail'
export function getBatchDetail(batchNoList) {
  if (Array.isArray(batchNoList)) {
    if (isEmpty(batchNoList)) return Promise.resolve([])
    return Promise.all(batchNoList.map(batchNo => {
      return $http({
        url: singleSearchApiUrl,
        method: 'post',
        data: {batchNo}
      }).then(res => {
        return res && res.batchMessage || {}
      })
      .catch(e => ({}))
    }))
  }
  return Promise.resolve([])
}
// 查询条件
export const qSearch = {
    batchNo: {
      label: '批次号',
    },
  }

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => getWName(val) || '-'
  },
  batchNo: {
    title: ' 播种批次号',
  },
  waveTime: {
    title: '汇波时间',
  },
  waveNum: {
    title: '波次数',
  },
  waveOrderNum: {
    title: '汇波订单数',
  },
  wavePackageNum: {
    title: '汇波包裹数',
  },
  reStackingRackPackageNum: {
    title: '重堆垛包裹数',
  },
  abnormalPackageNum: {
    title: '异常上架包裹数',
  }
}
