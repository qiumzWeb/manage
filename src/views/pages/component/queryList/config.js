import React from 'react'
import {
  Input, DatePicker, 
} from '@/component'
import ASelect from '@/component/ASelect'
import $http from 'assets/js/ajax'
// 组件配置
export const searchComponent = {
  'input': Input,
  'inputtext': Input,
  'select': ASelect,
  'inputdate': DatePicker
}



// 查询配置
export function getSearchModel(model) {
  if (!Array.isArray(model)) return null;
  const smCell = {}
  model.forEach((m, index) => {
    const getComponent = () => {
      return searchComponent[(m.tag || 'input') + (m.type || '')]
    }
    let getOptions = {}
    // 时间组件配置
    if (m.tag == 'input' && m.type == 'date') {
      getOptions= {
        followTrigger: true,
        showTime: true,
      }
    }
     // select 组件配置
    if (m.options) {
      if (Array.isArray(m.options)) {
        getOptions = {
          isOldPage: true,
          showSearch: true,
          mode: m.multiple ? 'multiple' : 'single',
          getOptions: async () => {
            return m.options
          }
        }
      } else {
        const {url, render, method, data, codeTrans, relate, params} = m.options
        const watchKey = relate ? { watchKey: relate} : {}
        getOptions = {
          isOldPage: true,
          showSearch: true,
          mode: m.multiple ? 'multiple' : 'single',
          ...watchKey,
          getOptions: async(props) => {
            if (codeTrans) {
              return Object.entries(codeTrans).reduce((a, [key, val]) => {
                a.push({label: val, value: key})
                return a
              }, [])
            }
            const {field} = props
            let dp = data
            if (relate) {
              let key = relate
              const watchValue = field.getValue(relate)
              if (!watchValue) return []
              if (params) {
                key = params[relate]
              }
              dp = Object.assign(data || {}, {
                [key]: watchValue
              })
            }
            const res = await $http({
              url,
              method: method || 'get',
              data: dp,
              oldApi: true
            })
            const opt = typeof render === 'function' && render(res) || []
            return opt
          }
        }
      }
    }
    smCell[m.name] = {
      label: m.label.replace(/\:$/, ''),
      component: getComponent(),
      fixedSpan: 15,
      attrs: {
        ...getOptions,
        defaultValue: m.value || ''
      }
    }
  })
  return [smCell]
}
// 表头配置
export function getColumnsModel(model) {
  if (!Array.isArray(model)) return {}
  const columns = {}
  model.forEach((m, index) => {
    const {title, data, render} = m
    let renderCell = {}
    if (typeof render === 'function') {
      renderCell = {
        cell: (value, rowIndex, record) => {
          return render(value, record, rowIndex)
        }
      }
    }
    columns[data] = {
      title,
      ...renderCell
    }
  })
  return columns
}