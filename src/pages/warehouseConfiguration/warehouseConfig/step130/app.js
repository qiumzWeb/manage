import React, {useRef, useEffect } from 'react';
import { Card, Button } from '@/component';
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import PageList from './index.jsx'
import { useActivate } from 'react-activation';
import { getStepBaseData, setStepBaseData, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
WarehouseConfigStep.title = '容器管理'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  let baseData = getStepBaseData() || {}
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 130
  }
  const pageRef = useRef()
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify();
    refresh()
  }
  // 刷新
  function refresh() {
    if (pageRef && pageRef.current && typeof pageRef.current.refresh === 'function') {
      pageRef.current.refresh()
    }
  }
  return <div>
    <Card title="容器配置" hasBorder={false}>
      <Card.Content>
        <PageList ref={pageRef}></PageList>
      </Card.Content>
    </Card>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="120">上一步</Button>
      </>}
      rightTool={<>
        <Button size="large" s mr='10' call_jump="140;请先新增容器">下一步</Button>
      </>}
    ></BottomTool>
  </div>
}