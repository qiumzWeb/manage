import React, {useEffect, useRef, useState} from 'react';
import { Card, Button, FormGroup, Message  } from '@/component';
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools';
import { useActivate } from 'react-activation';
import { baseInfo, getSavePackageInfo, formModel, getListData } from './config';
import { getStepBaseData, setStepBaseData, saveStepNode, stepJump } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import $http from 'assets/js/ajax';
import API from 'assets/api';
WarehouseConfigStep.title = '包材配置'
WarehouseConfigStep.home = '/warehouseConfigList'

export default function WarehouseConfigStep(props) {
  let baseData = getStepBaseData() || {};
  const saveDraftKey = 'step160DraftData_' + baseData.openWarehouseCode;
  const defaultData = {
    warehouseId: baseData.warehouseId,
    warehouseName: baseData.warehouseName,
    list: []
  }
  const [visible, setVisible] = useState(false);
  const form = useRef();
  const [formData, setFormData] = useState(defaultData)
  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 160
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify()
    setVisible(false)
    const cacheData = await window.dbStore.get(saveDraftKey);
    if (cacheData) {
      setFormData(cacheData)
    } else if (isModify()) {
      const res = await getListData({
        warehouseId: baseData.warehouseId,
      })
      setFormData({
        warehouseId: baseData.warehouseId,
        warehouseName: baseData.warehouseName,
        list: res
      })
    } else {
      console.log(defaultData, '默认数据====')
      setFormData(defaultData)
    }
    setVisible(true)
  }
  // 保存提交
  async function save() {
    try {
      const result = await form.current.getData();
      if (!result) {
        throw new Error('')
      }
      const params = result.list.map(v => {
        return {
          warehouseId: baseData.warehouseId,
          ...v
        }
      })
      await getSavePackageInfo(params);
      if (!isModify()) {
        saveStepNode(170);
      }
      Message.success('保存成功')
      window.dbStore.remove(saveDraftKey)
    } catch(e) {
      e && e.message && Message.error(e.message)
      throw new Error(e.message)
    }

  }
  // 保存草稿
  async function saveDraft() {
    try {
      const result = await form.current.getData(false);
      await window.dbStore.set(saveDraftKey, result);
      Message.success('保存草稿成功')
    } catch(e) {
      Message.error('保存草稿失败，请重试')
    }
  }
  return <div>
    <FormGroup
      hasBorder={false}
      loading={!visible}
      isDetail={() => !!getStepBaseData().readOnly}
      ref={form}
      data={formData}
      group={{
        other: {title: '包材信息', model: formModel}
      }}
    ></FormGroup>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="150">上一步</Button>
      </>}
      rightTool={<>
        {isModify() ? <>
          <Button size="large" p mr='10' onClick={save}>保存</Button>
          { getStepBaseData().warehouseStatus < 20 && <Button size="large" p onClick={async () => {
            await saveStepNode(170, true).then(_=> {
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
                  stepJump('170')
                },
                onCancel: () => {
                  window.Router.push('/warehouseConfigList', {noConfirm: true})
                }
              })
            })
          }} mr='10'>完成开仓</Button>}
        </> : <>
          <Button size="large" s mr='10' onClick={saveDraft}>保存为草稿</Button>
          <Button size="large" p mr='10' onClick={save}>保存</Button>
          { getStepBaseData().warehouseStatus < 20 && <Button size="large" p onClick={async () => {
            await save()
            await saveStepNode(170, true).then(_=> {
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
                  stepJump('170')
                },
                onCancel: () => {
                  window.Router.push('/warehouseConfigList', {noConfirm: true})
                }
              })
            })
          }} mr='10'>保存并完成开仓</Button>}
        </>}
        <Button size="large" s mr='10' onClick={() => {
          saveStepNode(170)
        }} call_jump="170">下一步</Button>

      </>}
    ></BottomTool>
  </div>
}
