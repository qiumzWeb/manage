

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tab, Icon, FormGroup, Dialog, Message, Badge } from '@/component';
import { useActivate } from 'react-activation';
import $http from 'assets/js/ajax'
import { getUuid, isEmpty, filterNotEmptyData, isTrue } from 'assets/js';
import { getListData } from './config'
import baseModel from './editConfig/base'
import computeParamsModel from './editConfig/computeParams'
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import { getStepBaseData, setStepBaseData, getCopyWarehouseConfig, saveStepNode, stepJump, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
WarehouseConfigStep.title = '包裹分段时长配置'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  const [ dataList, setDataList ] = useState([{uuid: getUuid(), isAdd: true}])
  const [ activeKey, setActiveKey ] = useState(null)
  const [ activeData, setActiveData ] = useState({})
  const form = useRef()
  const [visible, setVisible] = useState(false);
  let baseData = getStepBaseData() || {};
  const saveDraftKey = 'step200DraftData_' + baseData.openWarehouseCode;
  // 初始化默认值
  let defaultData = {uuid: getUuid()}
  InitDefaultData([baseModel,computeParamsModel], defaultData)
  Object.assign(defaultData, {
    warehouseId: baseData.warehouseId,
    warehouseName: baseData.warehouseName,
    kpiType: '1',
    isEnable: '0',
    configNodeList: [],
    'kpiStartEffectiveDate': '',
    'kpiEndEffectiveDate': ''
  })

  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 200
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify()
    const result = await getCopyWarehouseConfig(true)
    if (result) {
      saveStepNode(210)
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
        console.log(e)
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
        Object.assign(r, {
          uuid: getUuid(),
          isAdd: false,
          warehouseName: baseData.warehouseName,
          configNodeList: r.segmentConfig && r.segmentConfig.configNodeList || []
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
        const submitUrl = activeData.isAdd ? '/sys/kpi/segmentConfig/create' : '/sys/kpi/segmentConfig/modify'
        const res = await $http({
          url: submitUrl,
          method: 'post',
          data: filterNotEmptyData({
            ...params,
            segmentConfig: {
              configNodeList: result.configNodeList
            },
            id: activeData.id || undefined,
          })
        })
        if (!res || (res && isNaN(res))) {
          throw new Error('配置ID生成失败')
        }
        saveStepNode(210)
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
              url: `/sys/kpi/segmentConfig/delete/${activeData.id}`,
              method: 'post',
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
                item.kpiName ?
                  item.isAdd ? <>{item.kpiName}<span style={{color: '#666'}}>（新增）</span></>
                  : item.kpiName
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
            base: { title: '时长考核基础信息', model: baseModel },
            instock: { title: data => data.kpiType == '1' ?  '入库时长考核计算参数' : '出库时长考核计算参数', model: computeParamsModel },
            // outstock: { title: '出库时长考核计算参数', model: computeParamsModel, show: data => data.kpiType == '2' },
          }}
        ></FormGroup>
      </div>
    </div>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="190">上一步</Button>
      </>}
      rightTool={
        <>
          {
            !isModify() && <Button size="large" s onClick={saveDraft} mr='10'>保存为草稿</Button>
          }
          <Button size="large" p onClick={onSave} mr='10'>保存当前配置</Button>
        { getStepBaseData().warehouseStatus < 20 && <Button size="large" p onClick={async () => {
          await saveStepNode(210, true).then(_=> {
            setStepBaseData({
              warehouseStatus: 20
            })
            Dialog.alert({
              title: '开仓完成',
              content: <div>
                <p>完成开仓后，未启用配置前，可继续编辑开仓流程配置。</p>
              </div>,
              okProps: {children: '知道了'},
              onOk: () => {
                window.Router.push('/warehouseConfigList', {noConfirm: true})
              },
              onClose: () => {
                window.Router.push('/warehouseConfigList', {noConfirm: true})
              }
            })
          })
        }} mr='10'>完成开仓</Button>}
        </>

      }
    ></BottomTool>
  </div>
}
