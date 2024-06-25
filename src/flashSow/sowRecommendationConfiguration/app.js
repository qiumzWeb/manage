import React, {useState, useEffect, useRef} from 'react'
import {ATab} from '@/component';
import BociRecommend from './bociRecommend'
import OtherRecommend from './otherRecommend'

App.title = "闪电播设备配置"
export default function App(props) {

  return <ATab {...props} value={[
    {title: '闪电播波次推荐配置', item: BociRecommend},
    {title: '其它波次类型播种配置', item: OtherRecommend},
  ]}></ATab>
}