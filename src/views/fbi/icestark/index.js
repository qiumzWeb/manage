import React, {useEffect, useState, useRef} from 'react'
import ReactDom from 'react-dom'
import { Loading, Message } from '@/component'
import Bus from 'assets/js/bus'
App.paramsRules = '/:id'
export default function App(props) {
  const [isLoading, setIsLoading] = useState(false)
  // 加载页面
  const listenerMsg = (e) => {
    try {
        var data = e.data;
        if (data.path === `/cone/pcs-manage${location.pathname}`) {
          // setIsLoading(false)
        }
    } catch (x) {
      Message.error('加载失败，请稍后再试')
    }
  }
  const loadPage = async () => {
    setIsLoading(true)
    const src= `/cone/pcs-manage${location.pathname}${location.search}`
    window.addEventListener("message", listenerMsg, false);
    setPageUrl(src)
  }
  useEffect(() => {
    loadPage()
  }, [props.match.params.id])
  
  useEffect(() => {
    loadPage()
    const unBus = Bus.$on('setIceStarkLoading', (status) => {
      setIsLoading(status)
    })
    return () => {
      setPageUrl(null)
      unBus()
      window.removeEventListener('message', listenerMsg, false)
    }
  }, [])
  // 更新页面
  function setPageUrl(url) {
    Bus.$emit('setIceStarkUrl', url)
  }
  return isLoading && <Loading
   style={{position: 'absolute', top: '45%', left: '45%', zIndex: 200}}></Loading> || null
}
