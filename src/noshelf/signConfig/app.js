import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns,searchUrl, signModel, bigSignModel, smallSignModel, smallRejectModel } from './config'
import FormGroup from '@/component/FormGroup'
import $http from 'assets/js/ajax'
import { StrToArray, ArrayToStr } from '@/report/utils'
import { isEmpty } from 'assets/js'
import moment from 'moment'
import ExportFile from '@/component/ExportFile'
import API from 'assets/api'
export default function App(props) {
  const {goDetail} = props
  const [data, setData] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const query = useRef()
  const form = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
  }
  const formatData = (data) => {
  }
  function getParams() {
    return query.current.field.getValues()
  }
  // 保存
  async function onOk() {
    const formData = await form.current.getData()
    if (formData) {
      const params = {
        ...formData,
        ...ArrayToStr(formData, [
          'auditCountryCode',
          'auditPackageType',
          'auditCarrierType'
        ])
      }
      setLoading(true)
      if (data.isAdd) {
        await add(params)
      } else {
        await modify(params)
      }
      setLoading(false)
    }
  }
  // 新增
  async function add(data) {
    try {
      await $http({
        url: API.addWarehouseSignConfigManageList,
        method: 'post',
        data
      })
      Message.success('新增成功')
      onClose()
      refresh()
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 修改
  async function modify(modifyData) {
    try {
      await $http({
        url: API.modifyWarehouseSignConfigManageList,
        method: 'post',
        data: Object.assign({id: data.id}, modifyData)
      })
      Message.success('修改成功')
      onClose()
      refresh()
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 关闭
  function onClose() {
    setVisible(false)
  }
  // 刷新
  function refresh() {
    query.current.refresh()
  }
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      columnWidth={150}
      defaultValue="-"
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: searchUrl,
        method: 'post',
      }}
    >
      <div slot="tools">
        <Button mr="10" onClick={() => {
          setVisible(true)
          setData({isAdd: true, warehouseId: getParams().warehouseId})
        }}>新增</Button>
        <ExportFile btnProps={{mr: 0}} commandKey="/pcsWarehouseSignconfig" params={() => getParams()}></ExportFile>
      </div>
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          return <div>
            <Button text type='link' mr="10" onClick={() => {
              setVisible(true)
              setData({
                ...record,
                ...StrToArray(record, [
                  'auditCountryCode',
                  'auditPackageType',
                  'auditCarrierType'
                ])
              })
            }}>修改</Button>
          </div>
        }}
      </div>
    </QueryList>
    <Dialog
      title={data.isAdd ? '新增' : '修改'}
      width={850}
      visible={visible}
      onOk={onOk}
      onClose={onClose}
      onCancel={onClose}
      okProps={{loading}}
    >
      <FormGroup
        ref={form}
        data={data}
        group={{
          sign: { title: '签收通用配置', model: signModel },
          bigSign: { title: '大包签收配置', model: bigSignModel },
          smallSign: { title: '小包签收配置', model: smallSignModel },
          smallReject: { title: '小包拒收配置', model: smallRejectModel }
        }}
      ></FormGroup>
    </Dialog>
  </div>
}