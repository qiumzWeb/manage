import React from 'react';
import { ASelect, Input, NumberPicker, DatePicker2, Message } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';
// 查询接口
export const searchApiUrl = '/waveSorting/digitalSigns/getBatchWaveBigBagDetail'

export const qSearch = {
  waveNo: {
    label: '波次号',
  },
}

// 大包状态
export const bigPackageType = [
  {label: '已生成', value: 'initBigBagList'},
  {label: '中转', value: 'transferBigBagList'},
  {label: '已达到', value: 'arriveBigBagList'},
  {label: '已集包入区', value: 'collectingAreaBigBagList'},
]


// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => getWName(val) || '-'
  },
  bigBagId: {
    title: '大包号',
  },
  bigPackageType: {
    title: '节点',
    cell: (val) => <ASelect value={val} getOptions={async() => bigPackageType} isDetail defaultValue="-"></ASelect>
  },
  bigBagTime: {
    title: '时间',
  },
  // transferBigBagListTime: {
  //   title: '经过预扫时间',
  // },
  // arriveBigBagListTime: {
  //   title: '落格时间'
  // },
  // collectingAreaBigBagListTime: {
  //   title: '集包入区时间',
  // },
  bigBagLocation: {
    title: '库区',
  }
}
