import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/component';
import { thousands, NumToPercentage } from 'assets/js';
export default function UPPHDataSum (props) {
  const { value = {} } = props;
  return <div className='flex-center' style={{
    width: '100%',
    flexWrap: 'wrap'
  }}>
    <Card definedStyle={{marginRight: 20, marginBottom: 20}}>
      <Card.Header title="原计划"></Card.Header>
      <Card.Content>
        <NumberCard name="入库" value={value.originalPlanInstock}></NumberCard>
        <NumberCard name="合箱" value={value.originalPlanMerge}></NumberCard>
        <NumberCard name="人效" value={value.originalPlanEffect}></NumberCard>
        <NumberCard name="综合工时" value={value.originalPlanWorkingHours}></NumberCard>
      </Card.Content>
    </Card>
    <Card definedStyle={{marginRight: 20, marginBottom: 20}}>
      <Card.Header title="动态计划"></Card.Header>
      <Card.Content>
        <NumberCard name="入库" value={value.dynamicPlanInstock}></NumberCard>
        <NumberCard name="合箱" value={value.dynamicPlanMerge}></NumberCard>
        <NumberCard name="人效" value={value.dynamicPlanEffect}></NumberCard>
        <NumberCard name="综合工时" value={value.dynamicPlanWorkingHours}></NumberCard>
      </Card.Content>
    </Card>
    <Card definedStyle={{marginRight: 20, marginBottom: 20}}>
      <Card.Header title="及时率&达成率"></Card.Header>
      <Card.Content>
        <NumberCard name="上架及时率" value={NumToPercentage(value.onShelvesOnTimeRate, 1)}></NumberCard>
        <NumberCard name="出库及时率" value={NumToPercentage(value.outStockOnTimeRate)}></NumberCard>
        <NumberCard name="入库产能达成率" value={NumToPercentage(value.instockCapacityReachRate)}></NumberCard>
        <NumberCard name="合箱产能达成率" value={NumToPercentage(value.mergeCapacityReachRate)}></NumberCard>
      </Card.Content>
    </Card>
    <Card definedStyle={{marginBottom: 20}}>
      <Card.Header title="单量"></Card.Header>
      <Card.Content>
        <div className='flex-center'>
          <div>
            <NumberCard name="首公里预报" value={value.firstMilePrealert}></NumberCard>
            <NumberCard name="批次到达" value={value.batchArrivePackageQuantity}></NumberCard>
            <NumberCard name="已入库" value={value.instockPackageQuantity}></NumberCard>
            <NumberCard name="未入库" value={value.notInstockPackageQuantity}></NumberCard>
          </div>
          <div style={{height:65, width: 0, position: 'relative', top: -3, margin: '0 20px', borderLeft: '1px solid #ddd'}}></div>
          <div>
            <NumberCard name="系统通知出库" value={value.outstockNoticePackageQuantity}></NumberCard>
            <NumberCard name="已下架" value={value.offShelvesPackageQuantity}></NumberCard>
            <NumberCard name="未下架" value={value.notOffShelvesPackageQuantity}></NumberCard>
            <NumberCard name="已合箱" value={value.mergePackageQuantity}></NumberCard>
          </div>
        </div>
      </Card.Content>
    </Card>
  </div>
}

function NumberCard(props) {
  const { name, value } = props
  return <div className='flex-center' style={{justifyContent: 'space-between', width: 180, marginBottom: 10}}>
    <span style={{color: '#666'}}>{name}</span>
    <span style={{color: '#333', fontWeight: 'bold'}}>{thousands(value)}</span>
  </div>
}