import React, { useState, useEffect, useRef } from 'react';
import { Field } from '@alifd/next';
import { ASelect } from '@/component';
import { isTrue } from 'assets/js'
require('./index.scss')
export default function Component(props) {
  const { data, contentContainer, contentRefs } = props
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollLock = useRef(false)
  const field = Field.useField({navList: data});
  const boxRef = useRef()
  useEffect(() => {
    setTimeout(() => {
      contentContainer.current.addEventListener('scroll', watchContentScroll, false)
    }, 500)
    return () => {
      contentContainer.current.removeEventListener('scroll', watchContentScroll, false)
    }
  }, [])
  useEffect(() => {
    field.setValue('navList', data)
  }, [data])

  // 监听滚动容器
  function watchContentScroll(event) {
    if (scrollLock.current) return
    const boxTop = contentContainer.current.getBoundingClientRect().top
    contentRefs.current.some((a, index) => {
      if (!a) return
      const aReact = a.getBoundingClientRect()
      const aTop = aReact.top
      const aHeight = boxTop + (aReact.height / 2)
      const viewTopLine = boxTop + (10)
      const b = contentRefs.current[index+1]
      const bTop = b && b.getBoundingClientRect().top || aHeight + 10
      if (aTop < viewTopLine && bTop > aHeight) {
        setActiveIndex(index)
        return true
      }
    })
  }
  // 锚点跳转
  function goToAnchorPosition(index) {
    scrollLock.current = true
    setActiveIndex(index)
    contentRefs.current[index].scrollIntoView({behavior: 'smooth',  block: "start"})
    setTimeout(() => {
      scrollLock.current = false
    }, 2000)
  }
  return <div className='anchor-position-title' ref={boxRef}>
    <div style={{position: 'absolute', top: 0, left: 5}}>
      <ASelect
          style={{width: 200}}
          popupContainer={boxRef.current}
          value={field.getValue('searchValue')}
          showSearch
          field={field}
          watchKey="navList"
          getOptions={async({field}) => {
            const { navList } = field.getValues()
            return Array.isArray(navList) && navList.map((d, index) => ({
              ...d,
              label: d.searchTitle || d.title,
              value: index
            }))
          }}
          onChange={(value) => {
            field.setValue('searchValue', value);
            isTrue(value) && goToAnchorPosition(value)
          }}
        ></ASelect>
    </div>
    <div style={{height: 40, width: 0}}></div>
    <div style={{height: 'calc(100% - 40px)', overflow: 'auto'}}>
      {Array.isArray(data) && data.map((d, index) => {
        return <div
          className={`anchor-position-title-cell ${activeIndex === index ? 'active' : ''}`}
          key={index}
          onClick={() => {
            field.setValue('searchValue', index);
            goToAnchorPosition(index)
          }}
        >{d.title}</div>
      })}
    </div>

  </div>
}