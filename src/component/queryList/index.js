import React, {useMemo} from 'react';
import { Form, Input, Button, Table, Pagination, Loading, Grid, Field, Message, FormCollapse } from '@/component';
import $http from 'assets/js/ajax';
import {getUuid, isObj, isEmpty, isTrue, sumDataCode, getObjType, getResult} from 'assets/js';
import { getTipsLabel, getRangTime } from '@/report/utils'
const FormItem = Form.Item;
const { Row, Col } = Grid;
class QueryList extends React.Component {
  constructor(props) {
    super(props)
    this.defaultParams = props.defaultParams || {}
    this.defaultTableData = props.defaultTableData
    this.qSearch = Array.isArray(props.searchModel) ? props.searchModel : (props.searchModel && [props.searchModel] || [])
    this.tableOptions = props.tableOptions || {}
    this.searchParams = null
    this.dataFormats = {}
    this.lastSearchParams = ''
    this.expandData = {}
    this.field = new Field(this, {values: this.defaultParams})
    this.qSearch.forEach(qs => {
      Object.entries(qs).forEach(([key, v]) => {
        if (v.hasOwnProperty('defaultValue') && isEmpty(this.defaultParams[key])) {
          getResult(v.defaultValue, this).then(dv => {
            if (!this.field.getValue(key)) {
              this.defaultParams[key] = dv;
              this.field.setValue(key, dv)
            }
          })
          
        }
        // 扩展字段标记，需要将查询条件参数字段添加到 请求列表listData中
        if (v.needExpandToData) {
          this.expandData[key] = key
        }
        // 时间区间参数处理
        if (Array.isArray(v.transTimeCode)) {
          const [start, end] = v.transTimeCode;
          this.dataFormats[key] = (data) => {
            return getRangTime(data, {time: key, start, end, fmt: v.format})
          }
        }
        // 其它参数处理
        if(typeof v.format === 'function') {
          this.dataFormats[key] = (data) => {
            const value = v.format(data[key], data)
            // 如果数据是个对象, 需要将一个字段扩展成多个字段
            if (getObjType(value) === 'Object' && v.useDetailValue) {
              return value
            }
            return {
              [key]:  value
            }
          }
        }
      })
    })
    
    this.state = {
      loading: false,
      tableData: this.defaultTableData || [],
      sumDataSource: [],
      DefineSearchComponent: null,
      pageConfig: {
        current: 1,
        pageSize: this.props.smallPageSize ? 10 : window._pageSize_,
        total: 0,
        pageSizeList: [20]
      }
    }
    this.querySearchAction = 0
    this.columns = this.getColumns(this.props.columns || {}, true)
  }
  getChildren() {
    if (!this.props.children) return []
    return Array.isArray(this.props.children) ? this.props.children.flat() : [this.props.children]
  }
  // 初始化
  componentDidMount() {
    setTimeout(() => {
      if (typeof this.props.afterMounted === 'function') {
        this.props.afterMounted(this)
      }
      if (this.props.initSearch) {
        this.PageChange(1, {action: 1})
      }
    }, 500)
  }
  // 分页
  PageChange = (current, {action = 3, callback = () => {}}) => {
    this.querySearchAction = action
    this.setState({
      pageConfig: {
        ...this.state.pageConfig,
        current
      }
    })
    this.onSearch(current, action).then(callback)
  }
  onPageSizeChange = (pageSize) => {
    const action = 4
    this.querySearchAction = action
    this.setState({
      pageConfig: {
        ...this.state.pageConfig,
        pageSize,
        current: 1
      }
    }, () => {
      this.onSearch(undefined, action)
    })
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
      if ((prop in columns)) {
        columns[prop].cell = (...args) => {
          const child = s.props.children
          return typeof child === 'function' ? child(...args) : child
        }
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
      // 针对 字符串 title 换行转换
      if (typeof c.title === 'string' && c.title.includes('\n')) {
        c.title = <span style={{lineHeight: '120%'}}>{c.title.split('\n').map(t => <div>{t}</div>)}</span>
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
  /**
   * 获取查询参数
   */
  getSearchParams(pageNum = 1, action = 5) {
    const data = this.field.getValues()
    const params = {};
    // 处理参数
    Object.keys(data).forEach(key => {
      // 更新拓展数据
      if (this.expandData.hasOwnProperty(key)) {
        this.expandData[key] = data[key]
      }
      if (typeof this.dataFormats[key] === 'function') {
        // 对参数进行格式化
        const fData = this.dataFormats[key](data)
        Object.assign(params, fData)
        // 拓展参数使用格式化后的字段覆盖
        if (this.expandData.hasOwnProperty(key)) {
          Object.assign(this.expandData, fData)
        }
      }
    })
    const searchData = {
      pageNum: pageNum || this.state.pageConfig.current,
      pageSize: this.state.pageConfig.pageSize,
      ...data,
      ...params
    }

    let searchParams = {
      url: typeof this.tableOptions.url === 'function' ? this.tableOptions.url(searchData) : this.tableOptions.url,
      type: this.tableOptions.method || 'post',
      filterEmptyParams: true,
      data: searchData
    }
    if (typeof this.props.formatSearchParams === 'function') {
      searchParams = this.props.formatSearchParams(searchParams, action, this) || searchParams;
    }
    if (typeof searchParams === 'string') {
      return searchParams
    }
    return searchParams
  }
  // 数据查询拦截
  async searchInterceptor(searchParams, action, paramsChange) {
    let res = null
    if (typeof searchParams === 'string') {
      Message.warning(searchParams)
      return res;
    }
    // 接口请求
    let resData = await $http(searchParams)
    // 检测查询参数是否变动
    const currentParamsJson = JSON.stringify(searchParams.data)
    if (currentParamsJson != this.lastSearchParams) {
      this.lastSearchParams = currentParamsJson
      if (typeof paramsChange === 'function') {
        paramsChange(searchParams, this.searchParams)
      }
    }
    this.searchParams = searchParams
    if (resData) {
      if (Array.isArray(resData)) {
        resData = resData.filter(d => d)
      }
      if (typeof this.props.formatData === 'function') {
        let fmd = await getResult(this.props.formatData, resData, this.searchParams, this.getResDataFormat.bind(this), action);
        resData = fmd || resData
      }
      if (typeof resData === 'string') {
        Message.warning(resData)
        return res
      }
      res = resData
    }

    return res;
  }
 /**
  * 查询
  * @param {Number} pageNum 页码
  * @param {Number} action 行为 1：查询，2：刷新， 3： 分页， 4：分页尺寸, 5: 其它, 6: 汇总
  * @returns 
  */
  async onSearch(pageNum, action) {
    this.setState({
      loading: true
    })
    try {
      let sumSearch = null;
      if (this.tableOptions.sumUrl) {
        // 查询列表的同时异步计算汇总数据， 不阻塞列表数据查询
        sumSearch = this.getSumSearch(true);
      }

      // 请求拦截
      let res = await this.searchInterceptor(this.getSearchParams(pageNum, action), action)

      if (res) {
        // 数据渲染
        let resdata = Array.isArray(res.data) ? res.data : []
        resdata.forEach((r, i) => {
          // 如果响应数据没有对应字段，将格式化后的查询参数 回填给响应数据
          Object.entries(this.expandData).forEach(([key, val]) => {
            if (isEmpty(r[key]) && !isEmpty(val)) {
              r[key] = val
            }
          })
          r.uuid = getUuid()
          r.index = this.props.pagination === false ? i + 1 : (Math.max(res.currentPageNum - 1, 0) * res.pageSize + i + 1)
        })
        // 总是在 查询结束后 再渲染汇总数据
        sumSearch && sumSearch.then(data => {
          this.setState({
            tableData: resdata,
            sumDataSource: data,
          })
        });
        this.setState({
          tableData: resdata,
          sumDataSource: [],
          pageConfig: {
            ...this.state.pageConfig,
            current: res.currentPageNum || 1,
            total: res.totalRowCount || 0,
            pageSize: res.pageSize || window._pageSize_
          }
        })
      }
    } catch (e) {
      Message.error(e.message)
    } finally {
      this.setState({
        loading: false
      })
    }
  }
  /**
   * 表数据求和
   */
  async getSumSearch(autoSearch) {
    try {
      const searchParams = this.getSearchParams(1, 6)
      if (getObjType(searchParams) === 'Object') {
        Object.assign(searchParams, {
          url: typeof this.tableOptions.sumUrl === 'function' ? this.tableOptions.sumUrl(searchParams.data) : this.tableOptions.sumUrl,
          method: this.tableOptions.method || 'post'
        })
      }
      let res = await this.searchInterceptor(searchParams, 6)
      if (res) {
        // 数据渲染
        let resdata = Array.isArray(res) && !isEmpty(res) ? res : getObjType(res) === 'Object' ? [res] : []
        resdata.forEach((r, i) => {
          Object.entries(this.expandData).forEach(([key, val]) => {
            if (isEmpty(r[key]) && !isEmpty(val)) {
              r[key] = val
            }
          })
          r.uuid = getUuid()
          r.index = this.tableOptions.indexName || '汇总'
          r[sumDataCode] = true
        })
        if (autoSearch) return resdata;
        this.setState({
          sumDataSource: resdata
        })
      }
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 返回数据格式化
  getResDataFormat(data, {current, total, pageSize} = {}) {
    return {
      currentPageNum: current || 1,
      totalRowCount: total || (data && data.length || 0),
      pageSize: pageSize || this.state.pageConfig.pageSize || window._pageSize_,
      data
    }
  }
  // 刷新
  refresh(data, callback) {
    if (typeof data === 'object') {
      this.field.setValues(data)
    }
    this.PageChange(1, {action: 2, callback})
  }
  shouldComponentUpdate(){
    // 刷新时不更新表头
    if (![2,3,4].includes(this.querySearchAction)) {
      this.columns = this.getColumns(this.props.columns || {}, true)
    }
    this.querySearchAction = 0
    return true
  }
  render() {
    const tableTools = this.getChildren().filter(c => c && c.props && c.props.slot === 'tools')
    const tableRightTools = this.getChildren().filter(c => c && c.props && c.props.slot === 'rightTools')
    const expandSlotScope = this.getChildren().filter(c => c && c.props && c.props.slot === 'expand')
    const searchButtonRender = <Button type="primary" onClick={() => this.PageChange(1, {action: 1})}>{this.props.searchBtnText || '查询'}</Button>
    const tableAttrs = this.props.tableOptions && this.props.tableOptions.attrs || {}
    return <div className="pcs-query-list" style={this.props.style}>
    <FormCollapse show={this.props.showFormCollapse}>
      <Form field={this.field}
        defineSearch={
          this.props.showDefineSearch !== false &&
          this.props.toolSearch !== false &&
          !isEmpty(this.qSearch)
        }
        getDefineComponent={(component) => this.setState({DefineSearchComponent: component})}
        code={this.props.defineSearchCode || tableAttrs.defineFieldCode}
      >
        {
          Array.isArray(this.qSearch) && this.qSearch.map((q, index) => {
            return <Row gutter="12" key={index} wrap>
              {
                Object.entries(q).map(([key, val], cIndex) => {
                  if (key === 'sbtn') {
                    return this.props.toolSearch == false && <Col outsider span="4"  key={cIndex}>
                      <FormItem>{searchButtonRender}</FormItem>
                    </Col>
                  }
                  const Component = val.component || Input
                  const formValues = this.field.getValues();
                  const show = typeof val.show === 'function' ? val.show(this.field.getValues()) : (val.show !== false)
                  
                  // 隐藏时,如果有值 刚缓存起来
                  if (!show && formValues[key] !== undefined) {
                    val.cacheValue = formValues[key]
                  }
                  // 若有默认值 ,回填 默认值 
                  if (show && formValues[key] === undefined) {
                    if (val.cacheValue !== undefined) {
                      this.field.setValue(key, val.cacheValue)
                    } else if (val.hasOwnProperty('defaultValue')) {
                      getResult(val.defaultValue, this).then(dv => {
                        if (!this.field.getValue(key)) {
                          this.field.setValue(key, dv)
                        }
                      })
                    }
                  }
                  const disabled = typeof val.disabled === 'function' ? val.disabled(this.field.getValues()) : !!val.disabled
                  let colAttrs = {
                    fixedSpan: 12
                  }
                  val.span && (colAttrs= { span: val.span })
                  val.fixedSpan && (colAttrs = { fixedSpan: val.fixedSpan })
                  {/* 扩展属性 */}
                  let extendAttrs = {
                    onEnter: val.onEnter ? () => this.PageChange(1, {action: 1}) : undefined
                  }

                  const cell = <Col {...colAttrs} key={key} show={val.isExpand !== true} required={!!val.required} outsider={key === 'sbtn' || val.outsider}>
                    <FormItem label={val.label} {...(val.formItem || {})}>
                      <Component disabled={disabled} {...(val.attrs || {})} name={key} style={{width: '100%'}} onChange={(value, ...args) => {
                        if(val.attrs && typeof val.attrs.onChange === 'function') {
                          val.attrs.onChange(value, this, ...args)
                        }
                      }} field={this.field}
                      {...extendAttrs}
                      ></Component>
                    </FormItem>
                  </Col>
                  return show ? cell : ''
                })
              }
            </Row>
          })
        }
      </Form>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      {/* 左侧按钮工具栏 */}
        <div>
          {tableTools.map((c, index) => {
            const child = c.props.children
            return <span key={index}>
            {typeof child === 'function' ? child(this) : child}
            </span>
          })}
          {this.tableOptions.sumUrl && <Button s onClick={() => this.getSumSearch()}>{this.tableOptions.sumButtonText || '计算汇总'}</Button>}
          {this.props.toolSearch !==false ? <span
            style={{
              marginRight: 10,
              marginLeft: isEmpty(tableTools) && !this.tableOptions.sumUrl ? 0 : 10
            }}
          >{searchButtonRender}</span> : ''}
          {this.state.DefineSearchComponent}
        </div>
        {/* 右侧按钮工具栏 */}
        <div>
          {tableRightTools.map((c, index) => {
            const child = c.props.children
            return <span key={index}>
            {typeof child === 'function' ? child(this) : child}
            </span>
          })}
        </div>
      </div>
      </FormCollapse>
      {expandSlotScope}
      <Table
        loading={this.state.loading}
        className="queryListTable"
        dataSource={this.state.tableData}
        bottomTools={this.props.bottomTools}
        sumDataSource={this.state.sumDataSource}
        {...tableAttrs}
      >
        {this.columns}
      </Table>
      {this.props.pagination !== false && <Pagination
        onChange={this.PageChange}
        inset={this.props.pagination}
        onPageSizeChange={this.onPageSizeChange}
        pageSizeList={this.state.pageConfig.pageSizeList}
        pageSize={this.state.pageConfig.pageSize}
        current={this.state.pageConfig.current}
        isOld={this.props.smallPageSize}
        total={this.state.pageConfig.total}
      ></Pagination>|| null}
    </div>
  }
}

export default QueryList
