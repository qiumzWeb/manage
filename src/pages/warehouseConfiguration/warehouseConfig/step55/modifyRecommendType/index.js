import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Message, Radio, ATipsCard } from '@/component'
import AForm from '@/component/AForm'
import $http from 'assets/js/ajax'
import { isEmpty } from 'assets/js'
import API from 'assets/api'
import { getStepBaseData, setStepBaseData, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';

const options = [
  {value: 1, label: '推荐开启'},
  {value: 0, label: '推荐关闭'},
  {value: 2, label: '首单推荐关闭'}
]
export default function App(props) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  //变更库区推荐状态
  async function ModifyRecommendType(item) {
    setVisible(false)
    try {
      setLoading(true)
      await $http({
        url: API.modifyRecommendType.replace("{warehouseId}",getStepBaseData().warehouseId),
        method: 'post',
        data: {
          recommendType: item.value,
          storagePositionIdList: props.data.map(s => s.id)
        }
      })
      Message.success(`${item.label}变更成功`)
      saveStepNode(60)
      typeof props.refresh == 'function' && props.refresh()
    } catch(e) {
      Message.error(e.message)
    } finally {
      setLoading(false)
    }
  }
  return <ATipsCard
  visible={visible}
  // PopUpPisition={{top: 10, bottom: 10}}
  onClose={() => setVisible(false)}
  trigger={
    <Button s loading={loading} disabled={loading} onClick={() => {
      if (isEmpty(props.data)) return Message.warning('请选择库区数据！')
      setVisible(v => !v)
    } }>变更库区推荐状态</Button>
  }>
  <div style={{background: '#fff', color: '#333', overflow: 'hidden'}}>
    {options.map((m, index) => {
      return <div className={`pcs-tips-selector small`} key={index} onClick={
        () => {ModifyRecommendType(m)}
      }>
        {m.label}
      </div>
    })}
  </div>
</ATipsCard>
}