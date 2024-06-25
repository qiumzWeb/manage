import React, {useState, useEffect, useRef} from 'react'
import {ATab} from '@/component';
import Detail from './details'
import StackRackSummary from './stackRackSummary'
import WaveSummary from './waveSummary'

App.title = "波次&堆垛架库区看板"
export default function App(props) {

  return <ATab {...props} value={[
    {title: '波次看板', item: WaveSummary, key: 'WaveSummary'},
    {title: '堆垛架库区看板', item: StackRackSummary, key: 'StackRackSummary'},
    {title: '明细', item: Detail, key:'detail'},
  ]}></ATab>
}