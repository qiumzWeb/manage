import React, { useState, useEffect, useRef, useMemo} from 'react'
import { ShelfPreview } from '@/component'
import { isEmpty } from 'assets/js'
import Bus from 'assets/js/bus'

export default function StorageLocationPreview(props) {
  const { value, loading } = props
  const [ dataList, setDataList ] = useState(value || [])
  const cacheChangeData = useRef({})

  useEffect(() => {
    const unBus = Bus.$on('getStorageData', (getData) => {
      typeof getData === 'function' && getData(cacheChangeData.current)
    })
    Array.isArray(value) && setDataList(value)
    return unBus
  }, [value])
  const dataValue = useMemo(() => getDataList(dataList), [dataList])
  // 格式化渲染数据
  function getDataList(list) {
    cacheChangeData.current = {}
    return Array.isArray(list) && list.map(lv => {
      const columnData = Array.isArray(lv) && lv.map(l => {
        const newL = {
          ...l,
          selected: l.isDelete != 1,
          label: l.roadwayCode + '-' + l.shelvesCode,
          mainText: l.rowNo + '-' + l.columnNo
        }
        if (l.isDelete == 1) {
          cacheChangeData.current[l.id] = newL
        }
        return newL
      })
      columnData.sort((a, b) => a.columnNo - b.columnNo)
      if (columnData.length < 10) {
        const restockData = []
        for (let a= 0; a < 10-columnData.length; a++) {
          restockData.push({disabled: true})
        }
        columnData.push(...restockData)
      }
      return columnData
    }) || [[]]
  }
  // 数据变动
  function onSelectChange(item) {
    cacheChangeData.current[item.id] = item
    console.log(item, cacheChangeData, '变动======')
  }
  return <ShelfPreview
      loading={loading}
      maxHeight={window.innerHeight - 285}
      cellWidth={200}
      value={dataValue}
      onSelect={onSelectChange}
  ></ShelfPreview>
}