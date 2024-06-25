import React, {useEffect, useRef, useState} from 'react';
import { Card, Button, FormGroup, Message  } from '@/component';
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools';
import { useActivate } from 'react-activation';
import { virtualWarehouseInfo, getVirtualWarehouseList, getSaveVirtualWarehouse } from './config';
import { getStepBaseData, setStepBaseData, saveStepNode } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import $http from 'assets/js/ajax';
import API from 'assets/api';
WarehouseConfigStep.title = '新增虚仓库';
WarehouseConfigStep.home = '/warehouseConfigList';

export default function WarehouseConfigStep(props) {
  let baseData = getStepBaseData() || {};
  const saveDraftKey = 'step20DraftData_' + baseData.openWarehouseCode;
  const defaultData = {
    companyId: baseData.companyId,
    warehouseId: baseData.warehouseId,
    warehouseName: baseData.warehouseName
  }
  const [visible, setVisible] = useState(false);
  const form = useRef();
  const [formData, setFormData] = useState(defaultData)
  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 20
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
      const res = await getVirtualWarehouseList({
        warehouseId: baseData.warehouseId,
        companyId: baseData.companyId
      })
      setFormData({
        companyId: baseData.companyId,
        warehouseId: baseData.warehouseId,
        warehouseName: baseData.warehouseName,
        virtualWarehouseList: res
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
      const params = result.virtualWarehouseList.map(v => {
        return {
          companyId: baseData.companyId,
          warehouseId: baseData.warehouseId,
          virtualWarehouseShort: v.virtualWarehouseName,
          virtualWarehouseName: v.virtualWarehouseName,
          virtualWarehouseCode: v.virtualWarehouseCode,
          virtualWarehouseDescription: v.virtualWarehouseDescription,
        }
      })
      await getSaveVirtualWarehouse(params);
      if (!isModify()) {
        saveStepNode(30);
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
        other: {title: '虚仓基础信息', model: virtualWarehouseInfo}
      }}
    ></FormGroup>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="10">上一步</Button>
      </>}
      rightTool={<>
        {isModify() ? <>
          <Button size="large" p mr='10' onClick={save}>保存</Button>
          <Button
            size="large" s mr='10'
            call_jump="30"
          >下一步</Button>
        </> : <>
          <Button size="large" s mr='10' onClick={saveDraft}>保存为草稿</Button>
          <Button
            size="large" p mr='10'
            onClick={save}
            call_jump="30"
          >保存并下一步</Button>
        </>}

      </>}
    ></BottomTool>
  </div>
}