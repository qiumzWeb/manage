import React, {useRef, useEffect } from 'react';
import { Card, Button, Dialog, Message } from '@/component';
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import SortingWallManage from './manage';
import { useActivate } from 'react-activation';
import { getStepBaseData, setStepBaseData, saveStepNode, stepJump, getCopyWarehouseConfig } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
WarehouseConfigStep.title = '分拨墙配置'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  let baseData = getStepBaseData() || {}
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 140
  }
  const pageRef = useRef()
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify();
    const result = await getCopyWarehouseConfig(true)
    if (result) {
      saveStepNode(150)
    }
    refresh()
  }
  // 刷新
  function refresh() {
    if (pageRef && pageRef.current && typeof pageRef.current.refresh === 'function') {
      pageRef.current.refresh()
    }
  }
  return <div>
    <Card title="分拨墙配置" hasBorder={false}>
      <Card.Content>
        <SortingWallManage ref={pageRef}></SortingWallManage>
      </Card.Content>
    </Card>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="130">上一步</Button>
      </>}
      rightTool={<>
        { getStepBaseData().warehouseStatus < 20 && <Button size="large" p onClick={async () => {
          if (!isModify()) return Message.warning('请先新增分拨墙')
          await saveStepNode(150, true).then(_=> {
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
                stepJump('150')
              },
              onCancel: () => {
                window.Router.push('/warehouseConfigList', {noConfirm: true})
              }
            })
          })
        }} mr='10'>完成开仓</Button>}
        <Button size="large" s mr='10' call_jump="150">下一步</Button>
      </>}
    ></BottomTool>
  </div>
}