import React from 'react';
import { ASelect, NumberPicker, DatePicker2, Message, AFormTable } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
import { defaultSearchTime } from '@/report/utils';
// 查询接口
export const searchApiUrl = '/stackingRack/digitalSigns/search'

export const qSearch = {
    warehouseId: {
      label: '仓库名称',
      component: ASelect,
      defaultValue: getWid(),
      attrs: {
        hasClear: false
      }
    },
    bigWaveNo: {
      label: '波次号',
    },
    areaName: {
      label: '库区号',
    },

  }


// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => getWName(val) || '-'
  },
  areaName: {
    title: ' 库区号',
  },
  batchNo: {
    title: '集货批次号',
    width: 200
  },
  sumOrderNum: {
    title: '集货批次总订单数',
  },
  collectedOrderNum: {
    title: '已集齐订单数',
  },
  unCollectedOrderNum: {
    title: '未集齐订单数',
  },
  abnormalOrderNum: {
    title: '标记少货订单数',
  },
  bigPackageOnShelvesProgress: {
    title: '大包上架进度',
    cell: (val, index, record) => {
      return (record.onShelvesBigBagNum || '0') + "/" + (record.sumBigBagNum || '0')
    }
  },
  sumPackageNum: {
    title: '集货批次总包裹数',
  },
  collectedPackageNum: {
    title: '已集齐包裹数',
  },
  unCollectedPackageNum: {
    title: '未集齐包裹数',
  },
  abnormalPackageNum: {
    title: '标记少货包裹数',
  },
}
