import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, AForm, NumberPicker, Message, DialogButton, APaginglist, AEditTable, Icon } from '@/component';
import { getUuid, isEmpty } from 'assets/js';
import { tColumns, searchModel, batchModifyBaseInfo, batchModifyOtherInfo, batchExportModel } from './config'
import { useActivate } from 'react-activation';
import $http from 'assets/js/ajax'
import API from 'assets/api'
import BottomTool from '@/pages/warehouseConfiguration/warehouseConfigProgress/bottom-tools'
import { getStepBaseData, setStepBaseData, getCopyWarehouseConfig, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
import DialogButtomModel from '@/atemplate/queryTable/config/dialogButton'
import ModifyRecommendType from './modifyRecommendType'
WarehouseConfigStep.title = '库位配置'
WarehouseConfigStep.home = '/warehouseConfigList'
export default function WarehouseConfigStep() {
  let baseData = getStepBaseData() || {};
  const defaultData = {}
  // InitDefaultData([TunnelDetailModel], defaultData)
  Object.assign(defaultData, {
    warehouseId: baseData.warehouseId,
    warehouseName: baseData.warehouseName
  })
  const [data, setData] = useState({})
  const [selectRows, setSelectRows] = useState([])
  const form = useRef()
  const query = useRef()
  const EditForm = useRef()
  // 判断是否为修改配置
  function isModify() {
    baseData = getStepBaseData() || {}
    return baseData.currentSaveNode > 55
  }
  // 初始化数据
  useEffect(initStep, []);
  useActivate(initStep)
  async function initStep() {
    isModify()
    const result = await getCopyWarehouseConfig()
    if (result) {
      saveStepNode(60)
    }
    refresh()
  }
  // 处理查询参数
  function beforeSearch(req) {
    isModify()
    // 重置勾选项
    setSelectRows([]);
    const { pageNum, pageSize, ...params  } = req.data
    const url = req.url.replace("{warehouseId}", baseData.warehouseId)
    return {
      ...req,
      url: url + `?pageNum=${pageNum}&pageSize=${pageSize}`,
      data: {
        ...params,
        warehouseName: undefined,
        warehouseId: baseData.warehouseId
      }
    }
  }

  // 处理渲染数据
  function formatData() {

  }
// 刷新
  function refresh(){
    const searchData = form.current.getData()
    query.current.refresh(searchData)
  }

  // 选择性保存
  async function save() {
    if (isEmpty(selectRows)) {
      Message.warning('请先从列表选择需要变更数据')
    } else {
      const DataList = EditForm.current.getData()
      const editData = DataList.filter(d => selectRows.some(s => s.id == d.id))
      try {
        await $http({
          url: API.batchUpdatePositions.replace("{warehouseId}",baseData.warehouseId),
          method: 'post',
          data: editData
        })
        Message.success('保存成功')
        saveStepNode(60)
        refresh()
      } catch(e) {
        Message.error(e.message)
      }
    }
  }
  // 批量导入 
  async function getBatchExport(fileData, orgData) {
    console.log(fileData, orgData, '批量上传优秀级==')
    try {
      const fileList = fileData.file
      const formData = new FormData()
      Array.isArray(fileList) && fileList.forEach(file => {
        formData.append('file', file.originFileObj)
      })
      formData.append('warehouseId', orgData.warehouseId)
      const res = await $http({
        url: API.uploadPickPriority,
        method: 'post',
        data: formData,
        timeout: 60000,
        oldApi: true,
        dataType: 'form',
      })
      console.log(res, 888)
      Message.success(`上传成功：${res?.response?.message}`)
    } catch(e) {
      return e.message
    }

  }
  // 判断列表行 是否禁用
  function checkRowDisabled(record) {
    return !selectRows.some(s => s.id == record.id)
  }
  return <div>
    <Card title="库位配置" hasBorder={false}>
      <Card.Content>
        <AForm
          ref={form}
          formModel={searchModel}
          data={defaultData}
        ></AForm>
        <>
          {!baseData.readOnly && <DialogButton title="大批量修改"
            DialogWidth={900} refresh={refresh}
            groupConfig={{
              base: {title: '更新条件域', model: batchModifyBaseInfo},
              updateEntity: {title: '更新数据域', model: batchModifyOtherInfo}
            }}
            onSubmit={async(formData) => {
              const params = {
                conditionList: formData.conditionList || [],
                districtIdList: formData.districtIds,
                updateEntity: {
                  "recommendType": formData.recommendType || '',
                  "length": formData.length,
                  "width": formData.width,
                  "height": formData.height,
                  "pkgNumLimit": formData.pkgNumLimit
                }
              }
              try {
                await $http({
                  url: API.batchUpdatePositionsByCondition.replace("{warehouseId}", baseData.warehouseId),
                  method: 'post',
                  data: params
                })
                Message.success('修改成功')
                saveStepNode(60)
              } catch(e) {
                return e.message
              }
            }}
          ></DialogButton>}
          {
            !baseData.readOnly && <DialogButton title="上传库位优先级"
              config={batchExportModel}
              data={defaultData}
              DialogWidth={750}
              onSubmit={getBatchExport}
              refresh={refresh}
            >
                <Button ml="10" mr="10"><Icon type="upload"></Icon>上传库位优先级</Button>
            </DialogButton>
          }
          {/* 变更库区推荐类型 */}
          {!baseData.readOnly && <ModifyRecommendType data={selectRows} refresh={refresh}></ModifyRecommendType>}
          <Button p ml="10" onClick={() => refresh()}>查询</Button>
        </>
        <APaginglist
          ref={query}
          initSearch={false}
          component={AEditTable}
          formatSearchParams={beforeSearch}
          formatData={formatData}
          pagination={true}
          hasBorder={false}
          dataSourceKey="data"
          options={{
            url: API.querySroragePositionsForSetting
          }}
          attrs={{
            ref: EditForm,
            columns: tColumns,
            rowSelection: {
              onChange: (keys, rows) => {
                setSelectRows(rows)
              },
              selectedRowKeys: selectRows.map(s => s.id)
            },
            children: [
              <div key={1} slot="tableCell" prop="pkgNumLimit">
                  {({record, ...props}) => {
                      const disabled = checkRowDisabled(record)
                      const value = disabled ? record.pkgNumLimit : props.value
                      return <NumberPicker {...props} value={value}
                      disabled={disabled} style={{width: '100%'}}/>
                  }}
              </div>,
              <div key={2} slot="tableCell" prop="length">
                  {({record, ...props}) => {
                    const disabled = checkRowDisabled(record)
                    const value = disabled ? record.length : props.value
                      return <NumberPicker {...props} value={value}
                      disabled={disabled} style={{width: '100%'}}/>
                  }}
              </div>,
              <div key={3} slot="tableCell" prop="width">
                  {({record, ...props}) => {
                    const disabled = checkRowDisabled(record)
                    const value = disabled ? record.width : props.value
                      return <NumberPicker {...props} value={value}
                      disabled={disabled} style={{width: '100%'}}/>
                  }}
              </div>,
              <div key={4} slot="tableCell" prop="height">
                  {({record, ...props}) => {
                    const disabled = checkRowDisabled(record)
                    const value = disabled ? record.height : props.value
                      return <NumberPicker {...props} value={value}
                      disabled={disabled} style={{width: '100%'}}/>
                  }}
              </div>
            ]
          }}
        ></APaginglist>
      </Card.Content>
    </Card>
    <BottomTool
      leftTool={<>
        <Button size="large" s call_jump="50">上一步</Button>
      </>}
      rightTool={<>
        <Button size="large" p mr='10' disabled={isEmpty(selectRows)} onClick={save}>保存</Button>
        {!isModify() && <Button s size="large" mr='10' onClick={() => {
          saveStepNode(60)
        }} call_jump="60">跳过并下一步</Button>}
        <Button size="large" mr='10' s call_jump="60;请先完成库位参数配置">下一步</Button>
      </>}
    ></BottomTool>
  </div>
}