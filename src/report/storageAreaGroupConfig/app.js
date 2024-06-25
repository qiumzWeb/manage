import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, formModel,searchUrl, addUrl, modifyUrl, deleteUrl} from './config'
import AForm from '@/component/AForm'
import $http from 'assets/js/ajax'
import { isEmpty } from 'assets/js'
import Fenpei from './fenpei'
export default function App(props) {
  const {goDetail} = props
  const [data, setData] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const query = useRef()
  const form = useRef()
  const fenpeiRef = useRef()
  const beforeSearch = (req) => {
  }
  const formatData = (data) => {
  }
  function getParams() {
    return query.current.field.getValues()
  }

  // 保存
  async function onOk() {
    const result = await form.current.validate()
    if (result) {
      const formData = form.current.getData()
      setLoading(true)
      if (data.isAdd) {
        await add({
          ...formData,
        })
      } else {
        await modify({
          ...formData,
        })
      }
      setLoading(false)
    }
  }
  // 新增
  async function add(data) {
    try {
      await $http({
        url: addUrl,
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
        url: modifyUrl,
        method: 'post',
        data: Object.assign({
          groupId: data.groupId
        }, modifyData)
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
  // 删除
  function onDelete(data) {
    Dialog.confirm({
      title: '删除',
      content: '确认删除后数据不可恢复！',
      onOk: async() => {
        try {
          await $http({
            url: deleteUrl,
            method: 'post',
            data: {
              groupId: data.groupId
            }
          })
          Message.success('删除成功')
          refresh()
        } catch(e) {
          Message.error(e.message)
        }
      }
    })
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
        method: 'get',
      }}
    >
      <div slot="tools">
        <Button onClick={() => {
          setVisible(true)
          setData({isAdd: true, warehouseId: getParams().warehouseId})
        }}>新增</Button>
      </div>
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          return <div>
            <Button mr='10' text type="link" onClick={() => {
              fenpeiRef.current.open(record)
            }}>分配库区</Button>
            <Button text type='link' mr="10" onClick={() => {
              setVisible(true)
              setData(record)
            }}>修改</Button>
            <Button text type="link" onClick={() => onDelete(record)}>删除</Button>
          </div>
        }}
      </div>
    </QueryList>
    <Dialog
      title={data.isAdd ? '新增' : '修改'}
      width={800}
      visible={visible}
      onOk={onOk}
      onClose={onClose}
      onCancel={onClose}
      okProps={{loading}}
    >
      <AForm data={data} formModel={formModel} ref={form}></AForm>
    </Dialog>
    <Fenpei ref={fenpeiRef} callBack={refresh}></Fenpei>
  </div>
}