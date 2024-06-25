import React from 'react'
import { ASelect } from '@/component'
import { isTrueOrNotOptions } from '@/report/options'
// 查询接口
export const searchApiUrl = '/reversal/monitor/pageReversalStatisticDetail'

// 列表
export const tColumns = {
  warehouseName: {
    title: '仓库名称',
    lock: 'left'
  },
  orderLogisticsCode: {
    title: '二段包裹单号',
  },
  deliveryCode: {
    title: '一段包裹单号',
  },
  dispatchCode: {
    title: '末端面单号'
  },
  pkgReRouteTrackingNumber: {
    title: '包裹重路由单号'
  },
  orderReRouteTrackingNumber: {
    title: '订单重路由单号'
  },
  exceptionStoreOnStatus: {
    title: '是否已做异常上架',
    cell: val => <ASelect value={val} isDetail getOptions={async() => isTrueOrNotOptions} defaultValue="-"></ASelect>
  },
  reversalPackageType: {
    title: '逆向包裹类型',
  },
  reversalReason: {
    title: '异常原因'
  },
  signTime: {
    title: '逆向签收时间',
  },
  inStockTime: {
    title: '逆向入库时间',
  },
  outBoundedTime: {
    title: '出库时间',
  },
  orderStatus: {
    title: '二段订单状态',
  },
  packageStatus: {
    title: '一段包裹状态',
  },
 

}

