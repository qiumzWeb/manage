import React, {useEffect, useState, useRef} from 'react'
import ReactDom from 'react-dom'
import { Loading } from '@/component'
App.paramsRules = '/:id'
export default function App(props) {
  const [viewSrc, setViewSrc] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef()
  // 加载页面
  const listenerMsg = (e) => {
    try {
        var data = JSON.parse(e.data);
        const id = props.match.params.id
        data && data[id] && setIsLoading(false)
    } catch (x) {

    }
  }

  const loadPage = async () => {
    setIsLoading(true)
    const id = props.match.params.id
    const Iframe = await window.getFbiReportUrl(id)
    setViewSrc(Iframe)
    loadCache(Iframe, id)
    window.addEventListener("message", listenerMsg, false);
  }

  useEffect(() => {
    loadPage()
  }, [props.match.params.id])
  useEffect(() => {
    loadPage()
    return () => {
      window.removeEventListener('message', listenerMsg, false)
    }
  }, [])
  return <div ref={iframeRef} style={{margin: -10, height: '100%'}}>
    {isLoading && <Loading style={{position: 'absolute', top: '45%', left: '45%'}}></Loading>}
    {viewSrc}
    {/* <iframe ref={iframeRef} id="my-iframe" frameBorder="no" width='100%' src={viewSrc} height="100%" ></iframe> */}
  </div>
}

function loadCache(_iframe, id, callback) {
  const _id = 'fbi_' + id
  if (!document.getElementById(_id)) {
    const div = document.createElement('div')
    div.id = _id
    div.style.display = 'none'
    document.body.appendChild(div)
    ReactDom.render(_iframe, div)
    typeof callback === 'function' && callback()
  } else {
    typeof callback === 'function' && callback()
  }
}