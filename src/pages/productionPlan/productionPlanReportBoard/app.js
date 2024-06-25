import React, { useState, useEffect, useRef } from 'react';
import { DatePicker2, Button, AForm, Message, Loading, Icon, DialogButton, ExportFile } from '@/component';
import { isEmpty, getWid, _getName, getToTT } from 'assets/js';
import Echarts from 'assets/js/charts'
import $http from 'assets/js/ajax';
import dayjs from 'dayjs';
import { searchModel, filterTypeOptions, preChildren, planChildren, aclChildren, getSearchData, exportFormConfig } from './config';
import SelectItem from '@/component/ShelfPreview/item';

ProReportBoard.title = '生产计划大盘'
let timer = null
export default function ProReportBoard(props) {
  const state = props.location.state || {};
  const [dataChart, setDataChart] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const form = useRef()
  const chartBox = useRef()
  // 设置默认选中
  const defaultSelected = {}
  if (state && Array.isArray(state.predictionTypes)) {
    preChildren.filter(p => state.predictionTypes.includes(p.key)).forEach(c => {
      defaultSelected[c.value] = c.active
    })
  } else {
    preChildren.concat(planChildren).concat(aclChildren).forEach(c => {
      defaultSelected[c.value] = c.active
    })
  }

  const typeSelected = useRef(defaultSelected)
  const searchParams = useRef({})
  // 初始化
  useEffect(() => {
    DrawChart([], form.current.getData())
    setTimeout(getChartData, 2000)
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
    const config = [
      ...preChildren, ...planChildren, ...aclChildren
    ].filter(f => typeSelected.current[f.value]);

    if (params.timeType == 1) {
      let currentTime = dayjs(params.startDateTime);
      while (currentTime <= dayjs(params.endDateTime)) {
        chartOptions.xAxis.push(dayjs(currentTime).format("MM/DD"))
        currentTime = currentTime.add(1, 'day').startOf('day')
      }
    } else {
      let currentHour = 0;
      while (currentHour < 24) {
        chartOptions.xAxis.push(String(getToTT(currentHour) + ":00"));
        currentHour++;
      }
    }
    if (!isEmpty(chartData)) {
      chartOptions.xAxis.forEach((x, index) => {
        const d = chartData.find(c => {
          if (c.timeType == 1) {
            return dayjs(c.time).format("MM/DD") == x
          } else {
            return getToTT(c.time) + ":00" == x
          }
        }) || {}
        // 生成曲线数据

        config.forEach(({label, value}, cIndex) => {
          if (!chartOptions.series[cIndex]) {
            chartOptions.series[cIndex] = {
              name: label,
              data: [],
            };
          }
          chartOptions.series[cIndex].data[index] = {
            value: d[value] || 0,
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
        type: 'line',
        ...options,
        dataZoom: true,
        axisLabelFontSizeLimit: 6,
        dataZoomShowCount: 32,
        legendType: 'plain'
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
      <AForm ref={form} data={state} formModel={searchModel}>
        <div slot="formCell" prop="searchBtn">
          {() => <>
            <Button p mr="10" onClick={getChartData}>查询</Button>
            <DialogButton
              title="请选择导出数据的时间范围"
              config={exportFormConfig}

              footer={{
                ok: (item) => <ExportFile
                    destroyCallback={item.onClose}
                    beforeExport={(params) => {
                      const { startDateTime, endDateTime } = params
                      if (dayjs(startDateTime).add('7', 'day') < dayjs(endDateTime)) {
                        return '时间范围不能超过7天'
                      }
                    }}
                    params={() => {
                      const formData = item.form.current.getData();
                      return {
                        dataSource: 2,
                        ...(formData || {}),
                        warehouseId: form.current.getData().warehouseId
                      }
                    }}
                  ></ExportFile>
              }}
            >
              <Button s iconSize="medium"> <Icon type="download"/> 导出小时维度数据</Button>
            </DialogButton>
            
          </>}
        </div>
      </AForm>
      {/* 预测类型 */}
      <div style={{
        background: "rgba(242,244,248,0.60)",
        padding: "15px 20px",
        borderRadius: 10
      }}>
        <div className='flex-center' style={{justifyContent: 'space-between', marginBottom: 20}}>
          <div className='warn-color'>Tips: 点击具体单量类型即可显示/关闭对应曲线趋势图</div>
          <div className='main-color'></div>
        </div>
        <div className='flex-center'>
          {Object.entries(filterTypeOptions).map(([key, item], cIndex) => {
            return <div style={{position: 'relative', marginRight: 20}}>
              { cIndex && <div style={{position: 'absolute', width: 0, height: 'calc(100% - 20px)', left: -20, top: 10, borderLeft: "1px solid #ddd"}}></div> || ''}
              <div key={key}>
                <div style={{fontSize: 16, marginBottom: 10}}>{item.title}</div>
                <div style={{}}>
                  {item.children.map((cell, index) => {
                    return <SelectItem value={typeSelected.current[cell.value]} key={index} boxStyle={{
                      borderRadius: 15, display: 'inline-block',padding: "2px 15px", borderWidth: 1, minWidth: 80, marginRight: 10, marginBottom: 4
                    }} onChange={(val) => {
                      typeSelected.current[cell.value] = val;
                      onSearch()
                    }} style={{fontSize: 12, padding: "5px 0", border: 'none'}}>{cell.label.slice(0, -3)}</SelectItem>
                  })}
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
      {/* 图表 */}
      <Loading visible={!!loading} style={{left: '45%', top: '60%', position: 'absolute'}}></Loading>
      <div ref={chartBox} style={{width: '100%', height: 'calc(100vh - 470px)'}}></div>
  </div>

}