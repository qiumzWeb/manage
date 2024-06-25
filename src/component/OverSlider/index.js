import React, {useRef, useState, useEffect} from 'react'

export default function App(props) {
  const boxRef = useRef()
  const isDistroy = useRef(false)
  const timer = useRef()
  useEffect(() => {
    addWatch(boxRef)
    setTimeout(() => {
      boxRef.current.addEventListener('mouseenter', function() {
        console.log('鼠标进入')
        clearTimeout(timer.current)
        isDistroy.current = true
      }, false)
      boxRef.current.addEventListener('mouseleave', function() {
        console.log('鼠标离开')
        isDistroy.current = false
        addWatch(boxRef)
      }, false)
    }, 100)
    return () => {
      isDistroy.current = true
    }
  }, [])
  // 定时滚动列表数据
  function addWatch(ref) {
    // 如果组件被销毁， 则中止
    if(isDistroy.current) return
    if (ref && ref.current) {
      clearTimeout(timer.current)
      const container = ref.current
      const parentContainer = container.parentNode
      const parentHeight = parentContainer.getBoundingClientRect().height
      const Height = container.getBoundingClientRect().height
      const containerChildren = container.childNodes
      if (Height > parentHeight) {
        timer.current = setTimeout(() => {
          containerChildren[1].scrollIntoView({behavior: 'smooth',  block: "end"})
          setTimeout(() => {
            container.appendChild(containerChildren[0])
            addWatch(ref)
          }, 1000)
        }, 3000)
      }
    } else {
      setTimeout(() => {
        addWatch(ref)
      }, 100)
    }
  }
  return <div ref={boxRef} className='pcs-over-slider'>{
    props.children
  }</div>
}