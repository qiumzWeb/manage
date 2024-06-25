import React, {useState, useEffect, useRef} from 'react'
import OverTips from '@/component/overTips'
import { Dialog, Button } from '@/component'
import { version } from 'assets/js'
import $http from 'assets/js/ajax'
import DragBox from '@/component/DragBox/index'
import './index.scss'
let versionTimer = ''
let hasUpdate = 0
export const getUpdateTips = $http({
  url: '/tool/getUpdateTips',
  oldApi: true,
  method: 'get'
})
export default function App(props) {
  const [visible, setVisible] = useState(false)
  const [showNotice, setShowNotice] = useState(false)
  const [loading, setLoading] = useState(true)
  const [update, setUpdate] = useState({})
  const contentRef = useRef()
  function onClose() {
    setVisible(false)
    window.dbStore.set(version, update.versionId)
    let t = setTimeout(() => {
      setLoading(true)
      setShowNotice(false)
      clearTimeout(t)
    }, 1000)
  }
  function seeLater() {
    setVisible(false)
  }
  useEffect(() => {
    getVersion()
  }, [])
  async function getVersion() {
    const u = await getUpdateTips
    const currentVersion = await window.dbStore.get(version)
    hasUpdate++
    if (
      u &&
      u.content &&
      u.versionId != currentVersion
    ) {
      setShowNotice(true)
      let t = setTimeout(() => {
        setLoading(false)
        clearTimeout(t)
      }, 1500)
      setUpdate(u)
      if (hasUpdate > 1) {
        window.dbStore.set(version, u.versionId)
      }
    }
    clearTimeout(versionTimer)
    // 30 分钟 检查一次发版信息
    versionTimer = setTimeout(() => {
      getVersion()
      clearTimeout(versionTimer)
    }, 30 * 60 * 1000)
  }

  return showNotice && <DragBox className='version-update-tips'>
    { loading && <div className="v-u-title active">更新<br/>通知</div> ||
    <OverTips
      trigger={<DragBox.Child className="v-u-title" onClick={() => setVisible(true)} >更新<br/>通知</DragBox.Child>}
      showTips
      align="tr"
      visible
      >
        <div>有新版本发布，点击查看详情</div>
    </OverTips>}
    <Dialog
      title="更新通知"
      visible={visible}
      onClose={seeLater}
      footer={<>
        {hasUpdate > 1 && <Button mr="10" type="primary" onClick={() => {window.location.reload()}}>加载更新</Button>}
        <Button type={hasUpdate > 1 && 'normal' || 'primary'} mr="10" onClick={seeLater}>知道了</Button>
        <Button type={'secondary'} mr="10" onClick={onClose}>不再提醒</Button>
      </>}
    >
      <pre dangerouslySetInnerHTML={{__html: update.content}}></pre>
    </Dialog>
  </DragBox> || null
}