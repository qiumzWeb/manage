import React from 'react'
import ASelect from '@/component/ASelect'
import { kpiEndOperationOptions, kpiTimeTypeOption } from '@/report/options'
import { packageTypeOptions } from '@/report/apiOptions'
// 查询接口
export const searchApi = '/kpi/monitor/instock/getKpiInstockPackageRecordDetailList'
// 列表
export const tColumns = {
  warehouseShort: {
    title: '仓库名称',
    lock: 'left'
  },
  referLogisticsOrderCode: {
    title: '一段LP号',
  },
  deliveryCode: {
    title: '一段包裹号',
  },
  turnoverType: {
    title: '包裹类型',
    cell: (val) => <ASelect value={val} getOptions={async() => await packageTypeOptions} isDetail defaultValue='-'></ASelect> 
  },
  kpiCheckNode: {
    title: 'KPI考核节点',
    cell: val => <ASelect value={val} getOptions={async() => kpiTimeTypeOption} isDetail defaultValue='-'></ASelect>
  },
  kpiRule: {
    title: 'KPI考核规则',
  },
  collectionName: {
    title: '揽收仓名称',
  },
  bigBagBatchNo: {
    title: '批次号',
  },
  batchTransferBigBagNo: {
    title: '批次中转大包号',
  },
  arriveTime: {
    title: '批次到达时间',
  },
  receivingTime: {
    title: '签收时间',
  },
  bigBagId: {
    title: '入库中转大包号',
  },
  districtGroupName: {
    title: '入库推荐库区组',
  },
  districtName: {
    title: '入库推荐库区',
  },
  instockTime: {
    title: '入库时间',
  },
  shelvesTime: {
    title: '上架时间',
  },
  endKpiExaminationDate: {
    title: 'KPI考核时间',
  },
  rejectTime: {
    title: '拒收时间',
  },
  rejectType: {
    title: '拒收原因',
  },
  rejectUser: {
    title: '拒收操作人',
  },
}

