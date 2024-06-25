import React, {useState, useEffect, useRef} from 'react'
import Echarts from 'assets/js/charts'
import { Card, Grid, Message, HelpTips, AForm, Button } from '@/component'
import { CardConfig, searchModel } from './config'
import $http from 'assets/js/ajax'
import { barColor } from 'assets/js/charts/color'
import { getChartOptions, getFontSize, getLineWidth, tooltipFormatter } from './chart-config'
require('./px2rem.scss')
export default function App(props) {
  const { goDetail } = props
  const [data, setData] = useState({})
  const [dataBarChart, setDataBarChart] = useState(null)
  const [dataPieChart, setDataPieChart] = useState(null)
  const form = useRef()
  useEffect(() => {
    setTimeout(() => {
      getDrawBarChart([])
      getDrawPieChart([])
    }, 500)
  }, [])
  // 获取包裹数据
  async function getPackageData() {
    const data = form.current.getData()
    try{
      const res = await $http({
        url: '/reversal/monitor/reversalStatistic',
        method: 'post',
        data
      })
      setData({
        ...data,
        ...res
      })
      getDrawBarChart(res.inBoundReasons || [], data)
      getDrawPieChart(res.inBoundNoLabelReasons || [], data)
    } catch(e) {
      console.log(e)
    }
  }
  // 获取 配置
  function getBarOptions(data, searchParams){
    const chartOptions = {
      xAxis: data.map(d => d.opReason),
      series: [{
        data: data.map((d, index) => ({
          ...d,
          ...searchParams,
          name: d.opCode == 0 ? '正常包裹' : '异常包裹',
          value: +d.inBoundPackages || 0,
          itemStyle: {
            color: barColor[index]
          }
        })),
        barWidth: window.innerWidth * 50 / 1920,
        labelLine: {
          lineStyle: {width: getLineWidth()}
        },
        labelLayout: {fontSize: getFontSize()},
      }]
    }
    return chartOptions;
  }
  // 生成入库原因Bar图表
  function getDrawBarChart(data, searchParams) {
    const chartOpt = () => ({
      el: document.getElementById('return-chart-box'),
      data: {
        type: 'bar',
        legend: false,
        ...getBarOptions(data, searchParams),
        top: "10%",
        bottom: '5%',
        dataZoom: [{
          height:  window.innerWidth * 15 / 1920
        }],
        axisLabelFontSizeLimit: 5,
        ySplitNumber: 9
      },
      onClick: (params) => {
        if (typeof goDetail === 'function') {
          goDetail({
            ...params.data,
            detailType: 0,
            content: params.data.opCode,
            contentShort: ''
          })
        }
      },
      deep: true,
      options: {
        ...getChartOptions(),
        // legend: {
        //   data: data.map(d => d.opReason)
        // },
        tooltip: {
          padding: [0, 0, 6, 0],
          appendToBody: false,
          textStyle: {
            fontSize: getFontSize()
          },
          formatter: tooltipFormatter(() => dataBarChart.getOptions())
        },
      }
    })
    setTimeout(() => {
      if (!dataBarChart) {
        const chart = new Echarts(chartOpt)
        setDataBarChart(chart)
      } else {
        dataBarChart.clear()
        dataBarChart.update(chartOpt)
        dataBarChart.log()
      }
    }, 0)
  }
  // 获取 配置
  function getPieOptions(data, searchParams){
    const chartOptions = {
      series: [{
        data: data.map((d, index) => ({
          ...d,
          ...searchParams,
          name: (d.contentShort || '未知原因').replace(/[a-zA-Z]|\_|\s|\:|\：|\,/g, ''),
          value: +d.packageCount || 0,
          title: '异常包裹'
        })),
        center: ['30%', '50%'],
        label: {
          normal: {
            show: true,
            position: 'outside',
          },
        },
        labelLine: {
          lineStyle: {width: getLineWidth()}
        },
        labelLayout: {fontSize: getFontSize()},
      }]
    }
    return chartOptions;
  }
  // 生成无法获取面单Pie图表
  function getDrawPieChart(data, searchParams) {
    const chartOpt = () => ({
      el: document.getElementById('return-chart-pie-box'),
      data: {
        type: 'pie',
        colorType: 'warn',
        legend: (legend, {series}) => {
          const seriesData = Array.isArray(series) && series[0] && series[0].data || []
          console.log(seriesData.map(d => d.name.replace(/[a-zA-Z]|\_|\s|\:|\：|\,/g, '')), '00')
          return {
            ...legend,
            orient: 'vertical',
            right: '5%',
            left: 'auto',
            data: seriesData.map(d => d.name)
          }
        },
        ...getPieOptions(data, searchParams),
        top: "10%",
        bottom: '0%',
      },
      onClick: (params) => {
        if (typeof goDetail === 'function') {
          goDetail({
            ...params.data,
            detailType: 1,
            content: params.data.content,
            contentShort: params.data.contentShort
          })
        }
      },
      deep: true,
      options: {
        tooltip: {
          padding: [0, 0, 6, 0],
          appendToBody: false,
          textStyle: {
            fontSize: getFontSize()
          },
          formatter: tooltipFormatter(() => dataPieChart.getOptions())
        },
      }
    })
    setTimeout(() => {
      if (!dataPieChart) {
        const chart = new Echarts(chartOpt)
        setDataPieChart(chart)
      } else {
        dataPieChart.clear()
        dataPieChart.update(chartOpt)
        dataPieChart.log()
      }
    }, 0)
  }

  return <div className='kpi-return'>
    <div style={{marginLeft: px2rem(20),display: 'flex'}}>
      <AForm ref={form} formModel={searchModel}></AForm>
      <Button type="primary" mt="32" ml='10' onClick={getPackageData}>查询</Button>
    </div>
    <div className="kpi-return-board ">
      {CardConfig.map((config, index) => {
        return <div className={`noshelf-board-col ${config.span}`} key={index}>
          {Object.entries(config).map(([key, item]) => {
            if (key == 'span') return
            return <div className={`noshelf-board-cell ${config.span}`} key={key}>
                <div className="noshelf-board-cell-title flex-center" style={{textAlign: item.titleAlign}}>
                {item.title}
                {item.tip && <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: 'isRemXl'}}>
                  <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
                  {item.tip}
                  </pre>
                </HelpTips>}
                </div>
                <div className={`noshelf-board-cell-content ${config.span}`}>
                  {typeof item.value == 'function' ? item.value(data, goDetail) : item.value}
                </div>
                {
                  item.subTitle && <>
                    <div className="noshelf-board-cell-subtitle">{typeof item.subTitle == 'function' ? item.subTitle(data) : item.subTitle}</div>
                  </>
                }
            </div>
          })}
          </div>
      })}
    </div>
  </div>

}