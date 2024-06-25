import React, {useEffect, useState, useRef } from 'react';
import { Button } from '@alifd/next'
import { AssignProps, getMarginStyle } from 'assets/js/proxy-utils'
import { getResult } from 'assets/js'

const Component =  React.forwardRef(function (props, ref) {
  const {style, n, p, s,  mt, mr, mb, ml, type, onClick, ...attrs} = props
  const btnType = n ? 'normal' : p ? "primary" : s ? 'secondary' : type
  const [loading, setLoading] = useState(false);
  const CallBox = useRef({});
  CallBox.current = {}
  for(const ck in props) {
    const reg = /^call\_(.+)/;
    const callname = ck.match(reg)
    if (callname && callname[1]) {
      CallBox.current[callname[1]] = props[ck]
    }
  }
  async function getClick(event) {
    setLoading(true)
    try {
      await getResult(onClick, event)
      for(let [key, value] of Object.entries(CallBox.current)) {
        await getResult(window[key], value)
      }
    } catch(e) {
      console.log(e)
    } finally {
      setLoading(false)
    }

  }
  return <Button
    ref={ref}
    loading={loading}
    type={btnType === 'link' ? undefined : btnType}
    className={`next-btn-${type}`}
    {...attrs}
    style={getMarginStyle({style, mt, mr, mb, ml})}
    onClick={getClick}
  ></Button>
})
AssignProps(Component, Button)
export default Component