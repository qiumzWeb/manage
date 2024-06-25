import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import { Pagination } from '@/component'

export default function App(props) {
  const {current, pageSize, onChange, onPageSizeChange, ...attrs} = props
  const [iPageSize, setIPageSize] = useState(pageSize)
  const [ipage, setIpage] = useState(current)
  useEffect(() => {
    setIpage(current)
  }, [current])
  useEffect(() => {
    setIPageSize(pageSize)
  }, [pageSize])
  return <Pagination
    {...attrs}
    current={ipage}
    pageSize={iPageSize}
    isOld
    // pageSizeSelector={false}
    onChange={(page) => {
      typeof onChange === 'function' && onChange(page)
      setIpage(page)
    }}
    onPageSizeChange={(pagesize) => {
      typeof onPageSizeChange === 'function' && onPageSizeChange(pagesize)
      setIPageSize(pagesize)
    }}
  ></Pagination>
}

App.registerPagination = function registerPagination(ref){
  const iframe = ref.current
  const doc = iframe && iframe.contentDocument
  const win = iframe && iframe.contentWindow
  const dom = doc.querySelector('.content-wrapper');
  const div = doc.createElement('div')
  win.Pagination = function(props, parent) {
    dom.appendChild(div)
    parent = parent || div
    ReactDOM.render(
      <App {...props}></App>,
      parent
    )
  }
}