import React, { useState, useEffect } from 'react'
import { Button, Tab, Message, Card, Input, Grid } from '@/component'
import AForm from '@/component/AForm'
import { getWid, isEmpty, getUuid } from 'assets/js'
import $http from 'assets/js/ajax'
App.title = '工具操作'
export default function App(props) {
  const { formModel }  = props
  const [requireMsg, setRequireMsg] = useState({})
  // 工具提交
  async function getSubmit(item) {
    const form = item.form
    const result = await form.validate()
    if (!result) return
    try {
      const data = form.getData()
      const newParams = []
      requireMsg[item.name] = []
      getParams(data, newParams)
      await Promise.all(newParams.map(params => $http({
        url: item.submitUrl,
        method: 'post',
        data: params,
        returnRes: true,
        dataType: 'form',
      }).then(res => {
        requireMsg[item.name].push({
          code: JSON.stringify(params),
          success: true,
          name: item.name,
          message: res.message
        })
      }).catch(err => {
        requireMsg[item.name].push({
          code: JSON.stringify(params),
          success: false,
          errorMsg: err.message,
          name: item.name
        })
      }).finally(() => {
        setRequireMsg({...requireMsg})
      })))
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 获取参数
  function trim(str) {
    return typeof str === 'string' ? str.trim() : str
  }
  function getParams(data, list) {
    const cellList = {}
    Object.entries(data).forEach(([k, v]) => {
      const isSplit = formModel[k].valueSeparator
      if (isSplit) {
        const pReg = /\n|\r/g
        const vp = [...new Set(v.split(pReg).filter(p => p) || [])]
        if (vp.length > 1) {
          cellList[k] = vp
        } else {
          data[k] = trim(v)
        }
      } else {
        data[k] = trim(v)
      }
    })
    if (isEmpty(cellList)) {
      list.push(data)
    }
    Object.entries(cellList).forEach(([k, cl]) => {
      cl.forEach(c => {
        list.push({
          ...data,
          [k]: trim(c)
        })
      })
    })
  }
  const item = props.data
  const msgBox = requireMsg[item.name] || []

  return <div>
    <div style={{padding: '0 20px'}}>
      <AForm
        ref={ref => item.form = ref}
        formModel={formModel}
      ></AForm>
      <Button type="primary" onClick={() => getSubmit(item)}>{item.label}</Button>
    </div>
    <div style={{padding: '20px'}}>
      <Grid.Row>
        <Grid.Col>
          <Card title="成功">
            <Card.Content>
              <div style={{minHeight: 400, wordBreak: 'break-all'}} className="downcenter_SUCC">
                {msgBox.filter(s => s.success).map((m, index) => {
                  return <div key={index}>{m.code} : {m.message}</div>
                })}
              </div>
            </Card.Content>
          </Card>
        </Grid.Col>
        <Grid.Col>
        <Card title="失败">
            <Card.Content>
              <div style={{minHeight: 400, wordBreak: 'break-all'}} className="downcenter_FAIL">
              {msgBox.filter(s => !s.success).map((m, index) => {
                  return <div key={index}>
                    {m.code} : {m.errorMsg}
                  </div>
                })}
              </div>
            </Card.Content>
          </Card>
        </Grid.Col>
      </Grid.Row>
    </div>
  </div>

}