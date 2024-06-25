import React, {useState, useEffect, useRef} from 'react';
import { Card } from '@/component';

export default function ShelfItem(props) {
  const { value, onChange, disabled, width, label, mainText, children, style = {}, boxStyle = {},} = props
  const [isActive, setIsActive] = useState(value)
  useEffect(() => {
    setIsActive(value)
  }, [value])
  function onSelected() {
    if (disabled) return
    setIsActive((val) => {
      typeof onChange === 'function' && onChange(!val);
      return !val
    })
  }
  return <div style={{color: '#333', cursor: disabled ? 'not-allowed' :'pointer', width: width, ...boxStyle}}
    className={`card-box ${isActive ? 'card-selected card-main-color' : ''}`}
    onClick={onSelected}
  >
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      padding: 20,
      borderBottom: '1px solid #ddd',
      ...style
    }}>
      {children ? children : (label + '-' + mainText)}
    </div>
    {/* <div style={{
      textAlign: 'center',
      fontSize: 12,
      padding: 10
    }}>{label}</div> */}
  </div>
}
