import { thousands, getObjType } from 'assets/js'
export function tooltipFormatter (getOptions) {
  return params => {
    // console.log(params, getOptions())
    // 公共样式
    let style = `
    padding:0 12px;
    color:#fff;
    font-size:12px;`
// 提示框 标题 样式
    function title(name) {
      return `<div style="${style}
      height:28px;
      line-height:28px;
      ">${name}</div>`
    }
// 提示框 内容 样式
    function detail(text) {
      return `
      <div style="${style}
      height:20px;
      line-height:20px;
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
      margin-right:5px;
      width:10px;
      height:10px;
      `
      return {
        // 拆线图 - 空心圆
        line: `<span style="
        ${publicStyle}
        border: 2px solid ${color};
        border-radius: 50%;
        "></span>`,
        // 柱状图 - 实心方块
        bar: `<span style="
        ${publicStyle}
        border-radius: 2px;
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
        height:20px;
        line-height:20px;
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
      const tipTitle = getObjType(params.data) === 'Object' && params.data.title;
      content += title(tipTitle || params.name)
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

export function axisLabelFormatter (getOptions) {
  return params => {
    let fontLength = getOptions() && getOptions()['axisLabelFontSizeLimit']
    if (!fontLength) {
      return params
    } else {
      let fontArr = params.split('')
      const maxLength = fontLength * 2
      if (fontArr.length > maxLength) {
        fontArr = fontArr.slice(0, maxLength - 1)
        fontArr.push('...')
      }
      fontArr.splice(fontLength, 0, '\n')
      return fontArr.join('')
    }
  }
}

export function seriesLabelFormatter (getOptions) {
  return params => {
    let val = params.value
    let total = params.data.chartTotal
    if (!val && !total) return ''
    if (typeof val === 'object') {
      try {
        let seriesEncodeVal = val[(getOptions())['series'][params.seriesIndex]['encode']['y']]
        return thousands(+seriesEncodeVal || '')
      } catch (e) {
        return ''
      }
    }
    return thousands(+total || +val || '')
  }
}
