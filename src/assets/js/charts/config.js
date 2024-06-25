import echarts from './echarts'
import { tooltipFormatter, axisLabelFormatter, seriesLabelFormatter } from './formatter'
import * as Color from './color'
export default function creatOption(
  data = {},
  options = {
    xAxis: [{}],
    yAxis: [{}],
    series: []
  },
  getOptions
) {
  if (options) {
    if (!options.xAxis || !Array.isArray(options.xAxis)) options.xAxis = [{}]
    if (!options.yAxis || !Array.isArray(options.xAxis)) options.yAxis = [{}]
    if (!options.series || !Array.isArray(options.series)) options.series = []
  }
  let xAxisData = data.xAxis ? {data: data.xAxis} : {};
  // 显示图标, 默认全选显示
  let legendSelected = {}
  options.series.forEach(s => {
    legendSelected[s.name] = s.show !== false
  })
  let legend = {
    type: data.legendType || 'scroll',
    // // left: data.left || '5%',
    left: '5%',
    top: '2%',
    right: 'auto',
    bottom: 'auto',
    orient: 'horizontal',
    itemWidth: 15,
    itemHeight: 8,
    selected: legendSelected,
    data: options.series.map(key => key.name)
  }
  if (data.legend !== false) {
    if (typeof data.legend === 'function') {
      legend = data.legend(legend, options)
    }
  } else {
    legend = undefined
  }

  return {
    title: {
      text: data.name,
      textStyle: {
        fontSize: 14
      }
    },
    axisLabelFontSizeLimit: data.axisLabelFontSizeLimit || null,
    color: data.colorType && Color[data.colorType] || (data.type === 'line' ? Color.lineColor : Color.barColor),
    legend: legend,
    tooltip: {
      show: true,
      showContent: true, // 显示提示框
      alwaysShowContent: false, // 永久显示提示框
      trigger: data.type === 'pie' ? 'item' : 'axis',
      axisPointer: { // 鼠标hover 效果
        show: true,
        type: 'shadow', // 'shadow'
        lineStyle: {
          color: '#ccc'
        },
        shadowStyle: {
          // color: {
          //   type: 'linear',
          //   x: 1,
          //   y: 1,
          //   x0: 1,
          //   y0: 1,
          //   colorStops: [{
          //       offset: 0, color: 'rgba(255,255,255,0)' // 0% 处的颜色
          //   }, {
          //       offset: 1, color: '#CCE6FF' // 100% 处的颜色
          //   }]
          // },
          color: 'rgba(54,97,204,0.1)'
        },
        z: 0,
      },
      triggerOn: 'mousemove|click',
      showDelay: 0,
      hideDelay: 100,
      enterable: false,
      renderMode: 'html',
      appendToBody: true,
      confine: data.confine || false, // 提示框 只在图表内显示，默认为false
      transitionDuration: 0.4,
      formatter: tooltipFormatter(getOptions),
      backgroundColor: '#1F2E55',
      borderColor: '#fff',
      borderWidth: 0,
      padding: [0, 0, 6, 0],
      textStyle: {
        color: '#fff'
      },
      extraCssText: 'box-shadow: 0 2px 6px 0 rgba(0,0,0,0.14);border-radius: 5px;',
    },
    grid: {
      left: data.left || '2%',
      right: data.right || '2%',
      bottom: data.bottom || '5%',
      top: data.top || '20%',
      containLabel: true
    },
    xAxis: options.xAxis.map(() => Object.assign({
      type: 'category',
      name: '',
      // nameTextStyle: {},
      nameGap: 15,
      nameRotate: null,
      boundaryGap: true,
      // splitNumber: data.xSplitNumber || undefined,
      // minInterval: 0,
      // maxInterval: 1000,
      // interval: 1,
      axisLine: { // 轴线
        show: true,
        lineStyle: {
          color: '#E8E6EF'
        }
      },
      axisTick: { // 刻度
        show: false,
        // lineStyle: {}
      },
      axisLabel: { // 刻度标签
        show: true,
        interval: 'auto',
        inside: false,
        rotate: data.xRotate || 0,
        margin: 20,
        formatter: axisLabelFormatter(getOptions),
        color: '#333',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontSize: 12,
        align: 'center',
        verticalAlign: 'middle',
        // lineHeight: 40,
      },
      splitArea: { // 分割区域
        interval: 'auto',
        show: false,
        // areaStyle: {},
      },
      splitLine: { // 分割线
        show: false,
        lineStyle: {
          color: '#E8E6EF',
          type: 'dashed'
        }
      },
    }, xAxisData)),
    yAxis: options.yAxis.map(() => ({
      type: 'value',
      name: data.unitStr,
      // minInterval: 1,
      splitNumber: data.ySplitNumber || undefined,
      nameGap: data.nameGap || 20,
      nameLocation: 'end',
      splitLine: {
        lineStyle: {
          color: '#E8E6EF',
          type: 'dashed'
        }
      },
      nameTextStyle: {
        align: 'left',
        fontFamily: 'Microsoft YaHei',
        lineHeight: 14,
        fontSize: 12,
        color: '#666',
        padding: [0, 66, 0, 0]
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          fontFamily: 'Microsoft YaHei',
          color: '#666',
          fontSize: 12
        }
      },
      // 设置轴线的属性
      axisLine: {
        lineStyle: {
          color: '#999',
          width: 0, // 这里是为了突出显示加上的
          height: 0
        }
      }
    })),
    series: options.series.map((item) => ({
      name: '',
      type: data.type,
      barWidth: 20,
      radius: ['50%', '80%'],
      center: ['50%', '50%'],
      selectedMode: 'single',
      selectedOffset: 10,
      barGap: 0,
      cursor: 'pointer',
      labelLayout: { hideOverlap: true },
      label: {
        normal: {
          show: true,
          position: 'top',
          fontSize: 12,
          formatter: seriesLabelFormatter(getOptions)
        }
      },
      smooth: true,
      areaStyle: data.isShadow ? {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(53,97,204,0.3)'
          },
          {
            offset: 1,
            color: 'rgba(53,97,204,0.05)'
          }
        ])
      } : undefined,
    })),
    dataZoom: data.dataZoom && [ // 滚动条
      {
        type: 'slider',
        show: data.xAxis.length > 13,
        height: 15,
        backgroundColor: 'rgba(47,69,84,0)',
        fillerColor: 'rgba(0,0,0,.2)',
        borderColor: '#ddd',
        labelPrecision: 'auto',
        labelFormatter: null,
        showDetail: false,
        showDataShadow: 'auto',
        realtime: true,
        textStyle: {
          color: '#333',
          fontSize: 12,
        },
        filterMode: 'filter',
        start: 0,
        end: (data.dataZoomShowCount || 13) * 100 / data.xAxis.length,
        left: '5%',
        top: 'auto',
        right: 'auto',
        bottom: 0,
        zoomLock: true,
        handleSize: 0,
        brushSelect: false,
      }
    ] || undefined,
  }
}
