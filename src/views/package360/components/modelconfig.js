import React, {useRef, useState, useEffect, useMemo} from 'react'
import QueryList from "@/component/queryList";
import { searchModel, columns, modifyModel } from '../config/modelconfig'
import { Button, Dialog, Message } from "@/component";
import AForm from '@/component/AForm'
import $http from "assets/js/ajax";
import { getConfigList, getConfigDelete, getConfigSave } from '../api'

export default function ModelConfig() {
  const [data, setData] = useState({})
  const [visible, setVisible] = useState(false)
  const [okLoading, setOkLoading] = useState(false)
  const form = useRef()
  const queryListRef = useRef()
  useEffect(() => {

  },[])
  // 请求前数据处理
  const beforeSearch = (req) => {
  }
  // 响应数据处理
  const formatData = (res) => {

  }
  // 保存
  async function save() {
    try {
      setOkLoading(true)
      const result = await form.current.validate()
      if (!result) return
      const formData = form.current.getData()
      let params = formData
      // 修改
      if (!data.isAdd) {
        params = {
          ...data,
          ...formData
        }
      }
      try {
        JSON.parse(formData.metaData)
       } catch(e) {
        return Message.error('请求参数JSON格式不正确')
       }
      await getConfigSave(params)
      Message.success('保存成功')
      refresh()
      onClose()
    } catch(e) {
      Message.error(e.message)
    } finally {
      setOkLoading(false)
    }
  }
  // 关闭
  function onClose() {
    setVisible(false)
  }
  // 删除数据
  function toDelete(record) {
    Dialog.confirm({
      title: '提示',
      content: '是否确认删除数据？',
      onOk: async() => {
        try {
          await getConfigDelete(record.id)
          Message.success('删除成功')
          refresh()
        } catch(e) {
          Message.error(e.message)
        }
      },
    })
  }
// 刷新
  const refresh = () => {
    queryListRef.current && queryListRef.current.refresh && queryListRef.current.refresh()
  }

  return (
    <div>
      <QueryList
        ref={queryListRef}
        searchModel={searchModel}
        columns={columns}
        formatSearchParams={beforeSearch}
        formatData={formatData}
        tableOptions={{
          url: getConfigList,
          method: 'post',
        }}
      >
        <div slot={'tools'}>
          <Button onClick={() => {
            setData({
              isAdd: true
            })
            setVisible(true)
          }}>新增</Button>
        </div>
        <div slot={'tableCell'} prop={'operation_'}>
          {
            (value, index, record) => (
              <div>
                <Button text type="link" mr="10" onClick={() => {
                  record.metaData = JSON.stringify(JSON.parse(record.metaData), null, 2)
                  setData(record)
                  setVisible(true)
                }}>编辑</Button>
                <Button text type="link" mr="10" onClick={() => toDelete(record)}>删除</Button>
              </div>
            )
          }
        </div>
      </QueryList>
      <Dialog
        visible={visible}
        title={data.isAdd ? '新增' : '修改'}
        width={1100}
        okProps={{loading: okLoading}}
        onOk={save}
        onClose={onClose}
        onCancel={onClose}
      >
        <AForm ref={form} data={data} formModel={modifyModel}></AForm>
      </Dialog>
    </div>
  )
}
