import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Message, Icon, FormGroup, Dialog } from '@/component';
import { getUuid } from 'assets/js';
import { tColumns, formModel, fenpeiModel, searchUrl, addUrl, modifyUrl, deleteUrl } from './config'
import Page from '@/atemplate/queryTable';
import $http from 'assets/js/ajax';
import API from 'assets/api';
import { useActivate } from 'react-activation';
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import { getStepBaseData, setStepBaseData, getCopyWarehouseConfig, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { isEmpty } from '@/assets/js/common';
WarehouseConfigStep.title = '新增库区组'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  let baseData = getStepBaseData() || {};
  const queryTable = useRef()
  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 60
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify()
    const queryList = queryTable.current.getQueryList()
    queryList.field.reset()
    queryList.field.setValues({
      warehouseId: baseData.warehouseId,
      warehouseName: baseData.warehouseName
    })
  // 复用 
    const result = await getCopyWarehouseConfig()
    if (result) {
      saveStepNode(70)
    }
    refresh()
  }
  // 刷新
  function refresh() {
    queryTable && queryTable.current && queryTable.current.refresh && queryTable.current.refresh()
  }
  return <div>
    <Card title='库区组配置' hasBorder={false}>
      <Card.Content>
        <Page
          ref={queryTable}
          queryListOptions={{
            showDefineSearch: false,
            pagination: true,
          }}
        // 查询配置
          searchOptions={{
            url: searchUrl,
            method: 'get',
            beforeSearch: (req) => {
              const searchParams = req.data || {}
              return {
                ...req,
                data: {
                  ...searchParams,
                  warehouseName: undefined,
                  warehouseId: baseData.warehouseId
                }
              }
            }
          }}
          // 表格配置
          tableOptions={{
            model: tColumns,
            formatData: (res) => {
              return {
                ...res,
                data: Array.isArray(res.data) && res.data.map(d => ({
                  ...d,
                  fenpeiDetail: d
                })) || []
              }
            },
            tableProps: {
              inset: true,

            }
          }}
          // 工具栏配置
          tools={[
            !baseData.readOnly && {type: 'formDialog', config: formModel, title: '新增库区组', DialogWidth: 750, refresh: true,
              data: {
                warehouseId: baseData.warehouseId,
                warehouseName: baseData.warehouseName
              },
              show: (val, index, record) => !baseData.readOnly,
              async onSubmit(formData, orgData){
                try {
                  await $http({
                    url: addUrl,
                    method: 'post',
                    data: {
                      ...formData,
                      warehouseId: baseData.warehouseId,
                    }
                  })
                  Message.success('新增库区成功')
                } catch(e) {
                  return e.message
                }
              }
            } || null
          ]}
          // 表格操作栏配置
          operationsWidth={130}
          operations={[
            {type: 'formDialog', config: fenpeiModel, title: '分配库区', DialogWidth: 900, refresh: true,
              show: (val, index, record) => !baseData.readOnly,
              async onSubmit(formData, orgData){
                const { selectedRows } = formData.fenpeiDetail
                try {
                  await $http({
                    url: API.assignWarehouseDistrict,
                    method: 'post',
                    data: {
                      warehouseId: orgData.warehouseId,
                      groupId: orgData.groupId,
                      groupName: orgData.groupName,
                      selectedDistrictId: selectedRows.map(s => s.id) + ''
                    }
                  })
                  Message.success('分配成功')
                  saveStepNode(70)
                } catch(e) {
                  return e.message
                }
              }
            },
            {type: 'formDialog', config: formModel, title: '修改', DialogWidth: 750, refresh: true,
              show: (val, index, record) => !baseData.readOnly,
              async onSubmit(formData, orgData){
                try {
                  await $http({
                    url: modifyUrl,
                    method: 'post',
                    data: {
                      groupId: orgData.groupId,
                      ...formData
                    }
                  })
                  Message.success('修改成功')
                } catch(e) {
                  return e.message
                }
              }
            },
            {type: 'formDialog', confirmMsg: '确认删除后数据不可恢复！', title: '删除', refresh: true,
              show: (val, index, record) => !baseData.readOnly,
              async onSubmit(orgData ){
                try {
                  await $http({
                    url: deleteUrl,
                    method: 'post',
                    data: {
                      groupId: orgData.groupId,
                    }
                  })
                  Message.success('删除成功')
                } catch(e) {
                  return e.message
                }
              }
            }
          ]}
        >
        </Page>
      </Card.Content>
    </Card>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="55">上一步</Button>
      </>}
      rightTool={<>
        {!isModify() && <Button s size="large" mr='10' onClick={() => {
          saveStepNode(70)
        }} call_jump="70">跳过并下一步</Button>}
        <Button size="large" s mr='10' call_jump="70;请先完成分配库区">下一步</Button>
      </>}
    ></BottomTool>
  </div>
}