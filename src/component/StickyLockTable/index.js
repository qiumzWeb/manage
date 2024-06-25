import React, {useEffect, useState, useMemo} from 'react'
import { Table } from '@alifd/next';
import { isEmpty, sumDataCode, getObjType } from 'assets/js'

export default React.forwardRef(function StickyLockTable(props, ref){
  const {isLazy, dataSource, sumDataSource, children, rowProps, ...attrs} = props
  const [tData, setTData] = useState([])
  const [tChildren, setTChildren] = useState(null)
  useEffect(() => {
    const listData = Array.isArray(dataSource) ? dataSource : [];
    const sumData = Array.isArray(sumDataSource) ? sumDataSource : [];
    setTData(listData.concat(sumData));
  }, [dataSource, sumDataSource])
  useEffect(() => {
    setTChildren(children)
  }, [children])
  const useVirtual = isEmpty(isLazy) ? Array.isArray(dataSource) && dataSource.length > 50 : !!isLazy
  return <Table.StickyLock
    ref={ref}
    dataSource={tData}
    useVirtual={useVirtual}
    rowProps={(record, index, ...args) => {
      const rp = typeof rowProps === 'function' ? (rowProps(record, index, ...args) || {}) : {};
      const className = getObjType(rp) === 'Object' && rp.className || '';
      return {
        ...rp,
        className: record[sumDataCode] ? className + ' tableSumRow' : className,
      }
    }}
    {...attrs}
  >
  {tChildren}
  </Table.StickyLock>
})