import React, { useState, useEffect, useRef } from 'react';
import { FullSreen, Dialog } from '@/component';
import Card from './card';
import Label from './label';
import { addWatchFullScreen, getFullscreenElement, getFullScreen } from '@/component/FullSreen/api'
require('./px2rem.scss');
LargeScreenBox.Card = Card;
LargeScreenBox.Label = Label;
export default function LargeScreenBox(props) {
  const { title, subLeft, subRight, children, className, ...attrs } = props;
  const containerRef = useRef();
  const [fullHide, setFullHide] = useState(false)

  useEffect(() => {
    addWatchFullScreen((success) => {
      if (getFullscreenElement()) {
        setFullHide(true)
      } else {
        setFullHide(false)
      }
    }, (error) => {
      setFullHide(false)
    })
    setTimeout(() => {
      Dialog.confirm({
        title: '是否开启全屏展示？',
        content: <div>
          <div>1、开启全屏后可<span className='warn-color'>按【ESC】键</span>退出全屏模式，或者鼠标移至屏幕中间底部</div>
          <div>隐藏按钮弹出<span className='warn-color'>取消全屏按钮</span>后，<span className='warn-color'>点击【取消全屏按钮】</span>可退出全屏模式。</div>
          <div>2、可在页面底部<span className='warn-color'>点击【全屏按钮】</span>开启全屏模式。</div>
        </div>,
        onOk: async() => {
          getFullScreen(containerRef.current)
        },
      })
    }, 100)
  }, [])

  return <div {...attrs} className={`pcs-large-screen-box-component ${className}`} ref={containerRef}>
    {/* 头部 */}
    <div className='screen-header'>
      <div className='header-sub header-left normal-text'><div className='sub-cell'>{subLeft}</div></div>
      <div className='header-title big-text'>{title}</div>
      <div className='header-sub header-right normal-text'><div className='sub-cell'>{subRight}</div></div>
    </div>
    {/* 内容 */}
    <div className='screen-content'>{children}</div>
    {/* 全屏按钮 */}
    <div className={`fullScreenBtn ${fullHide ? 'hide' : ''}`}>
      <FullSreen node={containerRef && containerRef.current} className="isRemXl"></FullSreen>
    </div>
  </div>
}