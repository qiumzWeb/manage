import React, {useEffect, useState, useRef} from 'react';
import ReactDOM from 'react-dom'
import { isEmpty, getUuid, isTrue } from 'assets/js';
import { getPopUpPosition } from 'assets/js/proxy-utils';
require('./index.scss')
export default function App(props) {
  const {children, visible, trigger, PopUpPisition, onShow, onClose, className, ...attrs} = props
  const [popShow, setPopShow] = useState(false)
  const selectorRef = useRef()
  function domClick () {
    setPopShow(false);
    typeof onClose === 'function' && onClose();
  }
  useEffect(() => {
    if (isTrue(visible)) {
      setPopShow(visible)
    }
  }, [visible])
  useEffect(() => {
    document.addEventListener('click', domClick, false)
    return () => {
      document.removeEventListener('click', domClick, false)
    }
  }, [children])
  const triggerClick = (e) => {
    if (!isTrue(visible)) {
      if (!popShow) {
        setPopShow(true);
        typeof onShow === 'function' && onShow();
      } else {
        setPopShow(false);
        typeof onClose === 'function' && onClose();
      }
    }
    e.stopPropagation()
  }
  return <>
    <span ref={selectorRef} onClick={triggerClick}>{trigger}</span>
    {
      ReactDOM.createPortal(
        popShow && <div
          {...attrs}
          className="q-s-popup"
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