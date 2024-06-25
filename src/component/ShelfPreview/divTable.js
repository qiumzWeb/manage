import React, {useState, useEffect, useRef} from 'react'
import { isEmpty } from 'assets/js';
import { getDomBindScrollBar } from 'assets/js/proxy-utils';
import './table.scss'
export default function App(props) {

  const { style, columns = {}, data = [] } = props;
  const tableRef = useRef()
  const tableBoxRef = useRef()
  const tableTitleRef = useRef()

  // 初始化
  useEffect(() => {
    let unWatch = () => {}
    setTimeout(() => {
      unWatch = getDomBindScrollBar(
        [tableBoxRef.current, tableTitleRef.current],
        {type: 'left', callback: function(e){
          const leftClass = 'table-ping-left';
          const rightClass = 'table-ping-right';

          if (this.scrollLeft > 0) {
            tableRef.current.classList.add(leftClass)
          } else {
            tableRef.current.classList.remove(leftClass)
          }
          if (this.scrollWidth > this.clientWidth) {
            tableRef.current.classList.add(rightClass)
          } else {
            tableRef.current.classList.remove(rightClass)
          }
        }}
      )
    }, 100)
    return unWatch
  }, [])

  // 获取表头
  function getColumnsList(columnMap) {
    let columnList = Object.entries(columnMap)
    // 将锁定左边的 排序到最 前面 
    columnList.sort(([k1, v1], [k2, v2]) => {
      const isLeftLock = ['left', true]
      const compare1 = isLeftLock.includes(v1.lock) ? 0 : 1;
      const compare2 = isLeftLock.includes(v2.lock) ? 0 : 1;
      return compare1 - compare2
    })
    // 将锁定在 右边的 排序到最 后面
    columnList.sort(([k1, v1], [k2, v2]) => {
      const compare1 = v1.lock === 'right' ? 1 : 0;
      const compare2 = v2.lock === 'right' ? 1 : 0;
      return compare1 - compare2
    })
    // 获取锁定左边的 list
    columnList.fixedLeftList = columnList.filter(([k, v]) => v.lock === 'left' || v.lock === true);
    // 将锁定左边的最后一个进行标记
    columnList.fixedLeftList.slice(-1).forEach(([k, s]) => (s.flag = 'fixed-left-last'))
    // 获取锁定在右边的list 
    columnList.fixedRightList = columnList.filter(([k, v]) => v.lock === 'right')
    // 将锁定右边的第一个进行标记
    columnList.fixedRightList.slice(0, 1).forEach(([k, s]) => (s.flag = 'fixed-right-first'))
    return columnList
  }
  // table columns
  const tableColumns = getColumnsList(columns);
  // table width
  const listWidth = tableColumns.reduce((a, [k2, v2]) => {
    v2.left = a;
    return a + (v2.width || 100)
  }, 0);

  // table Header
  const getTableHeade = (tColumns) => tColumns.map(([k, t], index) => {
    let style= {}
    if (t.width) {
      style={
        width: t.width + 'px',
        flex: 'auto',
        position: t.lock ? 'sticky' : 'relative',
        left: t.lock ? t.left : 'auto'
      }
    }
    return <div className={`s-c-b-table-t-cell ${t.flag} ${t.lock && 'fixed-title' || ''}`} key={index} style={style}>{t.title}</div>
  })

  // table body
  const getTableBody = (tColumns, d, index) => tColumns.map(([dataIndex, t], cIndex) => {
    let style= {}
    if (t.width) {
      style={
        width: t.width + 'px',
        flex: 'auto',
        position: t.lock ? 'sticky' : 'relative',
        left: t.lock ? t.left : 'auto'
      }
    }
    return <div className={`s-c-b-table-t-cell ${t.flag} ${t.lock && 'fixed' || ''}`}
    key={'' + index + cIndex} style={style}>
      {t.cell(d[dataIndex], index, d)}
    </div>
  })
  // table render
  return <div className='table-div-box' >
      <div className='table-div-body' ref={tableRef}>
        <div className='table-div-title-box'>
          <div ref={tableTitleRef} className='s-c-b-table-title'>
            <div className='s-c-b-table-tr' style={{ width: listWidth, gridTemplateColumns: `repeat(${tableColumns.length}, 1fr)`}}>
              {getTableHeade(tableColumns)}
            </div>
          </div>
        </div>
        <div className="table-container" style={{...style}}>
            <div ref={tableBoxRef} className='table-container-list-box' >
              {isEmpty(data) && <div style={{
                position: 'absolute',
                top: 0,
                left: '45%',
                height: '80%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d9d9d9'}}
              >暂无数据</div> || <div className='s-c-v-b-tr-box'>
                {data.map((d, index) => {
                  return <div key={index} className="s-c-b-tr">
                    <div className='s-c-b-table-tr' style={{width: listWidth, gridTemplateColumns: `repeat(${tableColumns.length}, 1fr)`}}>
                      {getTableBody(tableColumns, d, index)}
                    </div>
                  </div>
                }).flat()}
              </div>}
            </div>
        </div>
      </div>

  </div>
}