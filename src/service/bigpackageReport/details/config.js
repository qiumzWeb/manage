import React from 'react'
import { DatePicker2 } from '@/component'
import ASelect from '@/component/ASelect'
import {getWid} from 'assets/js'
import { bigPackageSource, bigPackageType, orderPlatformOptions } from '@/report/options'
import { defaultSearchDate } from '@/report/utils'
import { getBigPackageStatusOptions,signRegionOptions } from '../config'
// 查询接口
export const searchApi = '/pcsservice/statistic/prealert/bigpackage/list'

// 详情跳转字段
// 大包内小包数、签收小包数、入库小包数、上架小包数、拒收小包数、未签收小包数
export const goDetailsKeys = {
  'parcelQty': undefined, // 大包内小包数
  'receivedCount': '5', // 签收小包数
  'inboundCount': '10', // 入库小包数
  'onshelvesCount': '15', // 上架小包数
  'offshelvesCount': '20', // 下架小包数
  'rejectCount': '-10', // 拒收小包数
  'unSignCount': '1', // 未签收小包数
}
// 判断 签收 拒收状态
export const isReject = data => ['-10'].some(s => data.status == s)
export const isSign = data => [10, 5].some(s => data.status == s)

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
    batchNo: {
      label: '交接批次号',
    },
    bigBagId: {
      label: '大包号',
    },
    rfidNo: {
      label: '容器号',
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
    status: {
      label: '大包状态',
      component: ASelect,
      attrs: {
        getOptions: async() => {
          return await getBigPackageStatusOptions
        }
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
    signRegion: {
      label: '签收点',
      component: ASelect,
      attrs: {
        getOptions: async() => signRegionOptions
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
      }
    },
    // 大包状态 【拒收： -10， 签收： 5， 完结： 10】
    signTime: {
      label: '签收时间',
      fixedSpan: 22,
      show: isSign,
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        timePanelProps: {
          format: 'HH:mm:ss'
        },
        showTime: true,
      }
    },
    rejectTime: {
      label: '拒收时间',
      fixedSpan: 22,
      show: isReject,
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        timePanelProps: {
          format: 'HH:mm:ss'
        },
        showTime: true,
      }
    },
    moveTime: {
      label: '移入时间',
      fixedSpan: 22,
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        timePanelProps: {
          format: 'HH:mm:ss'
        },
        showTime: true,
      }
    },
    handOverTime: {
      label: '交出时间',
      fixedSpan: 22,
      component: DatePicker2.RangePicker,
      attrs: {
        format: 'YYYY-MM-DD HH:mm:ss',
        timePanelProps: {
          format: 'HH:mm:ss'
        },
        showTime: true,
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
  batchNo: {
    title: '交接批次号',
  },
  bigBagId: {
    title: '大包号',
  },
  bigBagType: {
    title: '大包类型',
    cell: val => <ASelect value={val} getOptions={async() => bigPackageType} defaultValue="-" isDetail></ASelect>
  },
  signRegion: {//
    title: '签收点',
    cell: val => <ASelect value={val} getOptions={async() => signRegionOptions} defaultValue="-" isDetail></ASelect>
  },
  rfidNo: {
    title: '容器号',
  },
  preCpresDesc: {
    title: '大包来源',
  },
  passNo: {
    title: '格口号',
  },
  grossWeight: {
    title: '大包预报重量',
  },
  standardWeight: {
    title: '大包实际重量',
  },
  gmtCreate: {
    title: '生成时间',
  },
  signTime: {
    title: '签收时间',
    cell: (val, index, record) => {
      return isSign(record) && record.gmtModified || '-'
    }
  },
  rejectTime: {
    title: '拒收时间',
    cell: (val, index, record) => {
      return isReject(record) && record.gmtModified || '-'
    }
  },
  inStorageTime: {
    title: '入库暂存-移入时间',
  },
  outStorageTime: {
    title: '入库暂存-交出时间',
  },
  storageCode: {
    title: '暂存库区',
  },
  parcelQty: {
    title: '大包内小包数',
  },
  receivedCount: {
    title: '签收小包数',
  },
  inboundCount: {
    title: '入库小包数',
  },
  onshelvesCount: {
    title: '上架小包数',
  },
  offshelvesCount: {
    title: '下架小包数',
  },
  rejectCount: {
    title: '拒收小包数',
  },
  unSignCount: {
    title: '未签收小包数',
  },
  statusDesc: {
    title: '大包状态',
  },
  make: {
    title: '操作',
    width: 80,
    lock: 'right'
  }

}

