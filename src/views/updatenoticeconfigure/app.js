import React, {useState, useEffect, useRef} from 'react'
import {getUpdateTips} from '@/layout/versionUpdateTips'
import AForm from '@/component/AForm'
import { Button, Message } from '@/component'
import {formModel} from './config'
import $http from 'assets/js/ajax'
export default function App() {
  const [data, setData] = useState({content: ''})
  const [loading, setLoading] = useState(false)
  const formRef = useRef()
  function getData() {
    getUpdateTips.then(e => {
      e && e.content && setData({
        content: e.content
      })
    })
  }
  useEffect(() => {
    getData()
  }, [])
  async function onSend() {
    const form = formRef && formRef.current
    const data = form && form.getData()
    setLoading(true)
    try {
      await $http({
        url: `/tool/updateTips/modify`,
        method: 'post',
        data
      })
      Message.success('发布成功')
    } catch (e) {
      Message.error(e.message || e || '发布失败')
    } finally {
      setLoading(false)
    }
  }
  return <div>
    <Button type="primary" mb="10" loading={loading} onClick={onSend}>发布通知</Button>
    <AForm ref={formRef} formModel={formModel} data={data}></AForm>
  </div>
}