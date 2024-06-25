import React from 'react';
import { ASelect, Input, DatePicker2, Message } from '@/component';
import {getWid, isEmpty} from 'assets/js';
import $http from 'assets/js/ajax';
import { downloadExcel } from '@/assets/js/utils';
import { dataSourceOptions } from '@/pages/productionPlan/productionPlanReportBoard/config'
import dayjs from 'dayjs';
// 查询接口
export const searchApiUrl = '/prediction/quantity/detail'

// 导入出库通知
export function getOutStockNoticeUpload(data) {
  return $http({
    url:'/prediction/quantity/outStockNoticeUpload',
    method: 'post',
    data,
    dataType: 'form',
  })
}

// 导入批次到达
export function getBatchArriveUpload(data) {
  return $http({
    url: '/prediction/quantity/batchArriveUpload',
    method: 'post',
    data,
    dataType: 'form',
  })
}


// 批量导入-出库通知
export const outStockNoticeModel = {
  file: {
    onDownload: async() => {
      try {
        const res = await $http({
          url: '/prediction/quantity/outStockNoticeDownload',
          responseType: 'blob'
        })
        downloadExcel(res, `出库通知预测-${dayjs().format('YYYYMMDDHHmmss')}`)
      } catch(e) {
        Message.error(e.message)
      }
    },
    componentType: 'import',
  }
}


// 批量导入-批次到达
export const batchArriveModel = {
  file: {
    onDownload: async() => {
      try {
        const res = await $http({
          url: '/prediction/quantity/batchArriveDownload',
          responseType: 'blob'
        })
        downloadExcel(res, `批次到达预测-${dayjs().format('YYYYMMDDHHmmss')}`)
      } catch(e) {
        Message.error(e.message)
      }
    },
    componentType: 'import',
  }
}

export const predictionTypesOptions = [
  {label: '批次到达', value: '0'},
  {label: '出库通知', value: '1'},
  {label: '批次发运', value: '2'},
  {label: '车次计划', value: '3'},
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
    jobDateStart: {
      label: '选择周期',
      defaultValue: dayjs(),
      component: DatePicker2.MonthPicker,
      useDetailValue: true,
      format: (val) => {
        if (dayjs(val).isValid()) {
          return {
            jobDateStart: dayjs(val).startOf('month').format("YYYY-MM-DD 00:00:00"),
            jobDateEnd: dayjs(val).endOf('month').format("YYYY-MM-DD 23:59:59"),
            currentDate: val
          }
        } else {
          return {
            jobDateStart: "",
            jobDateEnd: ''
          }
        }
      },
      attrs: {
        hasClear: false,
      }
    },
    predictionTypes: {
      label: '预测单量类型',
      component: ASelect,
      defaultValue: ['0'],
      attrs: {
        mode: 'multiple',
        hasClear: false,
        getOptions: async() => predictionTypesOptions
      }
    },
    dataSource: {
      label: '预测数据来源',
      component: ASelect,
      defaultValue: '2',
      needExpandToData: true,
      attrs: {
        hasClear: false,
        getOptions: async() => dataSourceOptions
      }
    },
  }
]

// 列表
export const tColumns = {
  // warehouseId: {
  //   title: '仓库',
  //   cell: (val) => <ASelect value={val} isDetail></ASelect>,
  //   lock: 'left'
  // },
  predictionTypeName: {
    title: '预测单量类型',
    lock: 'left',
  },
  jobDate: {
    title: '日期',
  },

  departureName: {
    title: '始发仓'
  },
  countryName: {
    title: '国家',
  },
  turnoverTypeName: {
    title: '波次类型',
  },
  predictionValue: {
    title: '预测单量',
  },
  districtName: {
    title: '库区',
  },
  channel: {
    title: '渠道'
  },
  destinationName: {
    title: '干线仓目的地',
    show: isFCJH
  },
  trunkPartner: {
    title: '干线仓CP',
    show: isFCJH
  },
  aging: {
    title: '时效',
    show: isFCJH
  },
  packingType: {
    title: '装箱/装袋',
    show: isFCJH
  },
  trainType: {
    title: '车辆类型',
    show: isFCJH
  },
  truckLoad: {
    title: '装截量',
    show: isFCJH
  },
  outStockBigPackage: {
    title: '出库大包',
    show: isFCJH
  },
  trainNum: {
    title: '车辆数',
    show: isFCJH
  },
}

// 是否是发车计划
export function isFCJH(vm) {
  const data = vm.searchParams && vm.searchParams.data || {}
  return Array.isArray(data.predictionTypes) && data.predictionTypes.includes('3')
}

