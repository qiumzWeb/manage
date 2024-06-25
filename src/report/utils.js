import React from 'react'
import HelpTips from '@/component/HelpTips/index'
import { Icon } from '@/component'
import dayjs from 'dayjs'
import { isEmpty, isInvalidDate, getObjType } from 'assets/js'
// 带时分秒时间 格式化
export const getDateTimeStr = (t, fmt) => {
  return t && t.format && t.format(fmt || 'YYYY-MM-DD HH:mm:ss') || t || undefined
}

export const getRangTime = (data, {time, start, end, fmt, isSaveOldKey}) => {
  const source = data && data[time] || []
  const [s, e] = source
  const [fs, fe] = fmt || []
  return {
    [time]: isSaveOldKey && source || undefined,
    [start]: fmt === false ? s : getDateTimeStr(s, fs),
    [end]: fmt === false ? e : getDateTimeStr(e, fe)
  }
}
// 日期 格式 化
export const getDateStr = (t) => {
  return t && t.format && t.format('YYYY-MM-DD') || t || undefined
}

export const getRangDate = (data, {time, start, end}) => {
  const source = data && data[time] || []
  const [s, e] = source
  return {
    [time]: undefined,
    [start]: getDateStr(s),
    [end]: getDateStr(e)
  }
}

// 合成时间区间
export const getTimeToRange = (start, end) => {
  return [start && dayjs(start), end && dayjs(end)]
}

// 默认查询时间- 最近三天
export const defaultSearchTime = [
  dayjs().subtract(2, 'day').startOf('day'),
  dayjs().endOf('day')
]

// 查询默认时间 - 当前时间最近一天
export const defaultCurrentTime = [
  dayjs().subtract(1, 'day').startOf('day'),
  dayjs()
]

// 获取时间区间
export const getDateToRangTime = (date) => {
  if (!date) return []
  return [
    dayjs(date).startOf('day'),
    dayjs(date).endOf('day')
  ]
}

// 默认查询日期
export const defaultSearchDate = [
  dayjs().subtract(1, 'day'),
  dayjs()
]

// 获取dayjs时间格式
export function getDayjsTime({format, add, unit, value}) {
  const currentDayjsTime = isEmpty(value) || isInvalidDate(value) ? dayjs() : dayjs(value);
  add = isNaN(add) ? 0 : add;
  unit = unit || 'day';
  format = format || 'YYYY-MM-DD HH:mm:ss';
  const result = {
    [add >= 0]: dayjs(currentDayjsTime.add(add, unit).format(format)),
    [add < 0]: dayjs(currentDayjsTime.subtract(Math.abs(add), unit).format(format))
  }
  return result[true]
}
 
// tips 
export function getTipsLabel(name, tips) {
  return <span style={{display: 'inline-block'}}>
    <div style={{display: 'flex', alignItems:'center'}}>
      {name}
      <HelpTips large iconProps={{ml: 2, mr: 1, s: 'l', style: {cursor: 'pointer',verticalAlign: 'middle'}}}>
        <pre style={{width:'100%', wordWrap: "break-word", whiteSpace: 'break-spaces'}}>{tips}</pre>
      </HelpTips>
    </div>
  </span>
}

// 字符转成数据
export function StrToArray(data, strArr, split = ',', defaultValue = []) {
  const newData = {}
  Array.isArray(strArr) && strArr.forEach(str => {
    newData[str] = data[str] && data[str].split(split) || defaultValue
  })
  return newData
}

// 数组转成字符
export function ArrayToStr(data, ArrStr, split = ',', defaultValue = '') {
  const newData = {}
  Array.isArray(ArrStr) && ArrStr.forEach(str => {
    newData[str] = Array.isArray(data[str]) && data[str].filter(f => f).join(split) || defaultValue
  })
  return newData
}

/**
 * 每周四 到 下周三 为阿里周
 *
 */
// 获取阿里周
export function getAliWeekRange(date) {
  if (typeof date === 'string') {
    date = dayjs(date)
  }
  if (!dayjs.isDayjs(date)) return []
  const week = [4,5,6,0,1,2,3]
  const weekValue = date.day()
  const index = week.indexOf(weekValue)
  const range = []
  if (index > -1) {
    range[0] = dayjs(date.subtract(index, 'day').format('YYYY-MM-DD 00:00:00'))
    range[1] = dayjs(date.add(6-index, 'day').format('YYYY-MM-DD 23:59:59'))
  }
  return range
}

// 判断是否为同一阿里周
export function isSameWeek(date1, date2) {
  const range1 = getAliWeekRange(date1)
  const range2 = getAliWeekRange(date2)
  return range1[0].isSame(range2[0]) && range1[1].isSame(range2[1])
}
// 判断时间是否相同
/**
 * 
 * @param {date} date1 时间1
 * @param {date} date2 时间2
 * @param {String: Y, M, D, H, m, s} type 
 */
export function isSame(date1, date2, type) {
  if (!date1 || !date2) return false
  if (!date1.format || !date2.format) return false
  const fmt = {
    Y: 'YYYY', // 同一年
    M: 'YYYY-MM',// 同一月
    D: 'YYYY-MM-DD',// 同一天
    H: 'YYYY-MM-DD HH',// 同一小时
    m: 'YYYY-MM-DD HH:mm',// 同一分钟
    s: 'YYYY-MM-DD HH:mm:ss'// 同一秒钟
  }
  return date1.format(fmt[type]) === date2.format(fmt[type])
}

// 获取阿里周时间区间
export function getAliWeekValues(rangeDate) {
  if (!Array.isArray(rangeDate)) return rangeDate
  const [start, end] = rangeDate
  return [
    getAliWeekRange(start)[0],
    getAliWeekRange(end)[1]
  ]
}

// 获取时间范围数值
export function isOverLimitDate(date1, date2, type, diff) {
  let start = date1
  let end = date2
  const split = {
    date: 1,
    week: 7
  }
  if (type == 'month') {
    return dayjs(start).add(diff, 'month') < dayjs(end)
  } else {
    return dayjs(start).add(diff * split[type], 'day') < dayjs(end)
  }
}

// 时间判空校验
export function isEmptyTime(time) {
  if (Array.isArray(time)) {
    return isEmpty(time) || isEmpty(time[0]) || isEmpty(time[1])
  } else {
    return isEmpty(time)
  }
}

    // 处理接收人 字符转成JSON
  // 使用@分隔群号和接收人，多个接收人使用','号分隔，多个钉钉群使用回车分隔
  export function getReceiver(receiver) {
    const moreGroups = receiver && receiver.split('\n') || []
    return moreGroups.filter(f => f).map(m => {
      const [groupNo, users] = m && m.split('@') || []
      const notifyers = users && users.split(/,|，/g) || []
      return {
        receiver: groupNo,
        notify: notifyers
      }
    })
  }
  // 处理接收人，JSON 转字符
  export function getReceiverToStr(receiver) {
    let value = receiver
    try {
      const v = JSON.parse(value)
      const s = Array.isArray(v) && v.map(vr => {
        const {receiver, notify} = vr
        if (isEmpty(notify)) return receiver
        return `${receiver}@${Array.isArray(notify) && notify.join('，') || notify}`
      }) || []
      return s.join('\n')
    } catch(e) {}
    return value
  }

  // 自然周转换为阿里周 区间时间
  export function getAliWeekFromWeek(weekValue) {
    return getAliWeekRange(dayjs(+dayjs('1970-01-01 00:00:00') + Number(weekValue) * 7 * 24 * 60 * 60 * 1000))
  }


  // 格式化时间
  export function fmtTime(time, fmtStr) {
    if (dayjs.isDayjs(time)) {
      return time.format(fmtStr)
    }
    return time
  }

  // 环比显示
  export function getRingRatioDisplay(val, props = {}) {
    const opt = Object.assign({
      iconSize: 'small',
      style: {},
    }, props)
    const cell = (className, iconType) => <span style={opt.style} className={className || ''}>
      {val}
      {iconType &&<Icon size={opt.iconSize} type={iconType}></Icon>}
    </span>
    return Object.assign([val], {
      up: (className) => cell(className || 'downcenter_FAIL', 'jiantou_xiangshang'),
      down:(className) => cell(className || 'downcenter_SUCC', 'jiantou_xiangxia'),
    })
  }

/**
 * 获取日历 表格配置
 */
// 周key
  export const getWeekKey = {
    'Sunday': '周日',
    'Monday': '周一',
    'Tuesday': '周二',
    'Wednesday': '周三',
    'Thursday': '周四',
    'Friday': '周五',
    'Saturday': '周六'
  }

  // 获取日历的起止时间
  export function getCalendarStartAndEnd(currentMonth) {
    if (dayjs(currentMonth).isValid()) {
      const start = dayjs(currentMonth).startOf('month')
      const end = dayjs(currentMonth).endOf('month')
      const newStart = start.subtract(start.day(), 'day')
      const newEnd = end.add(6 - end.day(), 'day')
      return {
        start: newStart,
        end: newEnd
      }
    } else {
      return {
        start: null,
        end: null
      }
    }
  }


// 格式化dataSource
  export function getCalendarTableData(tableData, {
    timeKey = 'dateTime',
    currentMonth,
    expand
  }) {
    if (!Array.isArray(tableData) || !currentMonth || !dayjs(currentMonth).isValid()) return tableData;
    const expandData = getObjType(expand) === 'Object' && expand || {}
    const { start, end } = getCalendarStartAndEnd(currentMonth)
    const newTableData = []
    let currentTime = start
    while(currentTime <= end) {
      newTableData.push({
        [timeKey]: currentTime.format('YYYY-MM-DD')
      })
      currentTime = currentTime.add(1, 'day')
    }
    const newList = [];
    let i = 0;
    newTableData.forEach(d => {
      if (isEmpty(newList[i])) {
        newList[i] = {}
      }
      const week = dayjs(d[timeKey]).day();
      const sd = tableData.find(t => dayjs(t[timeKey]).format('YYYY-MM-DD') == d[timeKey]) || {}
      newList[i][Object.keys(getWeekKey)[week]] = {
        ...expandData,
        ...sd,
        [timeKey]: d[timeKey],
        isCurrentMoth: dayjs(currentMonth).month() == dayjs(d[timeKey]).month(),
      };
      if (week == 6) i++;
    })
    return newList;
  }

// 获取表头 columns
  export function getCalendarTableColumn(callback) {
    const columns = {}
    Object.entries(getWeekKey).forEach(([key, title]) => {
      columns[key] = {
        title,
        cell: (...args) => {
          return typeof callback === 'function' && callback(...args)
        }
      }
    })
    return columns;
  }

// 将时间字符串转换成有效 dayjs 时间
  export function getStrToDayjsTime(time) {
    if (dayjs.isDayjs(time)) return time;
    // YYYY-MM-DD HH:mm:ss 正则 
    const dtReg = /\d{4}\-|\/\d{1,2}\-|\/\d{1,2}\s\d{1,2}\:\d{1,2}\:\d{1,2}/
    // YYYY-MM-DD 正则
    const dReg = /\d{4}\-|\/\d{1,2}\-|\/\d{1,2}/
    const tmsReg = /\d{1,2}\:\d{1,2}\:\d{1,2}/
    const tmReg = /\d{1,2}\:\d{1,2}/
    // 日期
    if (dtReg.test(time) || dReg.test(time)) return dayjs(time);
    // 时分秒
    if (tmsReg.test(time) || tmReg.test(time)) return dayjs('2023-08-29 ' + time);
    return time;
  }
