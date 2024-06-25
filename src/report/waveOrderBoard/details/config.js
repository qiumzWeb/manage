import React from 'react';
import { ASelect, Input, NumberPicker, DatePicker2, Message } from '@/component';
import {getWid, isEmpty, getWName} from 'assets/js';
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';
import { getBigPackageStatusOptions } from '@/service/bigpackageReport/config'
// 查询接口
export const searchApiUrl = '/bigWaveNo/digitalSigns/search/bigWaveNo/detail'

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
    batchNo: {
      label: '集货批次号',
    },
    bigBagId: {
      label: '大包号',
    },
    bigBagStatus: {
      label: '大包状态',
      component: ASelect,
      attrs: {
        getOptions: async() => await getBigPackageStatusOptions
      }
    }
}

// 列表
export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    cell: val => getWName(val) || '-'
  },
  bigWaveNo: {
    title: '波次号',
  },
  batchNo: {
    title: '集货批次号'
  },
  areaName: {
    title: '库区号',
  },
  stackingRackNo: {
    title: '堆垛架号',
  },
  bigBagId: {
    title: '大包号'
  },
  rfidId: {
    title: '容器号',
  },
  bigBagStatusName: {
    title: '大包状态',
  }
}
