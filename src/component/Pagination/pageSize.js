import React, { useEffect, useState } from 'react';
import { Input, ATipsCard, Button, Icon, NumberPicker } from '@/component';
import { onEnter } from 'assets/js/utils';
import { getQuery, isEmpty } from 'assets/js';

/**
 * 最大设置页数, 存在 参数 maxPageSize 时，值为： 1、数字，最大 20000，  2、非数字， 最大5000
 */
const customSize = getQuery('maxPageSize');
const maxPageSize = isEmpty(customSize) ? 1000 : isNaN(customSize) ? 5000 : Math.min(customSize, 20000);


export default function PageSize(props) {
  const { pageSize, pageSizeList, onPageSizeChange, readOnly } = props
  const [pageSizeOptions, setPageSizeOptions] = useState(pageSizeList)
  const [value, setValue] = useState(pageSize)
  const [visible, setVisible] = useState(false)

  // 设置值
  function setPageSize(size) {
    const maxValue = Math.max(size, 5)
    setValue(maxValue)
    if (typeof onPageSizeChange === 'function') {
      onPageSizeChange(maxValue)
    }
    setPageSizeOptions((options) => {
      const newOP = [...new Set([...options, maxValue])]
      newOP.sort((a, b) => a - b)
      return newOP
    })
    setVisible(false)
  }
  // 输入框变动
  function onChange(val) {
    if (isNaN(val)) {
      setValue(value)
    } else {
      setValue(Math.min(val, maxPageSize))
    }
    
  }
  // 监控弹窗变动
  useEffect(() => {
    if (!visible && value !== pageSize) {
      setValue(pageSize)
    } 
  }, [visible])
  // 监听尺寸变动
  useEffect(() => {
    setValue(pageSize)
  }, [pageSize])


  return <div style={{display: 'inline-block'}}>
        每页显示：
    <ATipsCard
      visible={visible}
      // PopUpPisition={{top: 5, bottom: 5}}
      onClose={() => setVisible(false)}
      trigger={
        <span style={{display: 'inline-block', width: 80}} onClick={() => setVisible(v => !v)}>
          <Input
            style={{width: '100%'}}
            hasClear={false}
            readOnly={readOnly}
            innerAfter={
              <Icon s="m" type={visible ? "arrow-u" :"arrow-d"} mr="10" style={{color: "#999", cursor: 'pointer'}}></Icon>
            }
            onKeyDown={onEnter(() => {
              setPageSize(value)
            })}
            onFocus={() => {
              if (readOnly) return
              setValue('')
            }}
            value={value}
            hasTrigger={false}
            onChange={onChange}
          ></Input>
        </span>
    }>
      <div style={{background: '#fff', color: '#333', overflow: 'hidden'}}>
        {pageSizeOptions.map((m, index) => {
          return <div className={`pcs-tips-selector small ${pageSize == m && 'active' || ''}`} key={index} onClick={
            () => {setPageSize(m)}
          }>
            {pageSize == m && <Icon type="select" mr="8" s="s"></Icon> || <span style={{marginLeft: 20}}></span>}
            {m}
          </div>
        })}
      </div>
    </ATipsCard>
  </div>
}