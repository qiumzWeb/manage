import React, {useEffect, useState, useRef} from 'react'
import {Table, Button, Card, Icon, NumberPicker } from '@/component'
import DraggableTable from '@/component/DraggableTable'
import { getObjType, getUuid, isEmpty } from 'assets/js'
import ArrorToChildSet from './ArrorToChildSet'
import Bus from 'assets/js/bus'
import { columns } from './config'
export default function ChildrenSet(props) {
  const {onChange, cacheKey, parentName } = props
  const [selectRow, setSelectRow] = useState([])
  const [listData, setListData] = useState([])
  const childRef = useRef()
  // 初始化数据
  useEffect(async() => {
    const sD = getData(props.data)
    setSelectRow(sD.filter(f => f.show))
    setListData(sD)
  }, [])
  // 表头变动时更新数据
  useEffect(async() => {
    const sD = getData(props.data)
    setSelectRow(sD.filter(f => f.show))
    setListData(sD)
  }, [props.data])
  // 对象转成数组
  function getData(data) {
    const newList = []
    getObjType(data) === 'Object' && Object.entries(data).forEach(([key, val]) => {
      newList.push({
        key,
        ...val
      })
    })
    newList.sort((a, b) => a.index - b.index)
    return newList
  }
  // 数组转成对象
  function getDataToObject(list) {
    const newData = {}
    Array.isArray(list) && list.forEach(l => {
      newData[l.key] = l
    })
    return newData
  }
  // 更新表头
  function updateField(data) {
    const searchData = getDataToObject(data)
    typeof onChange === 'function' && onChange(searchData)
  }
  // 更新bus数据
  function updateBusStoreData(key, data) {
    const busData = Bus.getState(cacheKey)
    function updateChildren(parentData) {
      Object.entries(parentData).forEach(([k, item]) => {
        if (k == key) {
          parentData[key].children = data
        } else if (!isEmpty(item.children)) {
          updateChildren(item.children)
        }
      })
    }
    updateChildren(busData)
    Bus.setState({[cacheKey]: busData})
  }
  // 多表头渲染
  function CellRender(val, index, record) {
    if (getObjType(record.children) === 'Object') {
      return <ArrorToChildSet
        name={[...parentName, record.key]}
        cacheKey={cacheKey}
        container={childRef}
        data={record.children}
        value={val}
        onChange={(data) => {
          updateBusStoreData(record.key, data)
        }}
      ></ArrorToChildSet>
    }
    return val
  }
  return <div style={{display: 'flex', alignItems: 'flex-start'}} onClick={e => e.stopPropagation()}>
    <Card title={props.value}>
      <Card.Content>
        {<DraggableTable
          inset
          copyHide
          style={{width: 600}}
          type="children"
          className="small"
          dataSource={listData}
          primaryKey="key"
          maxBodyHeight={false}
          onChange={(data) => {
            setListData(data)
            updateField(data)
          }}
          rowSelection={{
            onChange: (keys, rows) => {
              setSelectRow(rows)
              const list = listData.map(l => {
                  if (rows.some(r => r.key == l.key)) {
                      l.show = true
                  } else {
                      l.show = false
                  }
                  return l
              })
              updateField(list)
            },
            selectedRowKeys: selectRow.map(s => s.key),
            getProps: record => {
              return {
                disabled: record.required
              }
            }
          }}
        >
            <Table.Column title="排序" width={50} dataIndex='index'></Table.Column>
            {Object.entries(columns).map(([dataIndex, item], cindex) => {
              return <Table.Column title={item.title} width={item.width} key={cindex} dataIndex={dataIndex} cell={(val, index, record) => {
                if (record.children || dataIndex == 'lock') return '-'
                const Com = item.component
                return <Com {...(item.attrs || {})} defaultValue={val} onChange={num => {
                  const list = [...listData]
                  list[index][dataIndex] = num
                  updateField(list)
                }}></Com>
              }}></Table.Column>
            })}
            <Table.Column title='字段名（可拖拽排序）' dataIndex='label' cell={CellRender}></Table.Column>
        </DraggableTable>}
      </Card.Content>
    </Card>
      {/* {childrenTable} */}
      <div ref={childRef}></div>
    </div>
}