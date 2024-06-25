import React, { useState, useEffect, useRef } from 'react';
import { DatePicker2, Button, AForm, Message, Loading  } from '@/component';
import { isEmpty, getWid, _getName, getToTT } from 'assets/js';
import Echarts from 'assets/js/charts'
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';
import { searchModel, typeOptions, getSearchData } from './config';


BalanceRageMonitor.title = '生产力平衡率监控'
let timer = null
export default function BalanceRageMonitor(props) {
  const [dataChart, setDataChart] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const form = useRef()
  const chartBox = useRef()
  // 设置默认选中
  const defaultSelected = {}
  typeOptions.forEach(c => {
    defaultSelected[c.value] = c.active
  })
  const typeSelected = useRef(defaultSelected)
  const searchParams = useRef({})
  // 初始化
  useEffect(() => {
    DrawChart([], form.current.getData())
    getChartData()
  }, [])
  // 获取数据
  async function getChartData() {
    try {
      setLoading(true) 
      const data = form.current.getData()
      searchParams.current = data
      const res = await getSearchData(data)
      setData(res)
      onSearch(res)
    } catch(e) {
      setData([]);
      Message.error(e.message);
    }
    setLoading(false)
  }
  // 查询
  async function onSearch(chartData = data) {
    DrawChart(chartData)
  }
  // 获取图表 配置
  function getOptions(chartData, params = searchParams.current){
    const chartOptions = {
      xAxis: [],
      series: []
    }
    if(isEmpty(params)) return chartOptions;
    // 配置
    const config = typeOptions.filter(f => typeSelected.current[f.value]);

    let currentHour = 0;
    while (currentHour < 24) {
      chartOptions.xAxis.push(String(getToTT(currentHour) + ":00"));
      currentHour++;
    }
    if (!isEmpty(chartData)) {
      chartOptions.xAxis.forEach((x, index) => {
        const d = chartData.find(c => {
          return getToTT(c.jobTime) + ":00" == x
        }) || {}
        // 生成曲线数据
        config.forEach(({label, value}, cIndex) => {
          if (!chartOptions.series[cIndex]) {
            chartOptions.series[cIndex] = {
              name: label,
              data: [],
              markLine: {
                data: [{ yAxis: 100, lineStyle: {
                  color: '#32CD32',
                  opacity: 0.1
                } }],
              }
            };
          }
          chartOptions.series[cIndex].data[index] = {
            value: d.jobTime ? (d[value] || 100) : 0,
          };
        })

      })
    }
    return chartOptions;
  }
  // drawChart
  function DrawChart(chartData, params) {
    const options = getOptions(chartData, params)
    const chartOpt = () => ({
      el: chartBox.current,
      data: {
        name: '平衡率(%)',
        type: 'line',
        ...options,
        dataZoom: false,
        axisLabelFontSizeLimit: 6,
      },
      options: {
        title: {
          top: '5%'
        },
        legend: {
          left: "10%",
          top: "5%"
        },
        toolTipUnit: '%'
      },
      deep: true,
    })
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!dataChart) {
        setDataChart(new Echarts(chartOpt))
      } else {
        dataChart.clear()
        dataChart.update(chartOpt)
        dataChart.log()
      }
    }, 100)
  }

  return <div>
  {/* 查询条件 */}
      <AForm ref={form} formModel={searchModel}>
        <div slot="formCell" prop="searchBtn">
          {() => <Button p onClick={getChartData}>查询</Button>}
        </div>
      </AForm>
      {/* 图表 */}
      <Loading visible={!!loading} style={{left: '45%', top: '40%', position: 'absolute'}}></Loading>
      <div ref={chartBox} style={{width: '100%', height: 'calc(100vh - 300px)'}}></div>
  </div>

}