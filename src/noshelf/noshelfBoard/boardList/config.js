import React from 'react'
import {thousands} from 'assets/js'
export const CardConfig = [
  [
    {
      title: '签收大包数（截单前/截单后）',
      value: data => `${thousands(data.signBigBagBeforeCutTimeCount)}/${thousands(data.signBigBagAfterCutTimeCount)}`,
      // subTitle: data => <span>日环比增长<span  className='downcenter_SUCC' style={{fontSize: 20}}>+8%</span></span>
    },
    {
      title: '回传入库小包数（截单前/截单后）',
      value: data => `${thousands(data.inboundBeforeCutTimeCount)}/${thousands(data.inboundAfterCutTimeCount)}`,
      // subTitle: data => <span>日环比增长<span  className='downcenter_SUCC' style={{fontSize: 20}}>+8%</span></span>
    },
    {
      title: '回传上架小包数（截单前/截单后）',
      value: data => `${thousands(data.onshelvesBeforeCutTimeCount)}/${thousands(data.onshelvesAfterCutTimeCount)}`,
      // subTitle: data => <span>日环比增长<span  className='downcenter_SUCC' style={{fontSize: 20}}>+8%</span></span>
    },
  ],
  [
    {
      title: '分拣预分配（已分配/应分配）',
      value: data => `${thousands(data.assignedQuantity)}/${thousands(data.allocateQuantity)}`,
      subTitle: data => <span>
        分配进度
        <span  className='up'>
        {data.allocateQuantity ? ((data.assignedQuantity || 0) * 100 / (data.allocateQuantity || 0)).toFixed(0) : 0}%
        </span>
      </span>
    },
    {
      title: '单票订单',
      value: data => thousands(data.singleQuantity),
      // subTitle: data => <span>日环比增长<span  className='downcenter_SUCC' style={{fontSize: 20}}>+8%</span></span>
    },
    {
      title: '多票订单/包裹',
      value: data => `${thousands(data.multiOrderQuantity)}/${thousands(data.multiPackageQuantity)}`,
      // subTitle: data => <span>日环比增长<span  className='downcenter_SUCC' style={{fontSize: 20}}>+8%</span></span>
    },

  ],
  [
    {
      title: '接单量（订单）',
      value: data => thousands(data.orderReceiveCount),
      subTitle: data => <span>日环比增长<span  className={data.orderReceiveChain > 0 ? 'up' : 'down'}>{
        ((data.orderReceiveChain || 0) * 100).toFixed(2)
      }%</span></span>
    },
    {
      title: '接单量（包裹）',
      value: data => thousands(data.pkgReceiveCount),
      subTitle: data => <span>日环比增长<span className={data.pkgRecevieChain > 0 ? 'up' : 'down'}>{
        ((data.pkgRecevieChain || 0) * 100).toFixed(2)
      }%</span></span>
    },
  ],
  [
    {
      title: '出库粗分1（已扫/应扫）',
      value: data => `${thousands(data.initialScannedQuantity)}/${thousands(data.totalQuantity)}`
    },
    {
      title: '出库粗分2（已扫/应扫）',
      value: data => `${thousands(data.secondScannedQuantity)}/${thousands(data.totalQuantity)}`
    },
    {
      title: '出库粗分3（已扫/应扫）',
      value: data => `${thousands(data.finalScannedQuantity)}/${thousands(data.totalQuantity)}`
    },
  ]
]