import React, {useState, useEffect, useRef} from 'react'
import {ATab} from '@/component';
import Detail from './details'
import Summary from './summary'
export default function App(props) {

  return <ATab {...props} value={[
    {title: '汇总', item: Summary},
    {title: '明细', item: Detail},
  ]}></ATab>
}