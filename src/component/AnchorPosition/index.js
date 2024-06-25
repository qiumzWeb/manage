import React, { useState, useEffect, useRef, useImperativeHandle } from 'react'
import { Loading, Button } from '@/component'
import { getChildren } from 'assets/js/proxy-utils'
require('./index.scss')
import NavTitle from './nav'
export default React.forwardRef(function Component(props, ref) {
  const { data, children, loading, contentClassName } = props
  const listRef = useRef([])
  const contentBox = useRef()
  const [fixedClassName, setFixedClassName] = useState('')
  useImperativeHandle(ref, () => ({
    openFullScreen,
    closeFullScreen
  }))
  // 最大化全屏展示
  function openFullScreen() {
    setFixedClassName('fixed')
  }
  // 最小化展示
  function closeFullScreen() {
    setFixedClassName('')
  }

  return <div className={`anchor-position ${fixedClassName}`}>
    <Loading visible={!!loading} style={{left: '45%', top: '50%', position: 'fixed', zIndex: 99}}></Loading>
    <div className='close-fullscreen'>
      <Button onClick={fixedClassName ? closeFullScreen : openFullScreen}>{fixedClassName ? '还原窗口' : '最大化窗口'}</Button>
    </div>
    <div ref={contentBox} className={`anchor-position-content ${contentClassName}`}>
      {
        getChildren(children).map((child, index) => {
          if (!child) return null
          if ( child.props && child.props.slot == 'listCell') {
            const listCell = child.props.children
            return Array.isArray(data) && typeof listCell === 'function' && data.map((d, i) => {
              return <div
                className={`anchor-position-content-cell`}
                ref={ref => listRef.current[i] = ref}
                key={i}
              >{
                listCell(d,i)
              }</div>
            })
          }
          return child
        })
      }
    </div>
    <div>
      <NavTitle contentContainer={contentBox} data={data} contentRefs={listRef} ></NavTitle>
    </div>
    
  </div>
})