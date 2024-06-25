import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Message } from '@/component'
import { dataModel, conditionModel, modifyUrl} from './config'
import FormGroup from '@/component/FormGroup'
import $http from 'assets/js/ajax'
import { isEmpty } from 'assets/js'
import { StrToArray, ArrayToStr } from '@/report/utils'
import API from 'assets/api'
export default function App(props) {
  const [data, setData] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useRef()
  useEffect(() => {
    console.log(props.data, 7777)
    setData(props.data || {})
  }, [props.data])
  // 保存
  async function onOk() {
    const result = await form.current.getDataList()
    if (result) {
      const { condition, data } = result
      if (Object.values(data).every(d => isEmpty(d))) {
        return Message.warning('请填写更新参数(更新数据哉)')
      }
      data.areaCode = data.areaCode ?  data.areaCode + '' : ''
      const {warehouseId, districtIds} = condition
      Dialog.confirm({
        title: '确认提示',
        content: '确认修改？',
        onOk: () => {
          setLoading(true)
          $http({
            url: API.batchUpdatedistrictByCondition.replace("{warehouseId}", warehouseId),
            method: 'post',
            data: {
              districtIdList: districtIds,
              updateEntity: data
            }
          }).then(_ => {
            Message.success('修改成功')
            onClose()
            typeof props.refresh === 'function' && props.refresh()
          }).catch(e => {
            Message.error(e.message)
          }).finally(e => {
            setLoading(false)
          })
        }
      })
    }
  }
  // 关闭
  function onClose() {
    setVisible(false)
  }
  return <>
    <Button onClick={() => setVisible(true)}>批量修改</Button>
    <Dialog
      title='批量修改'
      width={850}
      visible={visible}
      onOk={onOk}
      onClose={onClose}
      onCancel={onClose}
      okProps={{loading, children: '执行批量修改'}}
    >
      <FormGroup
        ref={form}
        data={data}
        group={{
          condition: { title: '更新条件', model: conditionModel },
          data: { title: '更新数据域', subTitle: '未填写的属性不作更新', model: dataModel },
        }}
      ></FormGroup>
    </Dialog>
  </>
}