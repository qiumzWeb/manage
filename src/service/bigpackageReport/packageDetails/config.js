import React from 'react'
import ASelect from '@/component/ASelect'
import { bigPackageSource, bigPackageType } from '@/report/options'
import { getBigPackageStatusOptions } from '../config'

export const searchUrl = '/pcsservice/statistic/prealert/bigpackage/queryDetail'

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  preCpresCode: {
    title: '大包来源',
    cell: val => <ASelect value={val} getOptions={async() => bigPackageSource} isDetail></ASelect>
  },
  batchNo: {
    title: '交接批次号',
  },
  bigBagId: {
    title: '大包号',
  },
  rfidNo: {
    title: '容器号',
  },
  passNo: {
    title: '格口号',
  },
  logisticsOrderCode: {
    title: 'LP号',
  },
  trackingNumber: {
    title: '运单号',
  },
  statusDesc: {
    title: '包裹状态',
    // cell: val => <ASelect value={val} getOptions={async() => getBigPackageStatusOptions} isDetail></ASelect>
  },
  recommendStoreCode: {
    title: '推荐库区'
  },
  storeCode: {
    title: '上架库位',
  },
  receivingTime: {
    title: '签收时间',
  },
  instockTime: {
    title: '入库时间',
  },
  shelvesTime: {
    title: '上架时间',
  },
  inStorageTime: {
    title: '入库暂存-移入时间',
    width: 200
  },
  outStorageTime: {
    title: '入库暂存-交出时间',
    width: 200
  },
}
