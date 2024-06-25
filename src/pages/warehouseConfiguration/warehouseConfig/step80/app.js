
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tab, Icon, FormGroup, Dialog, Message, ASelect, Badge } from '@/component';
import { getUuid, isEmpty, filterNotEmptyData } from 'assets/js';
import { baseInfo, InstoreRuleInfo, instoreTipsInfo, getInstockConfigList } from './config'
import { getServiceTypeOptions } from '@/pages/warehouseConfiguration/warehouseConfig/step30/config'
import { useActivate } from 'react-activation';
import $http from 'assets/js/ajax'
import API from 'assets/api'
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import { getStepBaseData, setStepBaseData, getCopyWarehouseConfig, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
WarehouseConfigStep.title = '入库配置'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  const [ dataList, setDataList ] = useState([{uuid: getUuid(), isAdd: true}])
  const [ activeKey, setActiveKey ] = useState(null)
  const [ activeData, setActiveData ] = useState({})
  const form = useRef()
  const [visible, setVisible] = useState(false);
  let baseData = getStepBaseData() || {};
  const saveDraftKey = 'step80DraftData_' + baseData.openWarehouseCode;
  // 初始化默认值
  let defaultData = {uuid: getUuid()}
  InitDefaultData([baseInfo, InstoreRuleInfo, instoreTipsInfo], defaultData)
  Object.assign(defaultData, {
    warehouseId: baseData.warehouseId,
    warehouseName: baseData.warehouseName,
    alertDivision: "0",
    alertDivisionSpecial: "0",
    alertElectric: "0",
    alertElectricSpecial: "0",
    alertResult: "0",
    alertResultSpecial: "0",
    alertService: "0",
    alertServiceSpecial: "0",
    labelUrl: "https://needNotPrint.com",
    validWeight: '0',
    validVolume: '0',
    isAutoSign: 0,
    directLargeIntercept: 0,
  })

  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 80
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify()
    const result = await getCopyWarehouseConfig(true)
    if (result) {
      saveStepNode(90)
      await getInitData()
      window.dbStore.remove(saveDraftKey)
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
    let res = await getInstockConfigList({
      warehouseId: baseData.warehouseId,
    })
    if (isEmpty(res)) {
      res = [defaultData]
    } else {
      res.forEach(r => {
        r.uuid = getUuid()
        r.readOnly = baseData.readOnly
        r.countryArea = Array.isArray(r.countryArea) && r.countryArea.map(c => c && c.split('_')[0] || c) || []
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
      const result = await form.current.getData();
      if (result) {
        const params = {...defaultData, ...result, warehouseId: baseData.warehouseId, uuid: activeData.uuid}
        const res = await $http({
          url: '/sys/instockConfig/edit',
          method: 'post',
          data: filterNotEmptyData({ ...params, id: activeData.id || undefined})
        })
        if (!res || (res && isNaN(res))) {
          throw new Error('配置ID生成失败')
        }
        saveStepNode(90)
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
        content: '确定删除当前配置？',
        onOk: async() => {
          try {
            await $http({
              url: API.deleteInstockConfig,
              method: 'post',
              data: activeData.id
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
          content: '您有新建入库配置未保存，是否放弃新建的入库配置并进入下一步操作？',
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
          !baseData.readOnly && <Button iconSize="small" mr="2" p onClick={add}><Icon mr="5" type="add"></Icon>新增配置</Button> || null
        }
        onChange={onTabChange}
        activeKey={activeKey}
        onClose={onTabClose}
        
      >
        {dataList.map((item, index) => {
          return <Tab.Item
            title={<span>
              {
                item.serviceType ?
                  item.isAdd ? <>
                  <ASelect value={item.serviceType} isDetail getOptions={async() => await getServiceTypeOptions}></ASelect>
                  <span style={{color: '#666'}}>（新增）</span></>
                  : <ASelect value={item.serviceType} isDetail getOptions={async() => await getServiceTypeOptions}></ASelect>
                : '新建配置'
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
          ref={form}
          data={activeData}
          group={{
            base: {title: '基础信息', model: baseInfo},
            other: {title: '校验规则配置', model: InstoreRuleInfo},
            base1: {title: '入库提示', model: instoreTipsInfo},
          }}
        ></FormGroup>
      </div>
    </div>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="70">上一步</Button>
      </>}
      rightTool={
        <>
          {
            !isModify() && <Button size="large" s onClick={saveDraft} mr='10'>保存为草稿</Button>
          }
          <Button size="large" p onClick={onSave} mr='10'>保存当前配置</Button>
          <Button size="large" s mr='10' onClick={goNextValidate} call_jump="90">下一步</Button>
        </>

      }
    ></BottomTool>
  </div>
}