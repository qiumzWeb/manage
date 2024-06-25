import React, {useState, useEffect, useRef} from 'react'
import {Icon} from "@/component"
import OverSlider from '@/component/OverSlider'
import './px2rem.scss'
import {thousands} from 'assets/js'
import HelpTips from '@/component/HelpTips/index'
function setTitle(title, tips) {
  return <div style={{display: 'flex', alignItems: 'center'}}>
    <span>{title}</span>
    {tips && <HelpTips isRem maxWidth={px2rem(500)} iconProps={{ml: px2rem(5), className: 'isRemXs'}}>
      <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
        {tips}
      </pre>
    </HelpTips>}
  </div>
}
function formatValue(data, config) {
  data = data || {}
  const value = data[config.dataIndex] || 0
  if (typeof config.format === 'function') return config.format(value)
  if (!isNaN(value)) return thousands(value)
  return value
}

export default function App(props) {
  const {
    style,
    columns = [], // 表头
    data = [], // 表数据
    totalData, // 统计数据
    sliderProps = {} // 轮播props
  } = props
  useEffect(() => {

  }, [])
  const totalList = []
  if (Array.isArray(totalData)) {
    totalList.push(...totalData)
  } else if (totalData) {
    totalList.push(totalData)
  }
  return <div className='table-slider-box' style={{padding: `${px2rem(8)} ${px2rem(12)}`}}>
      <div className='s-c-b-table-title'>
        {columns.map((t, index) => {
          let style= {}
          if (t.width) {
            style={width: t.width + 'px', flex: 'auto'}
          }
          return <div className="s-c-b-table-t-cell" key={index} style={style}>{setTitle(t.title, t.tips)}</div>
        })}
      </div>
      <div className="table-container" style={{overflow: 'auto', ...style}}>
        {Array.isArray(data) && data.length && <OverSlider {...sliderProps}>
          {props.data.map((d, index) => {
            return <div key={index} className="s-c-b-tr">
              <div className='s-c-b-table-tr'>
                {columns.map((t, cIndex) => {
                  let style= {}
                  if (t.width) {
                    style={width: t.width + 'px', flex: 'auto'}
                  }
                  return <div className="s-c-b-table-t-cell" key={'' + index + cIndex} style={style}>
                    {formatValue(d, t)}
                  </div>
                })}
              </div>
            </div>
          }).flat()}
        </OverSlider> || <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d9d9d9'}}>暂无数据</div>}
      </div>
      {totalList.map((total, index) => {
        return  <div className='s-c-b-table-total-tr' key={index}>
        <div className='s-c-b-table-tr'>
            {columns.map((t, index) => {
              return <div className="s-c-b-table-t-cell" key={index}>
                {formatValue(total || {}, t)}
              </div>
            })}
        </div>
      </div>})}
  </div>
}