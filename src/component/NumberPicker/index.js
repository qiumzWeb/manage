import React, {useEffect, useState} from 'react';
import { NumberPicker } from '@alifd/next'
const Component =  React.forwardRef(function (props, ref) {
  const {detail, ...attrs } = props
  if (!attrs.placeholder && !attrs.disabled) {
    attrs.placeholder = '请输入'
  }
  return detail ? <span ref={ref} style={{fontWeight: 'bold'}}>{props.value}</span> : <NumberPicker
    ref={ref}
    hasClear
    {...attrs}
  ></NumberPicker>
})
export default Component