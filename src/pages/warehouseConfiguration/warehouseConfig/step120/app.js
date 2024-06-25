import React, {useEffect, useRef, useState} from 'react';
import { Card, Button, FormGroup, Message  } from '@/component';
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools';
import { useActivate } from 'react-activation';
import { baseInfo, opCodeModel, getExceptionTypeList, getConfirmPassWord, getSaveData } from './config';
import { getStepBaseData, setStepBaseData, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import $http from 'assets/js/ajax';
import API from 'assets/api';
import { isEmpty } from 'assets/js';
WarehouseConfigStep.title = '异常配置'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  let baseData = getStepBaseData() || {};
  const saveDraftKey = 'step120DraftData_' + baseData.openWarehouseCode;
  const defaultData = {}
  InitDefaultData([baseInfo], defaultData)
  Object.assign(defaultData, {
    warehouseId: baseData.warehouseId,
    warehouseName: baseData.warehouseName,
    hasOpCode: '0',
    opCodeList: undefined
  })
  const [visible, setVisible] = useState(false);
  const form = useRef();
  const [formData, setFormData] = useState(defaultData)
  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 120
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    try {
      if (!isModify() && !baseData.readOnly && baseData.baseWarehouseId) {
        const list = await getExceptionType(baseData.baseWarehouseId)
        if (!isEmpty(list)) {
          await saveData({
            hasOpCode: '1',
            opCodeList: list.map(l => ({
              ...l,
              id: undefined,
              warehouseId: baseData.warehouseId,
              warehouseName: baseData.warehouseName
            }))
          }, false)
        }
      } else {
        setVisible(false)
        const cacheData = await window.dbStore.get(saveDraftKey);
        if (cacheData) {
          setFormData(cacheData)
        } else if (isModify()) {
          await getInitData()
        } else {
          setFormData(defaultData)
        }
      }
    } catch(e) {
      Message.error(e.message)
    }
    setVisible(true)
  }
  // 初始化数据
  async function getInitData() {
    await getExceptionPassWord()
    await getExceptionType()
  }
  // 获取异常密码
  async function getExceptionPassWord() {
    try {
      const res = await getConfirmPassWord({
        warehouseId: baseData.warehouseId,
      })
      setFormData({
        ...defaultData,
        warehouseId: baseData.warehouseId,
        warehouseName: baseData.warehouseName,
        ...res
      })
      return res || {}
    } catch(e) {
      Message.error(e.message)
      return {}
    }
  }
  // 获取异常类型
  async function getExceptionType(warehouseId = baseData.warehouseId) {
    try {
      const list = await getExceptionTypeList({warehouseId})
      setFormData((data) => {
        return {
          ...data,
          hasOpCode: isEmpty(list) ? '0' : '1',
          opCodeList: list
        }
      })
      return list
    } catch(e) {
      Message.error(e.message)
      return []
    }
  }
  // 保存提交
  async function save() {
    try {
      const result = await form.current.getData();
      if (!result) {
        throw new Error('')
      }
      await saveData(result)
      Message.success('保存成功')
    } catch(e) {
      e && e.message && Message.error(e.message)
      throw new Error(e.message)
    }
  }
  // 数据保存
  async function saveData(data, hasSavePassWord = true) {
    const saveResult = await getSaveData(data, hasSavePassWord);
    const errorMsgList = saveResult.filter(f => typeof f === 'string')
    if (!errorMsgList) return
    if(errorMsgList.length < 2 && hasSavePassWord) {
      saveStepNode(130);
      window.dbStore.remove(saveDraftKey)
      initStep()
    }
    if (!isEmpty(errorMsgList)) {
      throw new Error(errorMsgList + '')
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
      ref={form}
      data={formData}
      group={{
        base: {title: '异常密码配置', model: baseInfo},
        other: {title: '异常类型配置', model: opCodeModel}
      }}
    ></FormGroup>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="110">上一步</Button>
      </>}
      rightTool={<>
        {isModify() ? <>
          <Button size="large" p mr='10' onClick={save}>保存</Button>
          <Button
            size="large" s mr='10'
            call_jump="130"
          >下一步</Button>
        </> : <>
          <Button size="large" s mr='10' onClick={saveDraft}>保存为草稿</Button>
          <Button
            size="large" p mr='10'
            onClick={save}
            call_jump="130"
          >保存并下一步</Button>
        </>}

      </>}
    ></BottomTool>
  </div>
}