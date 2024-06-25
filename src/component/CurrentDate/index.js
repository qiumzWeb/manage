import React, {useEffect, useState, useRef} from 'react';
import { isInvalidDate } from 'assets/js';
import dayjs from 'dayjs'

export default function CurrentDate(props) {
  const { value, autoPlay, unit = 1000, format = "YYYY-MM-DD HH:mm:ss" } = props
  const [showTime, setShowTime] = useState(0)
  const timer = useRef()
  function getCountTimeStr(time) {
    time = isInvalidDate(time) ? +dayjs() : +dayjs(time);
    setShowTime(dayjs(time).format(format));
    if (autoPlay === false) return
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const newTime = time + unit;
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