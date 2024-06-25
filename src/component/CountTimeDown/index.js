import React, {useEffect, useState, useRef} from 'react';
import { getTimeStampToHMS, isEmpty } from 'assets/js';

export default function CountTimeDown(props) {
  const { value, autoPlay, type = 'down', unit = 1000, lang = 'zh' } = props
  const [showTime, setShowTime] = useState(0)
  const timer = useRef()
  function getCountTimeStr(time) {
    if (isNaN(time) || isEmpty(time) || time < 0) return
    setShowTime(getTimeStampToHMS(time, lang));
    if (autoPlay === false) return
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const newTime = type == 'up' ? time + unit : time - unit;
      getCountTimeStr(newTime);
    }, unit)
  }
  useEffect(() => {
    getCountTimeStr(value)
    return () => {
      clearTimeout(timer.current);
    }
  }, [value])
  return showTime
}