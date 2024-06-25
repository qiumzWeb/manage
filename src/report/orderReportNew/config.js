import React from 'react';
import Page from '@/atemplate/queryTable';
import { ASelect, Input, Message, Dialog, DatePicker2 } from '@/component';
import { getWid, getStringCodeToArray } from 'assets/js';
import $http from 'assets/js/ajax';
import { getOrderStatusOptions } from '@/report/apiOptions'
import { defaultSearchTime } from '@/report/utils'
import { slaEnableOptions } from '@/report/options'

// 查询接口
export const searchApiUrl = '/report/collect/pagingOrder'

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
      label: '二段单创建时间',
      fixedSpan: 24,
      needExpandToData: true,
      // defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      transTimeCode: ['createStartTime', 'createEndTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        // hasClear: false,
      }
    },
    searchTime2: {
      label: '二段单预计出库时间',
      fixedSpan: 24,
      needExpandToData: true,
      defaultValue: defaultSearchTime,
      component: DatePicker2.RangePicker,
      transTimeCode: ['cutOffStartTime', 'cutOffEndTime'],
      format: ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        // hasClear: false,
      }
    },
    orderStatusList: {
      label: '订单状态',
      component: ASelect,
      attrs: {
        mode: 'multiple',
        getOptions: getOrderStatusOptions
      }
    },
    orderReferLogisticsCode: {
      label: '二段订单LP',
    },
    referLogisticsCode: {
      label: '一段LP单号',
    },
    dispatchCode: {
      label: '二段运单号',
    },
    orderInWarehouse: {
      label: '是否到齐',
      component: ASelect,
      attrs: {
        getOptions: async() => slaEnableOptions
      }
    }
  }
]

// 列表
export const tColumns = {
  orderCreateTime: {
    title: '二段单\n创建时间',
  },
  cutOffTime: {
    title: '二段单\n预计出库时间',
  },
  orderReferLogisticsCode: {
    title: '二段单\nLP单号',
  },
  dispatchCode: {
    title: '二段单\n运单号',
  },
  orderStatusName: {
    title: '二段单\n订单状态'
  },
  country: {
    title: '国家',
    width: 80
  },
  orderInWarehouse: {
    title: '是否到齐',
    cell: val => <ASelect isDetail value={val} getOptions={async() => slaEnableOptions}></ASelect>,
    width: 80
  },
  collectionWarehouse: {
    title: '首公里揽收仓'
  },

  referLogisticsCode: {
    title: '一段单\nLP单号',
  },
  packageStatusName: {
    title: '一段单\n包裹状态'
  },
  storeCode: {
    title: '一段单\n存储库位'
  },
  receivingTime: {
    title: '一段单\n收货时间',
  },
  shelvesTime: {
    title: '一段单\n上架时间'
  }, 
  preCpResCode: {
    title: '一段单\n来源仓Code'
  }

}

