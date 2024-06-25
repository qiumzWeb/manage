import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { bigPackageSource, bigPackageType, orderPlatformOptions } from '@/report/options'
import { defaultSearchDate } from '@/report/utils'
import { getBigPackageStatusOptions, signRegionOptions } from '../config'

// 查询接口 - 汇总
export const searchApi = '/pcsservice/statistic/prealert/bigpackage/summary'

// 跳转大包明细字段
export const goDetailsKeys = {
  'bigBagCount': '1', // 大包数
  'parcelQty': '2', // 大包内小包数
}

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
    createTime: {
      label: '生成时间',
      fixedSpan: 22,
      defaultValue: defaultSearchDate,
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        timePanelProps: {
          format: 'HH:mm:ss'
        },
        showTime: true,
        hasClear: false
      }
    },
    bigBagType: {
      label: '大包类型',
      component: ASelect,
      attrs: {
        getOptions: async() => {
          return bigPackageType
        }
      }
    },
    signRegion: {
      label: '签收点',
      component: ASelect,
      attrs: {
        getOptions: async() => signRegionOptions
      }
    },
    preCpresCode: {
      label: '大包来源',
      component: ASelect,
      attrs: {
        getOptions: async() => {
          return bigPackageSource
        }
      }
    },
    status: {
      label: '大包状态',
      component: ASelect,
      attrs: {
        getOptions: async() => {
          return await getBigPackageStatusOptions
        }
      }
    },
    source: {
      label: '订单平台',
      component: ASelect,
      attrs: {
        getOptions: async() => orderPlatformOptions
      }
    }
  }
]
// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  signTime: {
    title: '签收时间',
    width: 350,
    cell: (val, index, record) => {
      return `${record.signTimeStart || '-'} 至 ${record.signTimeEnd || '-'}`
    }
  },
  bigBagType: {
    title: '大包类型',
    cell: val => <ASelect value={val} getOptions={async() => bigPackageType} defaultValue="-" isDetail></ASelect>
  },
  signRegion: {
    title: '签收点',
    cell: val => <ASelect value={val} getOptions={async() => signRegionOptions} defaultValue="-"  isDetail></ASelect>
  },
  preCpresCode: {//
    title: '大包来源',
    cell: val => <ASelect value={val} getOptions={async() => bigPackageSource} defaultValue="-"  isDetail></ASelect>
  },
  status: {
    title: '大包状态',
    cell: val => <ASelect value={val} getOptions={async() => getBigPackageStatusOptions} defaultValue="-"  isDetail></ASelect>
  },
  bigBagCount: {
    title: '大包数',
  },
  parcelQty: {
    title: '大包内小包数',
  },
  // receivedCount: {
  //   title: '已签收小包数',
  // },
  // inboundCount: {
  //   title: '入库小包数',
  // },
  // onshelvesCount: {
  //   title: '上架小包数',
  // },
  // rejectCount: {
  //   title: '已拒收小包数',
  // },
  // unsignedCount: {
  //   title: '未签收小包数',
  // },
}

