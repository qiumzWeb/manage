import React, {useState, useRef, useEffect} from 'react';
import { Balloon } from '@alifd/next';
import { getFullscreenElement, addWatchFullScreen } from '@/component/FullSreen/api'
export default function OverTips(props) {
  const { children, showTips, trigger, tips, ...attrs } = props
  const [visible, setVisible] = useState(!!props.visible)
  const [parentNode, setParentNode] = useState(null)
  const content = useRef()
  const tipsContent = useRef()
  const childrenBox = <span ref={content} className='cellSpan'>
    {trigger || children}
  </span>
  useEffect(() => {
    addWatchFullScreen(function success(){
      setParentNode(getFullscreenElement())
    })
  }, [])
  useEffect(() =>  {
    if (tips === false) {
      setVisible(false)
    }
  }, [tips])
  return <Balloon
  ref={tipsContent}
  style={{zIndex: 99999999}}
  type="primary"
  v2
  autoAdjust
  arrowPointToCenter
  popupContainer={parentNode}
  {...attrs}
  onVisibleChange={(val) => {
    const parent = content.current && content.current.parentElement
    if (
      !showTips &&
      parent &&
      parent.scrollHeight <= parent.clientHeight + 10
    ) return
    if (tips === false) {
      return setVisible(false)
    }
    setVisible(val)
  }}
  trigger={childrenBox}
  closable={false}
  visible={visible}
  >
    <div style={{maxHeight: '100vh', overflow: "auto"}}>{children}</div>
  </Balloon>
}