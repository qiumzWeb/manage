import React, { useEffect, useState, useRef } from 'react';
import { Icon, DragBox } from '@/component'
import OverTips from '@/component/overTips'
import { getCaptureScreen } from 'assets/js/webRTC'
require('./index.scss')
export default function Component(props) {
  const [recordStatus, setRecordStatus] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  // 开始录制
  function getRecordVideoStart() {
    if (recordStatus) return
    setRecordStatus(true)
    getCaptureScreen().then(MediaRecord => {
      if (MediaRecord) {
        setMediaRecorder(MediaRecord)
        // 开始录制
        MediaRecord.onRecordEnd = function() {
          // 录制完成
          setRecordStatus(false)
        }
      } else {
        // 取消录制
        setRecordStatus(false)
      }
    })
  }
  // 取消录制
  function getRecordVideoStop() {
    mediaRecorder.stop()
  }
  return <DragBox top={8} left={250}>
    {recordStatus ? <DragBox.Child
      onClick={getRecordVideoStop}>
      <OverTips showTips trigger={
        <Icon defineType='video-stop'
          style={{width: 30, height: 40}}
        ></Icon>
      }>
        点击结束屏幕录制
      </OverTips>
    </DragBox.Child>: <DragBox.Child
      onClick={getRecordVideoStart}>
        <OverTips showTips trigger={
          <Icon defineType='video-start'
            style={{width: 30, height: 40}}
          ></Icon>
        }>
          点击我录制屏幕  ꈍ◡ꈍ  或者把我拖走吧。
        </OverTips>
    </DragBox.Child>}
  </DragBox>
}