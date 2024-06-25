import React, {useState, useEffect, useRef, useImperativeHandle} from 'react'
import {Button, AEditTable, Table} from '@/component'
import Bus from 'assets/js/bus'
import { getResult, isEmpty, getObjType } from 'assets/js'
export default React.forwardRef(function App(props, ref){
  const tableRef = useRef()
  const {
    onChange, value, disabled, columns, beforeRemove, beforeAdd,
    watchKey, maxLength, children, defaultData, getopenfields,
    hasAdd, validate, addWidth, edit, ...attrs
  } = props
  const initData = () => [{...getDefaultData(0, value)}]
  const [listValue, setListValue] = useState(edit === false ? [] : initData());
  const TableFieldsRef = useRef([])
  const currentListData = useRef([])
  // 判断是否需要添加按钮 
  const isNeedAdd = typeof hasAdd === 'function' ? hasAdd(props) : hasAdd;
  function getDefaultData(index, list) {
    return typeof defaultData === 'function' ? defaultData(index, list) : defaultData
  }
  useEffect(() => {
    if (edit === false) {
      setListValue(value || [])
    } else {
      if (Array.isArray(value) && value.length) {
        const list = [...value]
        setListValue(list)
      }
    }
  }, [])
  useEffect(_ => {
    if (edit === false) {
      setListValue(value)
    } else {
      //   注册校验方法
      typeof validate === 'function' && validate(() => getCurrentData());
      // 是否强制更新
      const isForceUpdate = Array.isArray(value) && value.forceUpdate;
      // 是否编辑锁定
      const isEditLocked = getTableEditStatus();
      // 是否有更新
      const hasUpdate = JSON.stringify(value) != JSON.stringify(currentListData.current);
      if ((!isNeedAdd || isForceUpdate || !isEditLocked || hasUpdate) && Array.isArray(value)) {
        if(isNeedAdd && isEmpty(value)) {
          setListValue(initData())
        } else {
          setListValue(value)
        }
      }
    }

  }, [value])
  // 更新表数据
  function getChange(data) {
    currentListData.current = data
    typeof onChange === 'function' && onChange(data)
  }
  // 获取表数据，flag 为真时， 跳过表校验
  function getCurrentData(flag) {
    const table = tableRef && tableRef.current
    const data = table && typeof table.getData === 'function' ? table.getData(flag) : {}
    return data
  }
  // 获取表单编辑状态
  function getTableEditStatus() {
    const table = tableRef && tableRef.current
    const editStatus = table && typeof table.getEditStatus === 'function' ? table.getEditStatus() : null
    return editStatus
  }
  // 增加
  async function onAdd(index, record) {
    const list = getCurrentData(true)
    const result = await getResult(beforeAdd, record, index, list, TableFieldsRef.current)
    if (result !== false) {
      const newList = [
        ...list,
        {...getDefaultData(list.length, list)}
      ]
      setListValue(newList)
      getChange(newList)
    }

  }
  // 删除
  async function onRemove(index, record) {
    const list = [...getCurrentData(true)]
    const result = await getResult(beforeRemove, record, index, list, TableFieldsRef.current)
    if (result !== false) {
      list.splice(index, 1)
      setListValue(list)
      getChange(list)
    }
  }

  if (isNeedAdd && disabled !== true) {
    columns.add_form_make = {
        title: '操作',
        width: 100,
        lock: 'right',
    }
  } else {
    delete columns.add_form_make
  }

  // 普通表格
  if (edit === false) {
    // 将columns 对象 转换成 TableColumns 数组
    const { showIndex, ...tProps} = attrs;
    const getColumnsArr = (columnsObj) => {
      return Object.entries(columnsObj).map(([key, item]) => {
        // 多表头渲染
        if (getObjType(item.children) === 'Object') {
          return {
            dataIndex: key,
            ...item,
            children: getColumnsArr(item.children)
          }
        }
        // 单表头渲染
        return {
          dataIndex: key,
          ...item
        }
      });
    }
    const columnsArr = getColumnsArr(columns);
    if (showIndex) {
      columnsArr.unshift({ title: '序号', width: 80, dataIndex: 'index' })
      Array.isArray(listValue) && listValue.forEach((l, index) => {
        l.index = index + 1
      })
    }
    return <Table {...tProps} ref={tableRef} columns={columnsArr} dataSource={listValue}></Table>;
  }
  // 编辑表格, 最大数据量上限 为 100 
  return <AEditTable
    disabled={disabled}
    ref={tableRef}
    columns={columns}
    data={listValue}
    getOpenFields={({fields, hasUpdate}) => {
      typeof getopenfields === 'function' && getopenfields({fields, watchKey, hasUpdate});
      TableFieldsRef.current = fields;
    }}
    dataChange={d => getChange(d)}
    {...attrs}
  >
      {isNeedAdd && disabled !== true && <div slot="tableCell" prop="add_form_make">
        {(val, index, record) => {
          return <div>
            {listValue.length - 1 == index && index < maxLength - 1 && <Button type="link" mr="10" text onClick={async() => {
              await onAdd(index, record)
            }}>添加</Button>}
            {listValue.length > 1 && <Button type="link" text onClick={async() => {
              await onRemove(index, record)
            }}>删除</Button>}
          </div>
        }}
      </div>}
      {children}
  </AEditTable>
})