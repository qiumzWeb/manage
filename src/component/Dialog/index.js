import React, {useState, useRef, useEffect} from 'react';
import { Dialog } from '@alifd/next'
import { AssignProps } from 'assets/js/proxy-utils'
import { getFullscreenElement, addWatchFullScreen } from '@/component/FullSreen/api'
function Component (props) {
  const {children, isFullScreen, align, style, v2, ...attrs} = props
  const {width, ...styleAttrs} = (style || {minWidth: '400px'})
  const [parentNode, setParentNode] = useState(null)
  let vProps = {
    style: {width: width || (isFullScreen && '100%'), ...styleAttrs},
  }
  if (true) {
    vProps = {
      v2: true,
      width: width || (isFullScreen && '100%') || 'auto',
      style: styleAttrs
    }
  }
  useEffect(() => {
    addWatchFullScreen(function success(){
      setParentNode(getFullscreenElement())
    })
  }, [])
  return parentNode ? props.visible && <Dialog
    centered
    popupContainer={parentNode}
    {...vProps}
    {...attrs}
  >
    {children}
  </Dialog> || null : <Dialog
    centered
    {...vProps}
    {...attrs}
  >
    {children}
  </Dialog>
}
AssignProps(Component, Dialog)

export default Component