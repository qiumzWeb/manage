import React, { useState, useEffect, useRef } from 'react'
import Bus from 'assets/js/bus'
const config = {
  'pre-qmz-manage.wt.cainiao.com': 'https://pre-pcs-admin.wt.cainiao.com',
  'qmz-manage.wt.cainiao.com': 'https://pcs-admin.wt.cainiao.com',
}
window.icestarkOrigin = config[location.hostname] || location.origin
let currentPageUrl = ''
let pageHasLoading = false
export default function LowerCodePage() {
  const [viewSrc, setViewSrc] = useState(window.icestarkOrigin + '/cone/pcs-manage/icestark/index')
  const [status, setStatus] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const iframeRef = useRef()
  useEffect(() => {
    const unBus = Bus.$on('setIceStarkUrl', (url) => {
      if (url) {
        Bus.$emit('setIceStarkLoading', true)
        const fullSrc = window.icestarkOrigin + url
        setStatus(!!url)
        if (currentPageUrl === fullSrc) {
          setTimeout(() => {
            Bus.$emit('setIceStarkLoading', false)
          }, 0)
        }
        if (pageHasLoading) {
          const iceWindow = iframeRef.current.contentWindow;
          const routeURL = new URL(fullSrc)
          iceWindow.postMessage({
            pathname: routeURL.pathname,
            search: routeURL.search
          }, '*')
          setTimeout(() => {
            Bus.$emit('setIceStarkLoading', false)
          }, 1000)
        } else {
          setViewSrc(fullSrc)
        }
        
        setTimeout(() => {
          // Bus.$emit('setIceStarkLoading', false)
          currentPageUrl = fullSrc
        }, 2000)
      } else {
        setStatus(!!url)
      }
    })
    window.addEventListener('message', (e) => {
      if (e && e.data && e.data.bodyLock) {
        setShowDialog(!!e.data.showDialog)
      }
      if (e && e.data && e.data.hideLoading) {
        pageHasLoading = true
        Bus.$emit('setIceStarkLoading', false)
      }
    })
    return () => {
      unBus()
    }
  }, [])
  return <div style={{
    // margin: '-16px -20px -10px',
    height: 'calc(100% - 5px)',
    display: status ? 'block' : 'none'}}>
    <iframe style={{position: 'relative', zIndex:168}} ref={iframeRef} id='icestark_iframe' frameBorder="no" width='100%' height="100%" src={viewSrc}>
    </iframe>
    <div style={{
      display: showDialog ? 'block' : 'none',
      position:"fixed",
      zIndex: 166,
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      background: 'rgba(0,0,0,.5)'
    }}></div>
  </div>
}