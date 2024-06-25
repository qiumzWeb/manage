import './index.scss'
import React, { useEffect, useState } from 'react'
import IconFont from '@/assets/imgs/icon-font'
import Header from './header'
import Menu from './menus'
import Bus from 'assets/js/bus'
import NavTag from './NavTag'
import VersionUpdateTips from '@/layout/versionUpdateTips'
import { VideoRecord, Message } from '@/component'
import LowerCodePage from './lowerCodePage';
import WarehouseConfigProgress from '@/pages/warehouseConfiguration/warehouseConfigProgress'


export default function App(props) {
  const [background, setBackground] = useState('#fff')
  const [isFull, setIsFull] = useState(false)
  const [hasTag, setHasTag] = useState(true)
  const [contentFullScreen, setContentFullScreen] = useState(false)
  
  useEffect(() => {
    const unBus = Bus.$on('setConfig', ({color = '#fff', hideNavTag}) => {
      setIsFull(color === 'transparent')
      setBackground(color)
      setHasTag(!hideNavTag)
    })
    const unFullScreenBus = Bus.$on('setPageFullScreen', (status) => {
      if (status) {
        Message.notice('按【ESC】即可退出窗口最大化模式')
      }
      setContentFullScreen(status)
    })
    const watchESCExit = function(e) {
      if (e.which == 27 || e.keyCode == 27) {
        setContentFullScreen(false)
      }
    }
    document.addEventListener('keydown', watchESCExit, false)
    return () => {
      unBus();
      unFullScreenBus();
      document.removeEventListener('keydown', watchESCExit, false);
    }
  }, [])
  Bus.setState({pageIsFull: contentFullScreen})
  return (<div className="pcs-layout">
    <IconFont></IconFont>
    <div className={contentFullScreen && 'hide'}><Header></Header></div>
    <div className='pcs-main'>
      <div className={contentFullScreen && 'hide'}><Menu></Menu></div>
      <div style={{width: '100%', overflow: 'hidden'}}>
        {hasTag && <div className={contentFullScreen && 'hide'}><NavTag></NavTag></div> || null}
        <div className={`pcs-content ${
          contentFullScreen ? 'full-screen' : (hasTag && 'hasTag' || '')
        }`} id="pcs-app-route">
          <div className={`pcs-content-box`} style={{background, padding: isFull ? '' : '12px 12px 0 12px'}}>
            <div className={`route mch ${
              contentFullScreen ? '' : (isFull && 'full' || '')
            }`} style={{background}}>
                <WarehouseConfigProgress>{props.children}</WarehouseConfigProgress>
                <LowerCodePage></LowerCodePage>
            </div>
          </div>
        </div>
      </div>
    </div>
    <VersionUpdateTips></VersionUpdateTips>
    <VideoRecord></VideoRecord>
  </div>);
}
