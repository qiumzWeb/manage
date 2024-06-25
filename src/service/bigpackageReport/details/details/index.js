import React, {useState, useEffect, useImperativeHandle, useRef} from 'react'
import AForm from '@/component/AForm'
import FormGroup from '@/component/FormGroup'
import $http from 'assets/js/ajax'
import CUSTOMER_API from 'assets/api/customer-api'
import { Message, Button, Dialog, Input } from '@/component'
import { baseModel, smallPackageModel, packageStatusLogModel, systemLogModel} from './config'
import qs from 'querystring'
export default React.forwardRef(function ListDetails(props, ref) {
  const {refresh} = props
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const remarkRef = useRef()
  const [record, setRecord] = useState()
  const [remarkLoading, setRemarkLoading] = useState(false)
  const [finishLoading, setFinishLoading] = useState(false)
  useImperativeHandle(ref, () => ({
    open(record){
      setVisible(true)
      setRecord(record)
      getDetails(record)
    }
  }))
  function onClose() {
    setVisible(false)
    setData({})
  }
  // 完结大包
  async function finishBigPackage() {
    const {id, warehouseId} = record
    setFinishLoading(true)
    try {
      await $http({
        url: CUSTOMER_API.bigPackageOver,
        method: 'get',
        data: {
          id,
          warehouseId,
          bigBagId: data.bigBagId
        }
      })
      Message.success('完结大包成功')
      onClose()
      typeof refresh === 'function' && refresh()
    } catch(e){
      Message.error(e.message)
    } finally {
      setFinishLoading(false)
    }
  }
  // 保存备注
  async function saveRemark() {
    const result = await remarkRef.current.validate()
    if (!result) return
    const params = remarkRef.current.getData()
    const {id, warehouseId} = record
    setRemarkLoading(true)
    try {
      await $http({
        url: CUSTOMER_API.saveBigPackageRemark + '?' + qs.stringify({
          ...params,
          id,
          warehouseId
        }),
        method: 'post'
      })
      Message.success('保存成功')
      getDetails(record)
    } catch(e){
      Message.error(e.message)
    } finally {
      setRemarkLoading(false)
    }
  }
  // 获取详情
  async function getDetails(data) {
    try {
      if (!data.id || !data.warehouseId) {
        throw new Error('查询数据异常')
      }
      setLoading(true)
      let res = await $http({
        url: CUSTOMER_API.queryBigPackageDetail,
        method: 'get',
        data: {
          id: data.id,
          warehouseId: data.warehouseId
        }
      })

      setData({
        ...(res || {}),
        ...(res && (res.packageInfo || {}) || {})
      })
    } catch(e){
      Message.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return <Dialog
    title="详情"
    width="100%"
    visible={visible}
    footer={false}
    onClose={onClose}
  >
  <FormGroup loading={loading} data={data} group={{
    base:{ title: '大包信息', model: baseModel},
    small:{ title: '大包内小包明细', model: smallPackageModel},
    plog:{ title: '大包状态日志', model: packageStatusLogModel},
    slog:{ title: '系统日志信息', model: systemLogModel},
    remark: { title: '备注', model: {}}
  }}>
    <div slot="smallExtend">
      <Button type="primary" onClick={finishBigPackage} loading={finishLoading}>完结大包</Button>
    </div>
    <div slot="remarkExtend">
    <AForm ref={remarkRef} formModel={{
      remark: {
          label: '',
          span: 12,
          required: true,
          component: Input.TextArea,
          attrs: {
              autoHeight: {minRows: 6, maxRows: 20},
              maxLength: 400,
              showLimitHint: true,
          }
      }
    }}></AForm>
  <Button mt="10" mb="10" onClick={saveRemark} loading={remarkLoading} type="primary">保存备注</Button>
    </div>
  </FormGroup>
  </Dialog>
})
