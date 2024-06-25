import React, {useState, useEffect, useRef} from 'react'
import {ATab} from '@/component';
import Detail from './details'
import Summary from './summary'

App.title = "移动管理平台监控报表"
export default function App(props) {

  return <ATab {...props} value={[
    {title: '汇总', item: Summary},
    {title: '明细', item: Detail},
  ]}></ATab>
}