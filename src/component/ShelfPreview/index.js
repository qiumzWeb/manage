import React, {useState, useEffect } from 'react';
import CardItem from './item'
import { Table } from '@/component'
import { getUuid } from 'assets/js'
import DivTable from './divTable'

export default function ShelfPreview(props) {
  const { value, onSelect, maxHeight, cellWidth, ...attrs } = props
  const maxLengthList = value.reduce((a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length >= b.length) {
        return a
      } else {
        return b
      }
    } else {
      return a
    }
  }, [])

  // 获取column
  const columnModel = {
    columnKey0: {
      title: '',
      lock: 'left',
      width: 90,
      cell: (val, rowIndex, record) => {
        return <div className='flex-center' style={{width: '100%', justifyContent: 'center'}}>
            层编号{getNo(value.length - rowIndex)}
        </div>
      }
    }
  }
  maxLengthList.forEach((m, index) => {
    columnModel['columnKey' + (index + 1)] = {
      ...m,
      title: `列编号${getNo(index + 1)}`,
      width: cellWidth + 40,
      cell: (val, rowIndex, record) => {
        return <CardItem {...val} width='100%' value={val.selected} onChange={(status) => {
          typeof onSelect === 'function' && onSelect({
            ...val,
            selected: status
          })
        }} ></CardItem>
      }
    }
  })
  function getNo(num) {
    if (isNaN(num)) return '00'
    return String(num)[1] ? num : '0' + num
  }
  // 获取data
  const dataValue = value.map(dv => {
    const item = {uuid: getUuid()}
    Array.isArray(dv) && dv.forEach((v, index) => {
      item['columnKey' + (index + 1)] = v
    })
    return item
  })
  dataValue.reverse()
  // return <Table {...attrs} dataSource={dataValue} small maxBodyHeight={maxHeight} hasBorder={false}>
  //   {Object.entries(columnModel).map(([key, item], index) => {
  //     return <Table.Column
  //       align="center"
  //       title={item.title}
  //       key={key}
  //       dataIndex={key}
  //       width={item.width}
  //       lock={item.lock}
  //       cell={item.cell}
  //     ></Table.Column>
  //   })}
  // </Table>
   return <DivTable data={dataValue} columns={columnModel} style={{height: maxHeight}}></DivTable>
}
