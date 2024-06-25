import React from 'react';
import { Table } from '@/component';
import {getUuid, isObj, isEmpty, isTrue} from 'assets/js';
import { getTipsLabel } from '@/report/utils'

class FormTable extends React.Component {
  constructor(props) {
    super(props)
  }
  getChildren() {
    if (!this.props.children) return []
    return Array.isArray(this.props.children) ? this.props.children.flat() : [this.props.children]
  }
  // 初始化
  componentDidMount() {
    if (typeof this.props.afterMounted === 'function') {
      this.props.afterMounted(this)
    }
  }
  // 格式化表头数据
  getColumns(columns, showIndex) {
    const No = {
      width: 80,
      title: '序号',
      dataIndex: 'index',
    }
    const tc = []
    const slotScope = this.getChildren().filter(c => c && c.props && c.props.slot === 'tableCell')
    slotScope.forEach(s => {
      const prop = s.props.prop
      if (!(prop in columns)) {
        columns[prop] = {}
      }
      columns[prop].cell = (...args) => {
        const child = s.props.children
        return typeof child === 'function' ? child(...args) : child
      }
    })
    if (Object.values(columns).some(c => c.lock)) {
      No.lock = 'left'
    }
    // 列渲染
    const tCell = (c) => {
      // 全局设置column width
      const conlumnProps = {}
      if (this.props.columnWidth && !c.width) {
        conlumnProps.width = this.props.columnWidth
      }
      // 全局添加默认值
      if (this.props.defaultValue && !c.cell) {
        conlumnProps.cell = (val) => isTrue(val) ? val : this.props.defaultValue
      }
      // 全局添加tips
      if (c.tips && c.title) {
        conlumnProps.title = getTipsLabel(c.title, c.tips)
      }
      return <Table.Column key={getUuid()} { ...c } {...conlumnProps}></Table.Column>
    }
    // 多表头群组渲染
    const tGroup = (child, tGroupProps) => {
      return <Table.ColumnGroup {...tGroupProps} key={getUuid()}>
        {this.getColumns(child)}
      </Table.ColumnGroup>
    }
    if (this.props.showIndex !== false && showIndex) tc.push(tCell(No))
    Object.entries(columns).forEach(([key, val]) => {
      const show = typeof val.show === 'function' ? val.show(this) : (val.show !== false)
      const {children, ...attrs} = val
      if (show) {
        tc.push(isObj(children) ? tGroup(children, {...attrs, index: key})  : tCell({
          ...attrs,
          dataIndex: key
        }))
      }
    })
    return tc
  }
  render() {
    const columns = this.getColumns(this.props.columns || {}, true)
    const data = Array.isArray(this.props.value) && this.props.value || []
    data.forEach((d, i) => d.index = i+1)
    return <div className="pcs-form-Table" style={this.props.style}>
      <Table
        className="formTable"
        dataSource={data}
        {...(this.props.tableOptions || {})}
      >
        {columns}
      </Table>
    </div>
  }
}

export default FormTable
