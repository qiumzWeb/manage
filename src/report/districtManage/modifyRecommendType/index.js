import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Message, Radio } from '@/component'
import AForm from '@/component/AForm'
import $http from 'assets/js/ajax'
import { isEmpty } from 'assets/js'
import API from 'assets/api'
export default function App(props) {
  const typeForm = useRef()
  //变更库区推荐状态
  function ModifyRecommendType() {
    if (isEmpty(props.data)) return Message.warning('请选择库区数据！')
    Dialog.confirm({
      title: '选择变更库区推荐状态',
      content: <div style={{width: 400, marginTop: 50}}>
        <AForm ref={typeForm} formModel={{
          recommendType: {
            span: 24,
            component: Radio.Group,
            defaultValue: 1,
            attrs: {
              dataSource: [
                {value: 1, label: '推荐开启'},
                {value: 0, label: '推荐关闭'},
                {value: 2, label: '首单推荐关闭'}
              ]
            }
          }
        }}></AForm>
      </div>,
      okProps: {children: '确认变更'},
      cancelProps: {children: '不作变更'},
      onOk: async() => {
        const formData = typeForm.current.getData()
        try {
          await $http({
            url: API.districtModifyRecommendType,
            method: 'post',
            data: {
              ...formData,
              warehouseDistrictIdList: props.data.map(s => s.id)
            }
          })
          Message.success('操作成功')
          typeof props.refresh == 'function' && props.refresh()
        } catch(e) {
          Message.error(e.message)
        }
      }
    })
  }
  return <Button ml="10" onClick={ModifyRecommendType}>变更库区推荐状态</Button>
}