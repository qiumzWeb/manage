import React, {useEffect, useState, useRef} from 'react';
import ReactDOM from 'react-dom'
import { isEmpty, getUuid, isTrue } from 'assets/js'
import Bus from 'assets/js/bus';
import { getPopUpPosition } from 'assets/js/proxy-utils';
require('./index.scss')
export default function App(props) {
  const appId = useRef(getUuid())
  const {children, visible, trigger, PopUpPisition, onShow, onClose, className, style, ...attrs} = props
  const [popShow, setPopShow] = useState(false)
  const selectorRef = useRef()
  function domClick () {
    setPopShow(false);
    typeof onClose === 'function' && onClose();
  }
  useEffect(() => {
    // 一次只显示 一个弹窗 ，弹窗时关闭 当前弹窗 以外的 所有弹窗 
    const UnBus = Bus.$on('closeOtherPopUp', (id) => {
      if (appId !== id) {
        domClick()
      }
    })
    return UnBus
  }, [])
  useEffect(() => {
    if (isTrue(visible)) {
      setPopShow(visible)
    }
  }, [visible])
  useEffect(() => {
    document.addEventListener('click', domClick, false)
    document.addEventListener('contextmenu', domClick,)
    return () => {
      document.removeEventListener('click', domClick, false);
      document.removeEventListener('contextmenu', domClick, false);
    }
  }, [children])

  const triggerClick = (e) => {
    // 触发关闭 其它弹窗
    Bus.$emit('closeOtherPopUp', appId);
    if (!isTrue(visible)) {
      if (!popShow) {
        setPopShow(true);
        typeof onShow === 'function' && onShow();
      } else {
        setPopShow(false);
        typeof onClose === 'function' && onClose();
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }

  return <>
    <span style={style} ref={selectorRef} onContextMenu={triggerClick}>{trigger}</span>
    {
      ReactDOM.createPortal(
        popShow && <div
          {...attrs}
          className="a-context-menu-popup"
          style={{
            ...getPopUpPosition(selectorRef.current, PopUpPisition)
          }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {children}
        </div> || null,
        document.body
      )
    }
  </>
}