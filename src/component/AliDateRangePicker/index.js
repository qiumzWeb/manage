import React from 'react'
import { DatePicker2 } from '@/component'
import { getAliWeekRange, isSame } from '@/report/utils'
export default React.forwardRef(function AliDateRangePicker(props, ref) {
  const mode = props.mode == 'week' ? 'date' : props.mode
  const isWeek = props.mode == 'week'
  const ops = {}
  isWeek && (ops.format = 'YYYY-阿里wo')
  return <DatePicker2.RangePicker
    ref={ref}
    {...props}
    mode={mode}
    {...ops}
    disabledDate={(val) => {
      if (isWeek) {
        return val.day() != '4'
      }
    }}
    dateCellRender={(value) => {
      if (!isWeek) return value.date()
      if (value.day() == '4') {
        return value.format('wo')
      }
      let renderValue = value.date()
      const [startWeek, endWeek] = props.value && props.value.map(v => getAliWeekRange(v))
      const isSelect = startWeek && endWeek &&
                        value > startWeek[0] &&
                        value < endWeek[1] &&
                        props.value.every(v => !isSame(v, value, 'D'))
      if (isSelect) {
        renderValue = <div style={{color: '#000'}}>{renderValue}</div>
      }
      return renderValue
    }}
  ></DatePicker2.RangePicker>
})