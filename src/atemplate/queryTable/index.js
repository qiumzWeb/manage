import React, { useEffect, useState, useRef, useImperativeHandle } from 'react'
import { queryList as QueryList, DialogButton, Button } from '@/component'
import { getSlotChildren, getChildren } from 'assets/js/proxy-utils'
import { getObjType, getResult, isEmpty } from 'assets/js'
import ButtonComponent from './config'
export default React.forwardRef(function Page(props, ref) {
  const [selectRows, setSelectRows] = useState([])
  const query = useRef()
  useImperativeHandle(ref, () => ({
    refresh,
    getQueryList: () => query && query.current
  }))
  // 获取配置
  function getOptions(options) {
    return getObjType(options) === 'Object' ? options : {}
  }
  // 查询配置
  const searchOptions = getOptions(props.searchOptions)
  // 表格配置
  const tableOptions = getOptions(props.tableOptions)
  // queryList 配置
  const queryListProps = getOptions(props.queryListOptions)
  // 工具栏 - 左侧
  const tools = getChildren(props.tools)
  // 右侧- 工具栏
  const rightTools = getChildren(props.rightTools)

  // 表格操作项
  const operations = getChildren(props.operations)
  if (!isEmpty(operations)) {
    const model = tableOptions.model || {}
    if (!model.make) {
      model.make = {
        title: '操作',
        lock: 'right'
      }
    }
    if (props.operationsWidth) {
      model.make.width = props.operationsWidth
    }
  }
  // 查询前拦截
  function beforeSearch(req, ...args) {
    const beforeSearchCall = searchOptions.beforeSearch
    if (typeof beforeSearchCall === 'function') {
      return beforeSearchCall.call(query.current, {
        pageProps: props,
        ...req
      }, ...args)
    }
  }
  // 渲染前拦截
  function formatData(...args) {
    const beforeRenderCall = tableOptions.formatData
    if (typeof beforeRenderCall === 'function') {
      return beforeRenderCall.call(query.current, ...args)
    }
  }
  const tableProps = {}
  // 显示多选框
  if (tableOptions.showRowSelection) {
    const { rowSelection={} } = (tableOptions.tableProps || {});
    Object.assign(tableProps, {
      rowSelection: {
        ...rowSelection,
        onChange: (keys, rows) => {
          setSelectRows(rows)
          typeof rowSelection.onChange === 'function' && rowSelection.onChange(keys, rows)
        },
        selectedRowKeys: selectRows.map(s => s.id || s.uuid),
      }
    })
  }
  // 刷新
  function refresh() {
    if (tableOptions.showRowSelection) {
      setSelectRows([])
    }
    query && query.current && typeof query.current.refresh === 'function' && query.current.refresh()
  }
  return <QueryList
    columnWidth={120}
    defaultValue="-"
    searchBtnText={searchOptions.searchBtnText}
    {...queryListProps}
    ref={query}
    searchModel={searchOptions.model}
    columns={tableOptions.model}
    formatSearchParams={beforeSearch}
    formatData={formatData}
    tableOptions={{
      url: searchOptions.url,
      method: searchOptions.method,
      sumUrl: searchOptions.sumUrl,
      sumButtonText: searchOptions.sumButtonText,
      attrs: {
        defineFieldCode: props.code,
        ...(tableOptions.tableProps || {}),
        ...tableProps,
      }
    }}
  >
    {!isEmpty(tools) && <div slot="tools">
      {tools.map((option, index) => {
        const {type, render, ...attrs} = option
        const Render = ButtonComponent[type] || render;
        if (typeof Render === 'function') {
          return <Render
            {...attrs}
            selectRows={selectRows}
            btnProps= {{mr: index === tools.length - 1 ? 0 : 10, ...option.btnProps}}
            queryListRefresh={refresh}
          ></Render>
        }
        return null
      })}
    </div> || null}
    {!isEmpty(rightTools) && <div slot="rightTools">
      {rightTools.map((option, index) => {
        const {type, render, ...attrs} = option
        const Render = ButtonComponent[type] || render;
        if (typeof Render === 'function') {
          return <Render
            {...attrs}
            selectRows={selectRows}
            btnProps= {{ml: 10, ...option.btnProps}}
            queryListRefresh={refresh}
          ></Render>
        }
        return null
      })}
    </div> || null}
    {!isEmpty(operations) && <div slot="tableCell" prop="make">
      {(val, index, record) => {
        const cellRender = operations.map(option => {
          const {type, show, disabled, render, ...attrs} = option;
          const Render = ButtonComponent[type] || render;
          const isVisible = typeof show === 'function' ? show(val, index, record) : show !== false;
          const isDisabled = typeof disabled === 'function' ? disabled(val, index, record) : disabled === true;
          if (isVisible && typeof Render === 'function') {
            return <Render
              {...attrs}
              disabled={isDisabled}
              makeIndex={index}
              data={Object.assign({}, option.data, record)}
              selectRows={[record]}
              btnProps= {{text: true, type: isDisabled ? undefined : 'link', mr: '10', disabled: isDisabled, ...option.btnProps}}
              queryListRefresh={refresh}
            ></Render>
          }
          return null
        }).filter(f => f)
        return <div>
          {isEmpty(cellRender) ? '-' : cellRender}
        </div>
      }}
    </div>}
    {props.children}
  </QueryList>
})