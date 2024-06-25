import React, {useState, useRef} from 'react'
import { Button, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import $http from 'assets/js/ajax'
import Echarts from 'assets/js/charts'
import dayjs from 'dayjs'
import { _getName, isEmpty } from 'assets/js'
import { getRangTime, getAliWeekValues, isOverLimitDate, isEmptyTime } from '@/report/utils'
import { 
  qSearch, tColumns, tabelSearchUrl, chartSearchUrl,
  dataRangOptions, getBaseData, getLineOptions, timeOpts
} from './config'
export default React.forwardRef(function App(props, ref) {
  const {goDetail} = props
  const query = useRef()
  const chartbox = useRef()
  const [params, setParams] = useState({})
  const [dataChart, setDataChart] = useState(null)
  // 查询前 参数配置
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (isEmpty(data.warehouseId)) return '请选择仓库';
    // 时间必填 
    if (isEmptyTime(data.markingTime)) return '请选择日期区间'
    // 格式化时间
    const formatOpt = {
      1: [data.markingTime[0].startOf('day'), data.markingTime[1].endOf('day')],
      2: getAliWeekValues(data.markingTime),
      3: [data.markingTime[0].startOf('month'), data.markingTime[1].endOf('month')],
    }
    data.markingTime = formatOpt[data.showRangeType]
    
    const time = getRangTime(data, {time: 'markingTime', start: 'startDate', end: 'endDate'})
    // 时间范围校验
    const type = _getName(dataRangOptions.map(d => ({...d, label: d.type})), data.showRangeType, 'date')
    const limitOpt = {
      date: {limit: 7, msg:'查询时间范围不能超过7天'},
      week: {limit: 4, msg:'查询时间范围不能超过4周'},
      month: {limit: 4, msg:'查询时间范围不能超过4个月'}
    }
    if (isOverLimitDate(time.startDate, time.endDate, type, limitOpt[type].limit)) return limitOpt[type].msg 
    const searchData = {
      ...data,
      ...time
    }
    setParams(searchData)
    // 分页时不触发 图表查询
    ![3, 4].includes(action) && getBoardData(searchData)
    return {
      ...req,
      data: searchData
    }
  }
  // 获取看板图表数据
  async function getBoardData(data) {
    try {
      const res = await $http({
        url: chartSearchUrl,
        method: 'post',
        data
      })
      const start = data.startDate
      const end = data.endDate
      const timeList = []
      let chartData = []
      // 获取数据
      let d = start
      while(dayjs(d) < dayjs(end)) {
        timeList.push(d)
        d = timeOpts[data.showRangeType].add(d)
      }
      chartData = timeList.map(t => {
        const a = timeOpts[data.showRangeType].value(t)
        const dc = getBaseData({makingTime: a})
        if(Array.isArray(res)) {
          res.some(r => {
            if (r.makingTime && a == timeOpts[data.showRangeType].fmt(r.makingTime)) {
              Object.assign(dc, r, {makingTime: a})
              return true
            }
            return false
          })
        }
        return dc
      })
      drawBoard(chartData)
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 格式化列表数据
  const formatData = () => {}
  // queryList 初始化
  const afterMounted = (vm) => {
    setTimeout(e => drawBoard([]), 100) 
  }
  // 绘制看板图表
  function drawBoard(data) {
    const chartOpt = {
      el: chartbox.current,
      data: {
        type: 'line',
        ...getLineOptions(data),
        dataZoom: true,
        // axisLabelFontSizeLimit: 5,
        // ySplitNumber: 9
      },
      deep: true,
    }
    if (!dataChart) {
      const chart = new Echarts(chartOpt)
      setDataChart(chart)
    } else {
      dataChart.clear()
      dataChart.update(chartOpt)
    }

  }
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      columnWidth={150}
      defaultValue='-'
      afterMounted={afterMounted}
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: tabelSearchUrl,
        method: 'post',
        attrs: {
          defineFieldCode: 'abnormalMonitorBoard'
        }
      }}
    >
      <div slot='expand' style={{marginTop: 10}}>
        <div style={{fontWeight: 'bold'}}>异常数据看板（丢失 + 破损）- {_getName(dataRangOptions, params.showRangeType, '日')}</div>
        <div ref={chartbox} style={{width: '100%', height: 'calc(30vh)'}}></div>
      </div>
      <div slot="tableCell" prop="totalNum">{
        (val, index, record) => {
          return <Button text type="link" onClick={() => goDetail(record)}>{val}</Button>
        }
      }</div>
    </QueryList>
  </div>
})