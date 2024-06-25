import React from 'react';
import { ASelect, Input, NumberPicker, DatePicker2, Message } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
// 查询接口
export const searchApiUrl = '/waveSorting/digitalSigns/getBatchWaveDetail'

// 完结波次/批量
export function getCompleteWave(data) {
  return $http({
    url: '/waveSorting/digitalSigns/submitCompleteWave',
    method: 'post',
    data: {
      warehouseId: getWid(),
      ...data,
    }
  })
}


export const qSearch = {
    batchNo: {
      label: '批次号',
    },
    waveNo: {
      label: '波次号',
    },
}

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => getWName(val) || '-'
  },
  waveNo: {
    title: '波次号',
  },
  packageCode: {
    title: '分拣进度',
    cell: (val, index, record) => {
      return (record.sortingPackageNum || 0) + "/" + (record.wavePackageNum || 0)
    }
  },
  crossSortingDeviceSlot: {
    title: '分拣设备/格口',
    width: 200,
    cell: (val, index, record) => {
      return (record.crossSortingDeviceSlot || "-") + "/" + (record.comebackSortingDeviceSlot || '-')
    }
  },
  initBigBagNum: {
    title: '已生成大包数量',
  },
  transferBigBagNum: {
    title: '运输中大包数量'
  },
  arriveBigBagNum: {
    title: '已到达大包数量',
  },
  collectingAreaBigBagNum: {
    title: '已集包大包数量',
  },
  waveStatusName: {
    title: '状态'
  }
}
