import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tab, Icon, AForm, Dialog, Upload, DialogButton, Message } from '@/component';
import QueryList from '@/component/queryList/index';
import { getUuid } from 'assets/js';
import { TunnelModel, TunnelDetailModel, ShelvesDetailModel, batchExportModel } from './config'
import { useActivate } from 'react-activation';
import $http from 'assets/js/ajax'
import API from 'assets/api'
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import { getStepBaseData, setStepBaseData, getCopyWarehouseConfig, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import DialogButtomModel from '@/atemplate/queryTable/config/dialogButton'
WarehouseConfigStep.title = '新增巷道货架'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  let baseData = getStepBaseData() || {};
  const defaultData = {}
  InitDefaultData([TunnelDetailModel], defaultData)
  Object.assign(defaultData, {
    warehouseId: baseData.warehouseId,
    warehouseShortname: baseData.warehouseName
  })
  const [visible, setVisible] = useState(false);
  const saveDraftKey = 'step40DraftData_' + baseData.openWarehouseCode;
  const query = useRef()
  const addShelves = useRef()
  const addData = useRef(defaultData)
  
  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 40
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify()
    const result = await getCopyWarehouseConfig()
    if (result) {
      saveStepNode(50)
    }
    refresh()
  }
  // 查询前
  function beforeSearch(req) {
    return {
      ...req,
      data: {
        ...req.data,
        warehouseId: baseData.warehouseId
      }
    }
  }
  function formatData(res, req, format) {
    return {
      ...res,
      data: Array.isArray(res.data) && res.data.map(d => ({
        ...d,
        warehouseId: baseData.warehouseId,
        warehouseShortname: baseData.warehouseName,
        id: isModify() ?  d.id : undefined
      }))
    }
  }
  // 巷道新增/修改
  async function TunnelEdit(formData, orgData) {
    console.log(orgData, '999999999')
    try {
      const id = await $http({
        url: API.addLaneway,
        method: 'post',
        data: {
          ...orgData,
          ...formData
        }
      })
      Message.success('保存成功')
      // saveStepNode(50)
      if (!orgData.id) {
        addData.current.id = id;
        addShelves.current.open()
      }
    } catch(e) {
      return e.message
    }
  }
  // 修改货架
  async function ShelvesModify(formData, orgData) {
   console.log(formData, orgData, '--')
   const params = formData.list.map(l => ({
    ...l,
    roadwayId: orgData.id,
    warehouseId: orgData.warehouseId,
    refWarehouseDistrictId: formData.refWarehouseDistrictId
   }))
   try {
    await $http({
      url: '/sys/storagelocation/batchCreate',
      method: 'post',
      data: params
    })
    Message.success('保存成功')
    saveStepNode(50)
   } catch(e) {
    return e.message
   }
  }
  // 批量导入 
  async function getBatchExport(fileData, orgData) {
    console.log(fileData, orgData, '批量导入==')
    try {
      const fileList = fileData.file
      const formData = new FormData()
      Array.isArray(fileList) && fileList.forEach(file => {
        formData.append('file', file.originFileObj)
      })
      formData.append('warehouseId', orgData.warehouseId)
      await $http({
        url: '/sys/laneway/batchAddlaneway',
        method: 'post',
        data: formData,
        timeout: 60000,
        dataType: 'form',
      })
      Message.success('导入成功')
      saveStepNode(50)
    } catch(e) {
      return e.message
    }

  }
  // 刷新
  function refresh() {
    query && query.current && query.current.refresh && query.current.refresh()
  }

  return <div>
    <Card title="巷道货架信息" hasBorder={false}>
      <Card.Content>
        <QueryList
          ref={query}
          toolSearch={false}
          showFormCollapse={false}
          initSearch={true}
          columns={TunnelModel}
          columnWidth={150}
          pagination={true}
          formatSearchParams={beforeSearch}
          formatData={formatData}
          tableOptions={{
            url: '/sys/laneway/queryList',
            method: 'get',
            attrs: {
              inset: true,
            }
          }}
        >
          <div slot='tools' >
            {!baseData.readOnly && <span style={{display: 'flex', alignItems: 'center'}}>
              <DialogButton
                title="新增巷道"
                config={TunnelDetailModel}
                data={defaultData}
                DialogWidth={750}
                onSubmit={TunnelEdit}
                refresh={refresh}
              >
                <Button style={{width: '100%'}}>
                  <Icon type="add"></Icon>新增巷道
                </Button>
              </DialogButton>
              <DialogButton title="批量导入"
                config={batchExportModel}
                data={defaultData}
                DialogWidth={750}
                onSubmit={getBatchExport}
                refresh={refresh}
              >
                  <Button ml="10" mr="10"><Icon type="upload"></Icon>批量导入</Button>
              </DialogButton>
            </span>}
          </div>
          <div slot="tableCell" prop="make">
            {(val, index, record) => {
              return <div>
                {!baseData.readOnly && <DialogButton
                  title="修改"
                  config={TunnelDetailModel}
                  btnProps={{text: true, type: 'link', mr: 10}}
                  data={record}
                  DialogWidth={750}
                  onSubmit={TunnelEdit}
                  refresh={refresh}
                ></DialogButton>}
                {record.id && <DialogButtomModel
                  title={baseData.readOnly ? '查看货架' : "编辑货架"}
                  config={ShelvesDetailModel}
                  btnProps={{text: true, type: 'link', mr: 10}}
                  data={record}
                  footer={!baseData.readOnly}
                  getData={async(recordData) => {
                    const newData = {
                      refWarehouseDistrictId: recordData.refWarehouseDistrictId,
                      list: [{}]
                    }
                    try {
                      const res = await $http({
                        url: 'sys/storagelocation/list',
                        method: 'post',
                        data: {
                          warehouseId:recordData.warehouseId,
                          roadwayId: recordData.id,
                          pageNum: 1,
                          pageSize: 1000,
                        }
                      })
                      const list = res.result || [{}]
                      list.forceUpdate = true
                      newData.list = list
                      return newData
                    } catch(e) {
                      return newData
                    }
                  }}
                  DialogWidth={900}
                  onSubmit={ShelvesModify}
                  refresh={true}
                  queryListRefresh={refresh}
                ></DialogButtomModel>}
              </div>
            }}
          </div>
        </QueryList>
        <DialogButton
          title={"新增货架"}
          ref={addShelves}
          config={ShelvesDetailModel}
          data={addData.current}
          DialogWidth={900}
          onSubmit={ShelvesModify}
          refresh={refresh}
        >
          <></>
        </DialogButton>
      </Card.Content>
    </Card>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="30">上一步</Button>
      </>}
      rightTool={<>
        {/* <Button size="large" mr='10'>保存</Button> */}
        <Button size="large" s mr='10' call_jump="50;请先新增巷道再完成货架配置">下一步</Button>
      </>}
    ></BottomTool>
  </div>
}