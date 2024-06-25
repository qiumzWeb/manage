
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tab, Icon, FormGroup, Dialog, Message } from '@/component';
import { getUuid } from 'assets/js';
import { searchModel, columnsModel, searchUrl, batchExportModel, getCreateSysStoragePositions, storagelocationPreviewModel, getBatchDeleteStorage } from './config';
import Page from '@/atemplate/queryTable';
import $http from 'assets/js/ajax';
import { useActivate } from 'react-activation';
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import { getStepBaseData, setStepBaseData, getCopyWarehouseConfig, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import { getWareHouseDistrictOptions } from '@/pages/warehouseConfiguration/warehouseConfig/step40/config'
import { isEmpty } from '@/assets/js/common';
import Bus from 'assets/js/bus'
WarehouseConfigStep.title = '新增库位'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  let baseData = getStepBaseData() || {};
  const [data, setData] = useState({})
  const form = useRef()
  const queryTable = useRef()
  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 50
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify()
    const result = await getCopyWarehouseConfig()
    if (result) {
      saveStepNode(55)
    }
    const getDistrictOptions = getWareHouseDistrictOptions()
    const queryList = queryTable.current.getQueryList()
    queryList.field.reset()
    queryList.field.setValues({
      warehouseId: baseData.warehouseId,
      warehouseName: baseData.warehouseName
    })
    queryList.setState({
      tableData: []
    })
    getDistrictOptions.then(d => {
      if (!isEmpty(d)) {
        const defaultDistrict = d[0] && d[0].value
        queryList.field.setValues({
          warehouseDistrictIdList: [defaultDistrict],
        })
        setTimeout(() => {
          refresh()
        }, 100)
      }
    })
  }
  // 刷新
  function refresh() {
    queryTable && queryTable.current && queryTable.current.refresh && queryTable.current.refresh()
  }

  return <div>
    <Card title="库位管理" hasBorder={false}>
      <Card.Content>
        <Page
          ref={queryTable}
          queryListOptions={{
            showDefineSearch: false,
            pagination: true
          }}
        // 查询配置
          searchOptions={{
            url: searchUrl,
            method: 'post',
            model: searchModel,
            beforeSearch: (req) => {
              const searchParams = req.data || {}
              if (isEmpty(searchParams.warehouseDistrictIdList)) {
                return '请选择库区'
              }
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
            model: columnsModel,
            showRowSelection: true,
            tableProps: {
              inset: true,
              rowSelection: {
                getProps: record => {
                  return {
                    disabled: record.isCreated == 1
                  };
                }
              }
            }
          }}
          // 工具栏配置
          tools={[
            !baseData.readOnly && {render: function(props) {
              const { selectRows } = props
              return <Button mr="10" onClick={async () => {
                if (isEmpty(selectRows)) return Message.warning('请选择数据')
                try {
                  await getCreateSysStoragePositions(selectRows)
                  Message.success('库位生成成功')
                  saveStepNode(55)
                  refresh()
                } catch(e) {
                  Message.error(e.message)
                }
              }}>生成库位</Button>
            }} || null,
            !baseData.readOnly && {type: 'formDialog', config: batchExportModel, title: '批量删除库位', DialogWidth: 750, refresh: true,
              button: <Button><Icon type="upload"></Icon>批量删除库位</Button>,
              async onSubmit(fileData, orgData) {
                console.log(fileData, orgData, '批量导入==')
                try {
                  await getBatchDeleteStorage(fileData, baseData.warehouseId)
                  Message.success('导入成功')
                } catch(e) {
                  return e.message
                }
              }
            } || null,
          ]}
          // 表格操作栏配置
          operationsWidth={130}
          operations={[
            {type: 'formDialog', config: storagelocationPreviewModel, title: baseData.readOnly ? '查看货架' : '编辑货架', DialogWidth: '100%', refresh: true,
              show: (val, index, record) => record.isCreated == 1,
              footer: !baseData.readOnly,
              // 查询货架
              getData: async(record) => {
                try {
                  const list = await $http({
                    url: '/sys/storagePosition/preview',
                    method: 'get',
                    data: {
                      warehouseId: record.warehouseId,
                      shelvesId: record.shelvesId
                    }
                  })
                  return Array.isArray(list) && {list} || {list: []}
                } catch(e) {
                  Message.error(e.message)
                  return {list: []}
                }
              },
              async onSubmit(formData, orgData){
                let result = {}
                // 由于form 表单change 获取数据太耗性能，改用bus单独获取库位变动数据
                Bus.$emit('getStorageData', (changeData) => {
                  // 获取库位变动的数据
                  result = changeData
                })
                try {
                  await $http({
                    url: '/sys/storagePosition/delete',
                    method: 'post',
                    data: {
                      warehouseId: orgData.warehouseId,
                      shelvesId: orgData.shelvesId,
                      // 从变动的数据中筛选被删除的数据
                      storagePositionIdList: Object.values(result).filter(v => !v.selected).map(v => v.id)
                    }
                  })
                  Message.success('保存成功')
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
        <Button size="large" s call_jump="40">上一步</Button>
      </>}
      rightTool={<>
        <Button size="large" s mr='10' call_jump="55;请先生成库位">下一步</Button>
      </>}
    ></BottomTool>
  </div>
}