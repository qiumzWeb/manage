import React, {useEffect, useState, useRef } from 'react';
import { Arial } from '@/component';
import { getMarginStyle } from 'assets/js/proxy-utils';
import { thousands } from 'assets/js';
export default function JumpNumber(props) {
  const { children, value, ...attrs }  = props;
  const [jumpNum, setJumpNum] = useState(0);
  const timer = useRef();
  useEffect(() => {
    setNumJumping(value);
  }, [])
  useEffect(() => {
    setNumJumping(value);
  }, [value])

  function setNumJumping(num, current = 0) {
    clearTimeout(timer.current);
    if (isNaN(num)) return;
    if (current < num) {
      // 最多 持续时间：  60 * 50 = 3000 毫秒
      const upCount = Math.ceil(num / 60);
      timer.current = setTimeout(() => {
        const newCurrent = current + upCount;
        setJumpNum(Math.min(newCurrent, num));
        setNumJumping(num, newCurrent)
      }, 50)
    }
  }


  return <span {...attrs} style={getMarginStyle(props)}>
    <Arial>{thousands(jumpNum)}</Arial>
    {children}
  </span>
}