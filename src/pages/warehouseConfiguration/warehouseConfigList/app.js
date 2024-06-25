import React, {useEffect, useState, useRef } from 'react';
import Page from '@/atemplate/queryTable';
import { Message, Dialog, Button } from "@/component";
import { setStepBaseData } from '../warehouseConfigProgress/config';
import { useActivate } from 'react-activation';
import { 
  qColumns, qSearch, detailModel
} from './config'
import {
  searchUrl, getCreateWarehouse, updateWarehouseStatus
} from './api'
import { isEmpty, getObjType, getWName } from 'assets/js'

App.title="开仓配置"

export default function App() {
  const queryTable = useRef()
  useActivate(() => {
    queryTable.current && typeof queryTable.current.refresh === 'function' && queryTable.current.refresh()
  })
  return <div>
    <Page
      ref={queryTable}
      // 自定义查询 自定表头 code
      code="warehouse_config_list"
    // 查询配置
      searchOptions={{
        url: searchUrl,
        method: 'post',
        model: qSearch
      }}
      // 表格配置
      tableOptions={{
        model: qColumns,
      }}
      // 工具栏配置
      tools={[
        { type: 'formDialog', title: '开仓', config: detailModel, DialogWidth: 550, refresh: true,
          async onSubmit(data) {
            const result = await new Promise(resolve => {
              if (data.baseWarehouseId) {
                Dialog.confirm({
                  title: `确认复用【${getWName(data.baseWarehouseId)}】`,
                  content: <div>
                    <p className='warn-color' style={{fontSize: 14, marginBottom: 10}}>选择复用仓库后，进入以下配置流程后将会自动复用该仓的数据</p>
                    <p>
                      场地配置： 新增库区、新增巷道货架、新增库位、库位配置、新增库区组
                    </p>
                  </div> ,
                  onOk: () => resolve(true),
                  onCancel: () => resolve(false),
                  onClose: () => resolve(false)
                })
              } else {
                resolve(true)
              }
            })
            if (result) {
              try {
                await getCreateWarehouse({
                  baseWarehouseId: 0,
                  ...data
                });
                Message.success('新增仓库成功')
              } catch(e) {
                return e.message
              }
            }
            return result
          }
        },
      ]}
      // 表格操作栏配置
      operationsWidth={130}
      operations={[
        { title: '编辑', render: function(props) {
            return <Button text type="link" mr='10' onClick={() => {
              const {data} = props
              setStepBaseData({
                ...data,
                isTMall: data.warehouseType == 1
              }, false)
              console.log(data, 'baseData=====')
              const jumpNode = data.currentSaveNode > 200 ? 10 : data.currentSaveNode;
              window.Router.push(`/warehouseConfig/step${jumpNode}`)
            }}>{props.title}</Button>
          },
          // show: (val, index, record) => [10, 20].includes(record.warehouseStatus)
        },
        // { type: 'formDialog', title: '启用',  refresh: true,
        //   confirmMsg: (data) => `确认启用【${data.warehouseName}】配置？`,
        //   show: (val, index, record) => record.warehouseStatus == 20,
        //   async onSubmit(data) {

        //     try {
        //       await updateWarehouseStatus({
        //         openWarehouseCode: data.openWarehouseCode,
        //         warehouseStatus: true,
        //       });
        //       Message.success('启用成功')
        //     } catch(e) {
        //       return e.message
        //     }
        //   }
        // },
        // { type: 'formDialog', title: '作废',  refresh: true,
        //   confirmMsg: (data) => `作废后该配置将无法进行修改，确认废弃？`,
        //   show: (val, index, record) => [10, 20].includes(record.warehouseStatus),
        //   async onSubmit(data) {
        //     try {
        //       await updateWarehouseStatus({
        //         openWarehouseCode: data.openWarehouseCode,
        //         warehouseStatus: false,
        //       });
        //       Message.success('废弃成功')
        //     } catch(e) {
        //       return e.message
        //     }
        //   }
        // },
      ]}
    >
      <div slot="tableCell" prop="openWarehouseCode">
        {(val, index, record) => {
          if (record.warehouseStatus == 30) {
            return <Button text type="link" onClick={() => {
              // window.hasSavePreventLeave = false
              setStepBaseData({
                ...record,
                readOnly: true,
                isTMall: record.warehouseType == 1
              }, false)
              window.Router.push(`/warehouseConfig/step10`)
            }}>{val}</Button>
          }
          return val || '-'
        }}
      </div>
    </Page>
  </div>

}
