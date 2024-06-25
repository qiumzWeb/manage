import React, {useState, useEffect, useRef} from 'react'
import Echarts from 'assets/js/charts'
import HelpTips from '@/component/HelpTips/index'
import {Icon} from "@/component"
import moment from 'moment'
import './px2rem.scss'
import {thousands, sleepTime} from 'assets/js'
import { getChartOptions, getFontSize, getLineWidth, tooltipFormatter } from './config'
const config = {
  instock: '入库',
  onShelves: '上架',
  offShelves: '下架',
  allot: '播种',
  merge: '合箱',
  receive: '接单',
  outstock: '出库'
}
export default function App(props) {
  const boxRef = useRef()
  const [tagStatus, setTagStatus] = useState(0)
  const data = (props.data || []).filter(f => f.timestamp)
  const [dataChart, setDataChart] = useState(null)
  data.sort((a, b) => a.timestamp - b.timestamp)
  // const data = new Array(12).fill()
  // 获取 配置
  function getOptions(){
    const chartOptions = {
      xAxis: [],
      series: []
    }
    data.forEach((d, index) => {
      // 获取 X 轴数据
      chartOptions.xAxis.push(moment(d.timestamp).format('MM/DD HH:mm'));
      // 生成曲线数据
      Object.entries(config).forEach(([key,name], cIndex) => {
        if (!chartOptions.series[cIndex]) {
          chartOptions.series[cIndex] = {
            name,
            data: [],
            lineStyle: {width: window.innerWidth * 2 / 1920},
            labelLine: {
              lineStyle: {width: getLineWidth()}
            },
            labelLayout: {fontSize: getFontSize()},
          };
        }
        chartOptions.series[cIndex].data[index] = {
          value: d[key] || 0,
        };
      })
    })
    return chartOptions;
  }
  useEffect(async () => {
    const chartOpt = () => ({
      el: boxRef.current,
      data: {
        type: 'line',
        ...getOptions(),
        dataZoom: true,
        axisLabelFontSizeLimit: 6,
        // ySplitNumber: 9
      },
      deep: true,
      options: {
        ...getChartOptions(),
        tooltip: {
          padding: [0, 0, 6, 0],
          formatter: null,
          appendToBody: false,
          textStyle: {
            fontSize: getFontSize()
          },
          formatter: tooltipFormatter(() => dataChart.getOptions())
        },
      }
    })
    setTimeout(() => {
      if (!dataChart) {
        const chart = new Echarts(chartOpt)
        setDataChart(chart)
      } else {
        dataChart.clear()
        dataChart.update(chartOpt)
        dataChart.log()
      }
    }, 0)
  }, [data])
  return <div className='job-monitor'>
    <div className='job-m-title'>
      {/* <Icon defineType="zuoye-watch" mr="10"></Icon> */}
      <span>分时作业监控</span>
      <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: 'isRemXl'}}>
        <span style={{fontSize: px2rem(14)}}>说明：以整点为节点，1小时为统计维度统计入库、上架、下架、播种、合箱操作的总数，展示近12小时的数据；默认展示所有折线，点击折线其中一条这将此条折线隐藏；</span>
      </HelpTips>
    </div>
    <div ref={boxRef} className="job-chart"></div>
  </div>
}