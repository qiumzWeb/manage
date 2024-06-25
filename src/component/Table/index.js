import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Table } from '@alifd/next';
import { Loading, StickyLockTable, CopyTableData as CopyTableDataButton, DefineFieldSet } from '@/component';
import {getUuid, getOffsetTop, sleepTime, isEmpty, deepClone} from 'assets/js';
import { AssignProps, isInDialog, isInTable, getChildren, getDomBindScrollBar } from 'assets/js/proxy-utils';
import { addWatchDom, getTipsNode, getData, getFieldKey, getTableColumnsNode, renderListCell } from './utils'
import { columns as defineColumns } from '@/component/DefineFieldSet/config'
let minHeight = 300;
const ATable = React.forwardRef(function ATable(props, ref) {
  const [maxHeight, setMaxHeight] = useState(minHeight)
  const {dataSource, children, columns, inset, small, loading, copyHide, defineField, defineFieldCode, bottomTools, copyConfig = {}, ...attrs} = props;
  const [atDialog, setAtDialog] = useState(true);
  const [tData, setTData] = useState([]);
  const [TableColumns, setTableColumns] = useState([]);
  const [defineConf, setDefineConf] = useState({});
  const scrollRef = useRef();
  const scrollBarRef = useRef();
  const boxRef = useRef();

  // 获取表头， children 优化级高于 columns
  let TableChildren = children;
  if (isEmpty(TableChildren) && Array.isArray(columns)) {
    TableChildren = getTableColumnsNode(columns);
  }

  // 监听数据
  useEffect(() => {
    setTData(getData(dataSource))
  }, [dataSource]);

  useEffect(() => {
    setTableColumns(getColumns(TableChildren, defineConf))
  }, [children, columns]);

  // 初始化组件
  useEffect(async () => {
    let currentBodyHeight = maxHeight
    let tabody = null;
    let scrollBar = null;
    await sleepTime(10, () => boxRef.current)
    setAtDialog(isInDialog(boxRef.current) || isInTable(boxRef.current) || inset)
    if (!isInDialog(boxRef.current) && !isInTable(boxRef.current) && !inset) {
      let unWatchScroll = () => {}
      const unWatch = addWatchDom(() => {
        tabody = boxRef.current && boxRef.current.querySelector('.next-table-body')
        if (tabody) {
          tabody.classList.add('scrollBarHide')
          const contentBox = document.getElementById('pcs-app-route')
          minHeight = contentBox.clientHeight - 140
          const offsetTop = getOffsetTop(tabody, contentBox)
          const windowHeight = contentBox.clientHeight || window.innerHeight
          const bodyHeight = Math.max(windowHeight - offsetTop - 80, minHeight)
          if (currentBodyHeight !== bodyHeight) {
            setMaxHeight(bodyHeight)
            currentBodyHeight = bodyHeight
          }
// tabody 定制滚动 条
          scrollBar = scrollBarRef.current
          scrollBar && (scrollBar.style.width = tabody.clientWidth + 'px')
          const scrollCell = scrollRef.current
          scrollCell && (scrollCell.style.width = tabody.scrollWidth + 'px')
          unWatchScroll = getDomBindScrollBar([scrollBar, tabody])
        }
      })
      return () => {
        unWatch()
        unWatchScroll()
      }
    }

  }, [])
  // 筛选 lock = right 
  const lockRightCell = getChildren(TableChildren).filter(c => c && c.props && getFieldKey(c.props) && c.props.lock == 'right')
  // 渲染表头
  /**
   * 
   * @param {*} columns 表头
   * @param {*} defineData  生成自宝义表头
   * @param {*} dataTitle 生成复制表头
   * @returns 
   */
  function getColumns(columns, defineData, dataTitle = {}) {
    // 列渲染
    const tCell = (child, index) => {
      const dataIndex = getFieldKey(child.props);
      const label = typeof child.props.title === 'function' ? child.props.title() : child.props.title;
      // 非弹窗表格设置自定义表头
      if (!atDialog && defineData && dataIndex && label) {
        const d = defineData[dataIndex] || {}
        const defineProps = {}
        Object.keys(defineColumns).forEach(defineKey => {
          defineProps[defineKey] = child.props[defineKey]
        })
        defineData[dataIndex] = {
          show: true,
          required: !!child.props.lock,
          index: index + 1,
          ...defineProps,
          ...d,
          label,
        }
        if (isEmpty(defineData[dataIndex].lock)) {
          delete defineData[dataIndex].lock;
        }
        if (!defineData[dataIndex].show) return null;
      }
      // 判断是否是 lock = right 的同名 复制品， 对复制品只做占位处理，不做显示
      const isLockRightCopy = lockRightCell.some(l => getFieldKey(child.props) === getFieldKey(l.props) && !child.props.lock);
      // 检查是否有自定义cell
      const { definedCell, listKey, renderLevel, renderKey, ...childProps } = child.props;
      if (defineData && defineData[dataIndex]) {
        Object.keys(defineColumns).forEach(dkey => {
          if (defineData[dataIndex][dkey]) {
            childProps[dkey] = defineData[dataIndex][dkey]
          }
        })
      }
      let definedCellRender = (
        // 自定义Cell
        typeof definedCell === 'function' && definedCell(getTipsNode, child.props.cell)
      ) || (
        // 子列表 Cell
        listKey && (renderListCell({
          key: renderKey || dataIndex,
          format: child.props.cell,
          listKey,
          renderLevel,
        })(getTipsNode))
      );
      // 获取 cell 
      const cell = !isLockRightCopy ? (
        definedCellRender || getTipsNode(child.props.cell)
      ) : () => null;
      // 设置复制表头数据
      dataTitle[dataIndex] = {title: label, cell};
      return <Table.Column
        {...childProps}
        cell={cell}
        title={getTipsNode(child.props.title)}
        key={getUuid()}
      ></Table.Column>
    }
    // 多表头群组渲染
    const tGroup = (child, tGroupProps, index) => {
      const key = getFieldKey(tGroupProps);
      const label = tGroupProps.title;
      let childColumns = null;
      if (!atDialog && defineData && key && label) {
        const d = defineData[key] || {children: {}};
        childColumns = getColumns(child, d.children, dataTitle);
        defineData[key] = {
          show: true,
          index: index + 1,
          ...d,
          label,
          children: childColumns.conf
        }
        if (!defineData[key].show) return null;
      }
      
      return <Table.ColumnGroup align="center" {...tGroupProps} key={getUuid()}>
        {childColumns || getColumns(child, dataTitle)}
      </Table.ColumnGroup>
    }
    let newChildren = getChildren(columns).map((c, index) => {
      const  { children, ...oProps } = c.props;
      if (children) {
        return tGroup(children,oProps, index);
      } else {
        return tCell(c, index);
      }
    }).filter((c) => c) || [];

    if (!atDialog && defineData) {
      newChildren.conf = defineData
      !isEmpty(defineData) && newChildren.sort((a, b) => {
        const aKey = getFieldKey(a.props);
        const bKey = getFieldKey(b.props);
        return defineData[aKey] && defineData[bKey] && (defineData[aKey].index - defineData[bKey].index) || -1;
      })
    }
    newChildren.tableTitle = dataTitle
    return newChildren
  }

  // 自定义表头
  const DefineColumnsData = useMemo(() => {
    return getColumns(TableChildren, {}).conf
  }, [children, atDialog]);

  return <div>
  <div style={{margin: '10px auto', position: 'relative'}} className={small && 'pcs-table small' || 'pcs-table'} ref={boxRef}>
    {copyHide !== true && <CopyTableDataButton dataSource={dataSource} tableTitle={deepClone(TableColumns.tableTitle, copyConfig)}></CopyTableDataButton>}
    <Loading visible={!!loading} style={{left: '45%', top: '30%', position: 'absolute'}}></Loading>
    <StickyLockTable
      ref={ref}
      primaryKey={tData.some(d => d.id) && 'id' || 'uuid'}
      fixedHeader
      maxBodyHeight={!atDialog ? maxHeight : window.innerHeight - 280}
      dataSource={tData}
      {...attrs}
    >
      {TableColumns}
    </StickyLockTable>
  </div>
  {
      !atDialog && <>
      <div className="table-scroll-box" ref={scrollBarRef}>
        <div ref={scrollRef} style={{height: 20}}></div>
      </div>
      <div className="table-scroll-mark">{bottomTools}</div>
      <div className="table-defined-set">
        <DefineFieldSet
          code={defineFieldCode || location.pathname}
          data={DefineColumnsData}
          onChange={(data) => {
            setDefineConf(data)
            setTableColumns(getColumns(TableChildren, data))
          }}
        ></DefineFieldSet>
      </div>
      </> || null
    }
  </div>
})
AssignProps(ATable, Table)

export default ATable
