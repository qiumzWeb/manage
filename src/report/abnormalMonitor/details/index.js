import React, {useState, useEffect, useRef, useImperativeHandle} from 'react'
import { Button, Dialog, Input, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, defaultSearchTime, getTime} from './config'
import ExportFile from '@/component/ExportFile/index'
import API from 'assets/api'
import AForm from '@/component/AForm'
import $http from 'assets/js/ajax'
export default React.forwardRef(function App(props, ref) {
  const query = useRef()
  const form = useRef()
  const [params, setParams] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const beforeSearch = (req) => {
    const [s, e] = req.data.markingTime || []
    if (!req.data.warehouseId) return '请选择仓库';
    req.data.markingTimeS = s
    req.data.markingTimeE = e
    delete req.data.markingTime
    setParams({...(req.data || {})})
  }
  const formatData = () => {}
  useImperativeHandle(ref, () => ({
    field: getQuery().field,
    handleSearch: () => {
        getQuery().refresh()
    }
  }))
  function getQuery() {
    return query.current
  }
  function setRemark(data) {
    setData(data)
    setVisible(true)
  }
  async function onOk() {
    const remark = form.current.getData()
    const param = {
        ...remark,
        warehouseId: data.warehouseId,
        lp: data.lp,
        mailNo: data.mailNo,
        packageType: data.packageType,
    }
    try {
        await $http({
            url: API.updateAbnormalPkgRemarks,
            method: 'post',
            data: param
        })
        Message.success('修改备注成功')
        getQuery().refresh()
        onClose()
    } catch(e) {
        Message.error(e.message)
    }
  }
  function onClose() {
    setVisible(false)
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
      defaultValue='-'
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: API.getAbnormalPackageList,
        method: 'post',
        attrs: {
          defineFieldCode: 'abnormalMonitorDetails'
        }
      }}
    >
      <div slot="tools">
        <ExportFile params={() => ({
          markingTimeS: defaultSearchTime[0],
          markingTimeE: defaultSearchTime[1],
          ...params
        })} commandKey="/pcsAbnormalPackageList" btnProps={{mr: 0}}></ExportFile>
      </div>
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          return <Button type="link" text onClick={() => {
            setRemark(record)
          }}>备注</Button>
        }}
      </div>
    </QueryList>
    <Dialog
        title="填写备注"
        visible={visible}
        width={600}
        onOk={onOk}
        onClose={onClose}
        onCancel={onClose}
        okProps={{loading}}
    >
        <AForm data={data} ref={form} formModel={{
            remarks: {
                label: '',
                span: 24,
                component: Input.TextArea,
                attrs: {
                    maxLength: 200,
                    showLimitHint: true,
                    placeholder: '请输入备注信息',
                }
            }
        }}></AForm>
    </Dialog>
  </div>
})