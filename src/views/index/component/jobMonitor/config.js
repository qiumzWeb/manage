
import { thousands } from 'assets/js'
export const getFontSize = () => window.innerWidth * 12 / 1920
export const getLineWidth = () => window.innerWidth / 1920
export function tooltipFormatter (getOptions) {
  return params => {
    // console.log(params, getOptions())
    // 公共样式
    let style = `
    padding:0 ${px2rem(12)};
    color:#fff;
    font-size:${px2rem(12)};`
// 提示框 标题 样式
    function title(name) {
      return `<div style="${style}
      height:${px2rem(28)};
      line-height:${px2rem(28)};
      ">${name}</div>`
    }
// 提示框 内容 样式
    function detail(text) {
      return `
      <div style="${style}
      height:${px2rem(20)};
      line-height:${px2rem(20)};
      ">${text}</div>       
      `
    }
// 提示框 数值 获取
    function getValue(data) {
      let chartValue = data.value
      if (typeof data.value === 'object') {
        try {
          chartValue = data.value[(getOptions())['series'][data.seriesIndex]['encode']['y']] || 0
        } catch (e) {
          chartValue = null
          console.log(e)
        }
      }
      return isNaN(chartValue) ? chartValue : thousands(+chartValue)
    }
// 小图标样式
    function getMarker (color) {
      // 公共样式
      const publicStyle = `
      display:inline-block;
      margin-right:${px2rem(5)};
      width:${px2rem(10)};
      height:${px2rem(10)};
      `
      return {
        // 拆线图 - 空心圆
        line: `<span style="
        ${publicStyle}
        border: ${px2rem(2)} solid ${color};
        border-radius: 50%;
        "></span>`,
        // 柱状图 - 实心方块
        bar: `<span style="
        ${publicStyle}
        border-radius: ${px2rem(2)};
        background-color:${color}
        "></span>`,
        // 饼图 - 实心圆
        pie: `<span style="
        ${publicStyle}
        border-radius: 50%;
        background-color:${color}
        "></span>`
      }
    }
// 格式化内容
    let unit = getOptions()['toolTipUnit'] || ''
    let content = ''
    if (Array.isArray(params)) {
      content += title(params[0].axisValueLabel)
      params.forEach(key => {
        content += `
        <div style="${style}
        height:${px2rem(20)};
        line-height:${px2rem(20)};
        ">
        ${params.length > 1 && (getMarker(key.color))[key.seriesType] || ''}
        ${
          (typeof key.data === 'object' && key.data.name) ||
          (key.axisId === key.seriesId ? key.axisValueLabel : key.seriesName)
        }：
        ${getValue(key)}${unit}
        </div>`
      })
      
      return content
    } else {
      content += title(params.name)
      if (params.seriesType === 'pie') {
        params.value = typeof params.value === 'object' ? params.value.value : params.value
        content += detail(`${params.name}：${params.value}${unit}`)
        content += detail(`占比：${params.percent}%`)
      } else {
        content += detail(`${(getMarker(params.color))[params.seriesType]}${params.name}：${getValue(params)}${unit}`)
      }
      
      return content
    }
  }
}
// 线状配置
export const getChartOptions = () => ({
  textStyle: {
    fontSize: getFontSize()
  },
  legend: {
    itemWidth: window.innerWidth *  15 / 1920,
    itemHeight: window.innerWidth *  8 / 1920,
    inactiveBorderWidth: window.innerWidth *  2 / 1920,
    lineStyle: {
      width: window.innerWidth *  2 / 1920,
    }
  },
  xAxis: [{
    axisLine: { // 轴线
      lineStyle: {
        width: getLineWidth(),
      }
    },
    axisLabel: { // 刻度标签
      fontSize: getFontSize(),
      margin: window.innerWidth *  20 / 1920
    },
    splitLine: { // 分割线
      lineStyle: {
        width: getLineWidth()
      }
    },
  }],
  yAxis: [{
    splitLine: {
      lineStyle: {
        color: '#E8E6EF',
        type: 'dashed'
      }
    },
    nameTextStyle: {
      align: 'left',
      fontFamily: 'Microsoft YaHei',
      lineHeight: window.innerWidth * 14 / 1920,
      fontSize: getFontSize(),
      color: '#666',
      padding: [0, 66, 0, 0]
    },
    axisLabel: {
      show: true,
      textStyle: {
        fontFamily: 'Microsoft YaHei',
        color: '#666',
        fontSize: getFontSize()
      }
    }
  }]
})