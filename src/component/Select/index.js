import React, { useEffect, useState, useRef} from 'react';
import { Select } from '@alifd/next'
import { AssignProps } from 'assets/js/proxy-utils'
import { isTrue, widList, isAllIncludes } from 'assets/js'
import Bus from 'assets/js/bus'
import OverTips from '@/component/overTips'
import { Tag } from '@/component'
const maxCount = 500
const ASelect =  React.forwardRef(function (props, ref) {
  const {maxTagCount, tagInline, onChange, isASelect, dataSource, value, isOldPage,onSearch, ...attrs} = props
  const [options, setOptions] = useState(getDataSource(dataSource))
  const [searchOptions, setSearchOptions] = useState(getOptionsLimit(getDataSource(dataSource)))
  const [type, setType] = useState('')
  const [showTips, setShowTips] = useState(false)
  const [visible, setVisible] = useState(false)
  const showValue = attrs.mode === 'multiple' && (
    Array.isArray(value) && value.filter(v => isTrue(v)) || []
  ) || value;

  const [aValue, setAValue] = useState(showValue)
  // const selectRef = useRef()
  const getMaxTagCount = () => {
    return isTrue(maxTagCount) ? maxTagCount : 1
  }
  useEffect(() => {
    setOptionsData(dataSource)
  }, [dataSource])
  useEffect(() => {
    if (attrs.id === 'warehouseId' && !isASelect && props.value) {
      if (!type) {
        typeof onChange === 'function' && onChange(props.value)
      }
    }
    setShowTips(attrs.mode === 'multiple' && showValue.length > getMaxTagCount(),)
    setAValue(showValue)
    if (props.showSearch && !isAllIncludes(searchOptions, showValue)) {
      options.sort((a, b) => {
        if (showValue && typeof showValue.includes === 'function') {
          return showValue.includes(a.value) && -1
        } else {
          return showValue == a.value && -1
        }
      })
      setSearchOptions(getOptionsLimit([...options]))
    }
  }, [value])
  useEffect(() => {
    if (attrs.id === 'warehouseId' && (dataSource && !dataSource.length)) {
      const data = Bus.getState(widList)
      if (!data) {
        const unBus = Bus.watch(widList, (state) => {
          setOptionsData(state[widList].data || [])
        })
        return () => unBus()
      } else {
        setOptionsData(data.data || [])
      }
    }
  }, [])
  function getDataSource(data) {
    let list = Array.isArray(data) && data || []
    list = list.filter(l => !(l.value == '' && ['全部', '请选择', ''].includes(l.label)))
    return list
  }
  function getOptionsLimit(data) {
    if (!Array.isArray(data)) return []
    if (props.showSearch && data.length > maxCount) {
      data.sort((a, b) => {
        if (showValue && typeof showValue.includes === 'function') {
          return showValue.includes(a.value) && -1
        } else {
          return showValue == a.value && -1
        }
      })
    }
    return data.slice(0, maxCount)
  }
  function setOptionsData(data) {
    setOptions(getDataSource(data))
    setSearchOptions(getOptionsLimit(getDataSource(data)))
  }

  return <OverTips
    showTips = {showTips}
    tips = {showTips && !visible}
    align='tr'
    trigger={
      <Select
        ref={ref}
        placeholder={props.showSearch ? '请选择或输入关键字搜索': '请选择'}
        hasClear
        hasSelectAll={attrs.mode === 'multiple'}
        {...attrs}
        value={aValue}
        followTrigger={isOldPage}
        onChange={(val, activeType, item) => {
          setType(activeType)
          val = isTrue(val) ? val : ''
          if (attrs.mode === 'multiple') {
            val = val || []
          }
          typeof onChange === 'function' && onChange(val, activeType, item)
          setAValue(val)
        }}
        onSearch={onSearch || ((val) => {
          setSearchOptions(getOptionsLimit(options.filter(o => {
            if (typeof o.label === 'string') {
              return o.label.toLocaleLowerCase().includes(val.toLocaleLowerCase())
            } else {
              return val === o.label
            }
          })))
        })}
        dataSource={onSearch ? getDataSource(dataSource) : props.showSearch ? searchOptions : options}
        maxTagCount={getMaxTagCount()}
        tagInline={tagInline !== undefined ? tagInline : true}
        onVisibleChange={(v, ...arg) => {
          setVisible(v)
          if (typeof props.onVisibleChange === 'function') {
            props.onVisibleChange(v, ...arg)
          }
          if (!v) {
            setSearchOptions(getOptionsLimit(getDataSource(dataSource)))
          }
        }}
      ></Select>
    }
  >
    {options.filter(o => {
      return Array.isArray(value) ? value.some(v => v == o.value) : value == o.value
    }).map((m,index) => {
      return <Tag key={index} type="primary" style={{margin: '0px 10px 10px 0px'}}>{m.label}</Tag>
    })}
    </OverTips>
})
AssignProps(ASelect, Select)
export default ASelect