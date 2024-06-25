import React, { useRef, useState, useEffect } from 'react';
import { getWid, isEmpty } from 'assets/js'
import { Message, Card } from '@/component'
import Echarts from 'assets/js/charts'

export default function PieChart(props) {
  const timer = useRef()
  const { data, title, total } = props
  const chartRef = useRef()
  const dataChart = useRef();
  // 初始化
  useEffect(() => {
    DrawChart([])
  }, [])
  // 数据更新
  useEffect(() => {
    DrawChart(data || [])
  }, [data])

  // 获取图表 配置
  function getOptions(data){
    const chartOptions = {
      series: [{
        data: data.map((d, index) => ({
          ...d,
          name: d.label || '其它',
          value: +d.value || 0,
          title: title.slice(-4)
        })),
        center: ['40%', '50%'],
        label: {
          normal: {
            show: true,
            position: 'outside',
          },
        },
      }]
    }
    return chartOptions;
  }
  // drawChart
  function DrawChart(chartData) {
    chartData = Array.isArray(chartData) ? chartData : [];
    const options = getOptions(chartData)
    const chartOpt = () => ({
      el: chartRef.current,
      data: {
        type: 'pie',
        ...options,
        legend: (legend, {series}) => {
          const seriesData = Array.isArray(series) && series[0] && series[0].data || []
          return {
            ...legend,
            orient: 'vertical',
            right: '10%',
            left: 'auto',
            top:'15%',
            data: seriesData.map(d => d.name)
          }
        },
      },
      deep: true,
      options: {
        xAxis: [{
          axisLine: { // 轴线
            show: false,
          },
        }],
      }
    })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (!dataChart.current) {
        dataChart.current = new Echarts(chartOpt)
      } else {
        dataChart.current.clear()
        dataChart.current.update(chartOpt)
        dataChart.current.log()
      }
    }, 100)
  }

  return <Card definedStyle={{width: '48%'}}>
    <Card.Content>
      <div className='font-bold' style={{position: 'relative', height: 284}}>
        <div style={{position: 'absolute', top: 0, fontSize: 16}}>{title}</div>
        {!isEmpty(total) && <div style={{
          position: 'absolute',
          top: '50%',
          left: '40%',
          transform: 'translate3d(-50%, -50%, 0)',
          fontSize: 16,
          textAlign: 'center',
          width: 140,
        }}>
          <div style={{fontSize: 30, marginBottom: 8, wordBreak: 'break-all'}}>{total}</div>
          <div>预警总数</div>
        </div> || null}
        <div ref={chartRef} style={{width: '100%', height: '100%'}}></div>
      </div>
    </Card.Content>
  </Card>
}