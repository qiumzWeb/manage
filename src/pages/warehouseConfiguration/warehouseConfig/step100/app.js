import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tab, Icon, FormGroup, Dialog, Message, Badge } from '@/component';
import { getUuid, isEmpty } from 'assets/js';
import { getSysWarehouseTaskAllocationConfigList } from './config'
import { getWveTypeName, getDefaultData, getSaveConfig } from './details/config'
import { useActivate } from 'react-activation';
import $http from 'assets/js/ajax'
import API from 'assets/api'
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import { getStepBaseData, setStepBaseData, getCopyWarehouseConfig, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import FormDetail from './details'
WarehouseConfigStep.title = '下架配置'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  let baseData = getStepBaseData() || {};
  const saveDraftKey = 'step100DraftData_' + baseData.openWarehouseCode;
  // 初始化默认值
  let defaultData = getDefaultData(baseData)
  const [ dataList, setDataList ] = useState([{...defaultData, isAdd: true}])
  const [ activeKey, setActiveKey ] = useState(defaultData.uuid)
  const [ activeData, setActiveData ] = useState(defaultData)
  const form = useRef()
  const [visible, setVisible] = useState(false);

  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 100
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify()
    const result = await getCopyWarehouseConfig(true)
    if (result) {
      saveStepNode(110)
      await getInitData()
      window.dbStore.remove(saveDraftKey);
    } else {
      setVisible(false)
      try {
        const cacheData = await window.dbStore.get(saveDraftKey);
        if (cacheData) {
          setDataList(cacheData)
        } else if (isModify()) {
          await getInitData()
        } else {
          setDataList([defaultData])
        }
      } catch(e) {
        Message.error(e.message)
      }
    }
    setVisible(true)
  }
  // 初始化数据
  async function getInitData() {
    let res = await getSysWarehouseTaskAllocationConfigList({
      warehouseId: baseData.warehouseId,
    })
    if (isEmpty(res)) {
      res = [defaultData]
    } else {
      res.forEach(r => {
        r.uuid = getUuid()
        r.readOnly = baseData.readOnly
      })
    }
    setDataList(res)
  }
  // 保存草稿
  async function saveDraft() {
    try {
      const currentData = await form.current.getData(false);
      await window.dbStore.set(saveDraftKey, dataList.map(l => {
        const d = l.uuid === activeData.uuid ? {...activeData, ...currentData} : l;
        return d;
      }));
      Message.success('保存草稿成功')
    } catch(e) {
      Message.error('保存草稿失败，请重试')
    }
  }
  // 保存提交
  function saveConfirm() {
    Dialog.confirm({
      title: '提交',
      content: '确认保存当前配置？',
      onOk: onSave
    })
  }
  async function onSave() {
    try {
      const result = await form.current.getData();
      if (result) {
        const params = {...defaultData, ...result, warehouseId: baseData.warehouseId, uuid: activeData.uuid}
        const res = await getSaveConfig({ ...params, id: activeData.id || undefined })
        if (!res || (res && isNaN(res))) {
          throw new Error('配置ID生成失败')
        }
        saveStepNode(110)
        const newActiveData = {...params, id: res}
        // 更新数据
        setDataList((list) => [...list.map(l => l.uuid === activeData.uuid && newActiveData || l)])
        setActiveData(newActiveData)
        window.dbStore.remove(saveDraftKey)
        Message.success('保存成功')
      }
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 新增
  async function add() {
    const newTabData = {...defaultData, uuid: getUuid(), isAdd: true}
    setDataList((list) => [ ...list, newTabData ])
    UpdateActiveTab(newTabData)
  }
  // 删除新增
  function onTabClose(key) {
    setDataList((list) => {
      const newList = list.filter(l => l.uuid !== key);
      return newList
    })
  }
  // Tab 更新
  async function onTabChange(key) {
    const activeTabItem = dataList.find(d => d.uuid === key)
    const currentData = await form.current.getData(false);
    setDataList((list) => [
      ...list.map(l => {
        const d = l.uuid === activeData.uuid ? {...activeData, ...currentData} : l;
        return d;
      })
    ])
    UpdateActiveTab(activeTabItem)
  }
  // 更新激活卡
  function UpdateActiveTab(item) {
    setActiveData(item)
    setActiveKey(item.uuid)
  }
  // 下一步未保存判断
  async function goNextValidate() {
    if (dataList.some(d => d.isAdd)) {
      await new Promise((resolve, reject) => {
        Dialog.confirm({
          title: '提示',
          content: '您有新建配置未保存，是否放弃新建的配置并进入下一步操作？',
          onOk: resolve,
          onClose: reject,
          onCancel: reject
        })
      })
    }
  }
  return <div>
    <div style={{position: 'relative'}}>
      <Tab type="wrapped"
        defaultActived='last'
        extra={
          !baseData.readOnly && <Button iconSize="small" mr="2" p onClick={add}><Icon mr="5" type="add"></Icon>新增波次规则</Button> || null
        }
        onChange={onTabChange}
        activeKey={activeKey}
        onClose={onTabClose}
        
      >
        {dataList.map((item, index) => {
          return <Tab.Item
            title={<span>
              {
                item.waveType ?
                  item.isAdd ? <>
                  {getWveTypeName(item)}
                  <span style={{color: '#666'}}>（新增）</span></>
                  : getWveTypeName(item)
                : '新建配置'
              }
            </span>}
            key={item.uuid}
            closeable={item.isAdd}
          >
          </Tab.Item>
        })}
      </Tab>
      <div style={{marginTop: 10}}>
        <FormDetail
          ref={form}
          data={activeData}
          visible={visible}
        ></FormDetail>
      </div>
    </div>
    <BottomTool
      leftTool={<>
        <Button size="large" call_jump="90">上一步</Button>
      </>}
      rightTool={
        <>
          {
            !isModify() && <Button size="large" onClick={saveDraft} mr='10'>保存为草稿</Button>
          }
          <Button size="large" p onClick={onSave} mr='10'>保存当前配置</Button>
          <Button size="large" s mr='10' onClick={goNextValidate} call_jump="110">下一步</Button>
        </>

      }
    ></BottomTool>
  </div>
}