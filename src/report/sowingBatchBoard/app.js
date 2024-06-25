import React, {useState, useEffect, useRef} from 'react'
import {ATab} from '@/component';
import Detail from './details'
import Summary from './summary'
import Wave from './wave'

App.title = "播种批次看板"
export default function App(props) {

  return <ATab {...props} value={[
    {title: '批次', item: Summary, key: 'batch'},
    {title: '波次', item: Wave, key: 'wave'},
    {title: '大包', item: Detail, key: 'bigBag'},
  ]}></ATab>
}