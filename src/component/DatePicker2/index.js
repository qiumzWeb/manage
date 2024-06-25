import React, {useEffect, useState} from 'react';
import { DatePicker2  } from '@alifd/next'
import RangePicker from './RangePicker.js'
import { AssignProps } from 'assets/js/proxy-utils'
const Component =  React.forwardRef(function (props, ref) {
  const { ...attrs } = props
  return <DatePicker2 
    ref={ref}
    {...attrs}
  ></DatePicker2>
})
AssignProps(Component, DatePicker2, (key, to) => {
  if (key === 'RangePicker') {
    to[key] = RangePicker
  }
})
export default Component