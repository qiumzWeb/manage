import React from 'react';
import { DatePicker2 } from '@alifd/next';
import { AssignProps } from 'assets/js/proxy-utils';
import dayjs from 'dayjs';
import { getObjType } from 'assets/js';

export const defaultPreSet = {
  '今天': [dayjs().startOf('day'), dayjs().endOf('day')],
  '近一周': [dayjs().subtract(7, 'day'), dayjs()],
  '近一个月': [dayjs().subtract(1, 'month'), dayjs()],
  '近两个月': [dayjs().subtract(2, 'month'), dayjs()],
}

const Component =  React.forwardRef(function (props, ref) {
  const { addPreSet, ...attrs } = props
  let preset=defaultPreSet
  if (typeof addPreSet === 'function') {
    preset = addPreSet(defaultPreSet)
  } else if (getObjType(addPreSet) === 'Object') {
    preset = {
      ...defaultPreSet,
      ...addPreSet
    }
  }
  return <DatePicker2.RangePicker
    ref={ref}
    preset={preset}
    {...attrs}
  ></DatePicker2.RangePicker>
})

AssignProps(Component, DatePicker2.RangePicker)

console.log(Component, [DatePicker2.RangePicker])
export default Component