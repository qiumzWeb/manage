import React, {useRef, useEffect, useState} from 'react';
import { Card, Button, Icon, FormGroup, Dialog, Message } from '@/component';
import { getUuid, isEmpty } from 'assets/js';
import { defaultRecommendInfo, onShelvesRecommendInfo, getWarehousePutawayRecommendationList } from './config'
import { useActivate } from 'react-activation';
import $http from 'assets/js/ajax'
import API from 'assets/api'
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import { getStepBaseData, setStepBaseData, getCopyWarehouseConfig, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
WarehouseConfigStep.title = '上架配置'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  const form = useRef()
  const [visible, setVisible] = useState(false);
  let baseData = getStepBaseData() || {};
  const saveDraftKey = 'step90DraftData_' + baseData.openWarehouseCode;
  // 初始化默认值
  let defaultData = {uuid: getUuid()}
  InitDefaultData([defaultRecommendInfo, onShelvesRecommendInfo], defaultData)
  Object.assign(defaultData, {
    storageCheckingEndOfForm: 0,
    storageLocationFullLoad: 0,
    putawayCheckingEndOfForm: 0,
    isOnShelvesIntercept: 0,
    distinguishPutawayTransfer: 0,
    isStorageRecommendTransit: 0,
    findFirstPackageRule: '0',
    putAwayContainer: 0,
    warehouseId: baseData.warehouseId,
    warehouseName: baseData.warehouseName
  })
  const [data, setData] = useState(defaultData)
  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 90
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify()
    const result = await getCopyWarehouseConfig(true)
    if (result) {
      saveStepNode(100)
      await getInitData()
      window.dbStore.remove(saveDraftKey);
    } else {
      setVisible(false)
      try {
        const cacheData = await window.dbStore.get(saveDraftKey);
        if (cacheData) {
          setData(cacheData)
        } else if (isModify()) {
          await getInitData()
        } else {
          setData(defaultData)
        }
      } catch(e) {
        Message.error(e.message)
      }
    }
    setVisible(true)
  }
  // 获取 初始化数据
  async function getInitData() {
    let res = await getWarehousePutawayRecommendationList({
      warehouseId: baseData.warehouseId,
    })
    if (isEmpty(res)) {
      res = defaultData
    } else {
      res.readOnly = baseData.readOnly
    }
    setData(res)
  }
  // 保存草稿
  async function saveDraft() {
    const result = await form.current.getData(false);
    try {
      await window.dbStore.set(saveDraftKey, result);
      Message.success('保存草稿成功')
    } catch(e) {
      Message.error('保存草稿失败，请重试')
    }
  }
  // 保存
  async function onOk() {
    const formData = await form.current.getData()
    if (formData) {
      const params = {...data, ...formData}
      if (!isModify()) {
        await add(params)
      } else {
        await modify(params)
      }
      window.dbStore.remove(saveDraftKey);
    }
  }
  // 新增
  async function add(data) {
    try {
      await $http({
        url: API.createWarehousePutawayRecommendation.replace("{warehouseId}", data["warehouseId"]),
        method: 'post',
        data
      })
      saveStepNode(100)
      Message.success('新增成功')
    } catch(e) {
      Message.error(e.message)
      throw new Error(e.message)
    }
  }
  // 修改
  async function modify(modifyData) {
    try {
      await $http({
        url: API.modifyWarehousePutawayRecommendation.replace("{warehouseId}", data["warehouseId"]),
        method: 'post',
        data: modifyData
      })
      Message.success('修改成功')
    } catch(e) {
      Message.error(e.message)
      throw new Error(e.message)
    }
  }
  return <div>
    <FormGroup
      hasBorder={false}
      loading={!visible}
      ref={form}
      data={data}
      group={{
        sign: { title: '推荐配置', model: defaultRecommendInfo },
        bigSign: { title: '上架推荐配置', model: onShelvesRecommendInfo },
      }}
    ></FormGroup>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="80">上一步</Button>
      </>}
      rightTool={
        isModify() ? 
          <>
            <Button size="large" p onClick={onOk} mr='10'>保存</Button>
            <Button size="large" s mr='10' call_jump="100">下一步</Button>
          </>
        : <>
          <Button size="large" s onClick={saveDraft} mr='10'>保存为草稿</Button>
          <Button size="large" p mr='10' onClick={onOk} call_jump="100">保存并下一步</Button>
        </>
      }
    ></BottomTool>
  </div>
}