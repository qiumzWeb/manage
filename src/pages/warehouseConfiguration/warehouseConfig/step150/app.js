import React, {useRef, useEffect } from 'react';
import { Card, Button, Dialog } from '@/component';
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools';
import { useActivate } from 'react-activation';
import { getStepBaseData, setStepBaseData, saveStepNode, stepJump } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import SortingWallPlan from './sortingWallPlan'
WarehouseConfigStep.title = '分拣计划配置'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  let baseData = getStepBaseData() || {}
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 150
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
    <Card title="分拣计划配置" hasBorder={false}>
      <Card.Content>
        <SortingWallPlan ref={pageRef}></SortingWallPlan>
      </Card.Content>
    </Card>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="140">上一步</Button>
      </>}
      rightTool={<>
        {/* <Button size="large" mr='10'>保存</Button> */}
        { getStepBaseData().warehouseStatus < 20 && <Button size="large" p onClick={async () => {
          await saveStepNode(160, true).then(_=> {
            setStepBaseData({
              warehouseStatus: 20
            })
            Dialog.confirm({
              title: '开仓完成',
              content: <div>
                <p>完成开仓后，未启用配置前，可继续编辑开仓流程配置。</p>
                <p>开仓主流程配置项已完成， 是否继续完成其它配置？</p>
              </div>,
              okProps: {children: '继续其它配置'},
              cancelProps: {children: '返回列表完成开仓'},
              onOk: () => {
                stepJump('160')
              },
              onCancel: () => {
                window.Router.push('/warehouseConfigList', {noConfirm: true})
              }
            })
          })
        }} mr='10'>完成开仓</Button>}
        <Button size="large" s mr='10' onClick={() => {
          saveStepNode(160)
        }} call_jump="160">下一步</Button>
      </>}
    ></BottomTool>
  </div>
}