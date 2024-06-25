import React, {useEffect, useState} from 'react';
import { Button, CnIcon } from '@/component';
import Bus from 'assets/js/bus'
export default function SetPageFullScrenn(props) {
  const showText = ['fullscreen', 'exit-fullscreen']
  const showDesc = {
    fullscreen: '窗口最大化',
    'exit-fullscreen': '还原窗口'
  }
  const [type, setText] = useState(getShowText())
  function getShowText() {
    const pageIsFull = Bus.getState('pageIsFull');
    return pageIsFull ? showText[1] : showText[0]
  }
  useEffect(() => {
    const unWatch = Bus.watch('pageIsFull', () => {
      setText(getShowText())
    })
    return () => {
      unWatch()
    }
  }, [])
  return <CnIcon
    {...props}
    title={showDesc[type]}
    className="icon-hover"
    type={type}
    onClick={() => {
      Bus.$emit('setPageFullScreen', !Bus.getState('pageIsFull'))
    }}
  ></CnIcon>

}