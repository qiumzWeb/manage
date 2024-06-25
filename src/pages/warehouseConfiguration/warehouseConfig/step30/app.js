import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tab, Icon, FormGroup, Dialog, Message, Badge } from '@/component';
import { getUuid, isEmpty } from 'assets/js';
import { baseInfo, storageProperty, verificationRules, getWareHouseDistrictList, addUrl, modifyUrl, deleteUrl } from './config'
import { useActivate } from 'react-activation';
import $http from 'assets/js/ajax'
import API from 'assets/api'
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import { getStepBaseData, setStepBaseData, getCopyWarehouseConfig, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { getBaseData } from '@/report/abnormalMonitor/dataBoard/config';
WarehouseConfigStep.title = '新增库区'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  const [ dataList, setDataList ] = useState([{uuid: getUuid(), isAdd: true}])
  const [ activeKey, setActiveKey ] = useState(null)
  const [ activeData, setActiveData ] = useState({})
  const form = useRef()
  const realActiveData = useRef()
  const [visible, setVisible] = useState(false);
  let baseData = getStepBaseData() || {};
  const saveDraftKey = 'step30DraftData_' + baseData.openWarehouseCode;
  // 初始化默认值
  let defaultData = {uuid: getUuid(), isAdd: true}
  InitDefaultData([baseInfo, storageProperty, verificationRules], defaultData)
  Object.assign(defaultData, {
    qcType: 0,
    recommendType: 0,
    warehouseId: baseData.warehouseId,
    warehouseName: baseData.warehouseName,
    readOnly: baseData.readOnly,
    administrativeArea: ''
  })
  realActiveData.current = activeData
  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 30
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify()
    setVisible(false)
    try {
      const cacheData = await window.dbStore.get(saveDraftKey);
      if (cacheData) {
        setDataList(cacheData)
      } else if (isModify()) {
        await getInitData(baseData.warehouseId)
      } else {
        console.log('复用--')
        const result = await getCopyWarehouseConfig()
        if (result) {
          saveStepNode(40)
          await getInitData(baseData.warehouseId)
          window.dbStore.remove(saveDraftKey)
        } else {
          setDataList([defaultData])
        }
      }
    } catch(e) {
      Message.error(e.message)
    }
    setVisible(true)
  }
  // 获取初始化数据
  async function getInitData(warehouseId, expand = {}) {
    let res = await getWareHouseDistrictList({
      warehouseId,
    })
    if (isEmpty(res)) {
      res = [defaultData]
    } else {
      res = res.map(r => {
        return Object.assign({}, r, {
          uuid: getUuid(),
          readOnly: baseData.readOnly,
          ...expand
        })
      })
    }
    setDataList(res)
  }
  // 保存草稿
  async function saveDraft() {
    try {
      await window.dbStore.set(saveDraftKey, dataList);
      Message.success('保存草稿成功')
    } catch(e) {
      Message.error('保存草稿失败，请重试')
    }
  }
  // 保存提交
  function saveConfirm() {
    Dialog.confirm({
      title: '提交',
      content: '确认保存当前库区？',
      onOk: onSave
    })
  }
  async function onSave() {
    try {
      console.log(activeData, '=====', realActiveData.current, '9999999999999999')
      const realData = realActiveData.current
      const result = await form.current.getData();
      if (result) {
        const submitUrl = !realData.isAdd ? modifyUrl : addUrl;
        const params = {...defaultData, ...result, warehouseId: baseData.warehouseId, uuid: realData.uuid}
        const res = await $http({
          url: submitUrl,
          method: 'post',
          data: { ...params, id: realData.isAdd ? undefined : realData.id}
        })
        if (!res || (res && isNaN(res))) {
          throw new Error('配置ID生成失败')
        }
        saveStepNode(40)
        const newActiveData = {...params, id: res, isAdd: undefined}
        // 更新数据
        setDataList((list) => [...list.map(l => l.uuid === realData.uuid && newActiveData || l)])
        setActiveData(newActiveData)
        window.dbStore.remove(saveDraftKey)
        Message.success('保存成功')
      }
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 新增库区
  async function add() {
    const newTabData = {...defaultData, uuid: getUuid(), isAdd: true}
    setDataList((list) => [ ...list, newTabData ])
    UpdateActiveTab(newTabData)
  }
  // 删除新增库区
  function onTabClose(key) {
    setDataList((list) => {
      const newList = list.filter(l => l.uuid !== key);
      return newList
    })
  }
  // 删除库区
  function onDelete() {
    if (activeData.id) {
      Dialog.confirm({
        title: '确认删除',
        content: '确定删除当前库区？',
        onOk: async() => {
          try {
            await $http({
              url: deleteUrl,
              method: 'post',
              data: {
                id: activeData.id
              }
            })
            Message.success('删除成功')
            onTabClose(activeKey)
          } catch(e) {
            Message.error(e.message)
          }
          
        }
      })
    } else {
      onTabClose(activeData.uuid)
    }
  }
  // Tab 更新
  async function onTabChange(key) {
    const activeTabItem = dataList.find(d => d.uuid === key)
    const currentData = await form.current.getData(false);
    if (activeTabItem.id && !activeTabItem.hasLoad) {
      setVisible(false)
      const res = await $http({
        url: API.getWareHouseDistrict,
        method: 'post',
        data: {id: activeTabItem.id + ''}
      }).then(d => {
        return {
          ...d,
          warehouseId: baseData.warehouseId,
          warehouseName: baseData.warehouseName,
        }
      }).catch(e => {
        Message.error(e.message)
        return {}
      })
      Object.assign(activeTabItem, res, {hasLoad: true})
      setVisible(true)
    }
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
          content: '您有新建库位未保存，是否放弃新建的库位并进入下一步操作？',
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
          !baseData.readOnly && <Button iconSize="small" mr="2" p onClick={add}><Icon mr="5" type="add"></Icon>新增库区</Button> || null
        }
        onChange={onTabChange}
        activeKey={activeKey}
        onClose={onTabClose}
        
      >
        {dataList.map(item => {
          return <Tab.Item
            title={<span>
              {
                item.name ?
                  item.isAdd ? <>{item.name}<span style={{color: '#666'}}>（新增）</span></>
                  : item.name
                : '新建库区'
              }
            </span>}
            key={item.uuid}
            closeable={item.isAdd}
          >
          </Tab.Item>
        })}
      </Tab>
      {!baseData.readOnly && <div style={{position: 'absolute', top: 50, right: 20, zIndex: 20}}>
        <Button s onClick={onDelete}><Icon type="ashbin"></Icon>删除</Button>
      </div>}
      <div style={{marginTop: 10}}>
        <FormGroup
          hasBorder={false}
          loading={!visible}
          isDetail={() => !!getStepBaseData().readOnly}
          ref={form}
          data={activeData}
          group={{
            base: {title: '基础信息', model: baseInfo},
            other: {title: '存储属于', model: storageProperty},
            base1: {title: '校验规则配置', model: verificationRules},
          }}
        ></FormGroup>
      </div>
    </div>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="20">上一步</Button>
      </>}
      rightTool={
        <>
          {
            !isModify() && <Button size="large" onClick={saveDraft} mr='10'>保存为草稿</Button>
          }
          <Button size="large" p onClick={onSave} mr='10'>保存当前库区</Button>
          <Button size="large" s mr='10' onClick={goNextValidate} call_jump="40">下一步</Button>
        </>

      }
    ></BottomTool>
  </div>
}