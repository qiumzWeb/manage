
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tab, Icon, FormGroup, Dialog, Message, Badge } from '@/component';
import { getUuid, isEmpty, filterNotEmptyData } from 'assets/js';
import { getListData, formModel, getAbnormalWarnName } from './config'
import { useActivate } from 'react-activation';
import $http from 'assets/js/ajax'
import moment from 'moment'
import API from 'assets/api'
import { getRangTime, getTimeToRange, getReceiver, getReceiverToStr } from '@/report/utils'
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import { getStepBaseData, setStepBaseData, getCopyWarehouseConfig, saveStepNode, stepJump, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
WarehouseConfigStep.title = '数据播报配置'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  const [ dataList, setDataList ] = useState([{uuid: getUuid(), isAdd: true}])
  const [ activeKey, setActiveKey ] = useState(null)
  const [ activeData, setActiveData ] = useState({})
  const form = useRef()
  const [visible, setVisible] = useState(false);
  let baseData = getStepBaseData() || {};
  const saveDraftKey = 'step180DraftData_' + baseData.openWarehouseCode;
  // 初始化默认值
  let defaultData = {uuid: getUuid()}
  InitDefaultData([formModel], defaultData)
  Object.assign(defaultData, {
    warehouseId: baseData.warehouseId,
    warehouseName: baseData.warehouseName,
  })

  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 180
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify()
    const result = await getCopyWarehouseConfig(true)
    if (result) {
      saveStepNode(190)
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
    let res = await getListData({
      warehouseId: baseData.warehouseId,
    })
    if (isEmpty(res)) {
      res = [defaultData]
    } else {
      res.forEach(r => {
        r.uuid = getUuid()
        r.isAdd = false
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
  async function onSave() {
    try {
      const result = await form.current.getData();
      if (result) {
        const params = {
          ...defaultData,
          ...activeData,
          ...result,
          warehouseId: baseData.warehouseId,
          uuid: activeData.uuid,
        }
        const submitUrl = activeData.isAdd ? '/sys/broadcast/config/add' : '/sys/broadcast/config/update'
        const res = await $http({
          url: submitUrl,
          method: 'post',
          data: filterNotEmptyData({
            ...params,
            id: activeData.id || undefined,
            receiver: JSON.stringify(getReceiver(params.receiver))
          })
        })
        if (!res || (res && isNaN(res))) {
          throw new Error('配置ID生成失败')
        }
        saveStepNode(190)
        const newActiveData = {...params, id: res, isAdd: false}
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
    const newTabData = {
      ...defaultData, uuid: getUuid(), isAdd: true,
      contentTypeDisabled: dataList.map(d => d.contentType)
    }
    setDataList((list) => [ ...list, newTabData ])
    UpdateActiveTab(newTabData)
  }
  // 删除新增库区
  function onTabClose(key) {
    setDataList((list) => {
      const newList = list.filter(l => l.uuid !== key);
      return newList.map(n => ({
        ...n,
        contentTypeDisabled: newList.filter(l => l.uuid !== n.uuid).map(d => d.contentType)
      }))
    })
  }
  // 删除库区
  function onDelete() {
    if (activeData.id) {
      Dialog.confirm({
        title: '确认删除',
        content: '确认删除后数据不可恢复！',
        onOk: async() => {
          try {
            await $http({
              url: '/sys/broadcast/config/delete',
              method: 'post',
              data: {
                id: activeData.id,
                warehouseId: getStepBaseData().warehouseId
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
                item.contentType ?
                  item.isAdd ? <>{getAbnormalWarnName(item)}<span style={{color: '#666'}}>（新增）</span></>
                  : getAbnormalWarnName(item)
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
          isDetail={() => !!baseData.readOnly}
          ref={form}
          data={activeData}
          group={{
            base: {title: '配置信息', model: formModel}
          }}
        ></FormGroup>
      </div>
    </div>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="170">上一步</Button>
      </>}
      rightTool={
        <>
          {
            !isModify() && <Button size="large" s onClick={saveDraft} mr='10'>保存为草稿</Button>
          }
          <Button size="large" p onClick={onSave} mr='10'>保存当前配置</Button>
        { getStepBaseData().warehouseStatus < 20 && <Button size="large" p onClick={async () => {
          await saveStepNode(190, true).then(_=> {
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
                stepJump('190')
              },
              onCancel: () => {
                window.Router.push('/warehouseConfigList', {noConfirm: true})
              }
            })
          })
        }} mr='10'>完成开仓</Button>}
        <Button size="large" s mr='10' onClick={async() => {
          await goNextValidate()
          saveStepNode(190)
        }} call_jump="190">下一步</Button>
        </>

      }
    ></BottomTool>
  </div>
}
