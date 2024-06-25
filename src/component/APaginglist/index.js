import React from 'react';
import { Pagination, Loading, Message } from '@/component';
import $http from 'assets/js/ajax';
import {getUuid, isObj, isEmpty, isTrue} from 'assets/js';
class PagingList extends React.Component {
  constructor(props) {
    super(props)
    this.options = props.options || {}
    this.searchParams = null
    this.searchData = {}
    this.state = {
      loading: false,
      dataSource: [],
      pageConfig: {
        current: 1,
        pageSize: window._pageSize_,
        total: 0,
        pageSizeList: [20]
      }
    }
  }
  // 初始化
  componentDidMount() {
    if (typeof this.props.afterMounted === 'function') {
      this.props.afterMounted(this)
    }
    if (this.props.initSearch) {
      this.PageChange(1)
    }
  }
  // 分页
  PageChange = (current) => {
    this.setState({
      pageConfig: {
        ...this.state.pageConfig,
        current
      }
    })
    this.onSearch(current, 3)
  }
  onPageSizeChange = (pageSize) => {
    this.setState({
      pageConfig: {
        ...this.state.pageConfig,
        pageSize,
        current: 1
      }
    }, () => {
      this.onSearch(1, 4)
    })
  }
 /**
  * 查询
  * @param {Number} pageNum 页码
  * @param {Number} action 行为 1：查询，2：刷新， 3： 分页， 4：分页尺寸, 5: 其它, 6: 汇总
  * @returns 
  */
  async onSearch(pageNum, action = 1) {
    this.setState({
      loading: true
    })
    try {
      let searchParams = {
        url: this.options.url,
        type: this.options.method || 'post',
        data: {
          pageNum: pageNum || this.state.pageConfig.current,
          pageSize: this.state.pageConfig.pageSize,
          ...this.searchData
        }
      }
      if (typeof this.props.formatSearchParams === 'function') {
        searchParams = this.props.formatSearchParams(searchParams, {action}) || searchParams;
      }
      if (typeof searchParams === 'string') {
        Message.error(searchParams)
        return
      }
      this.searchParams = searchParams
      let res = null
      if (this.props.mockData) {
        res = this.props.mockData
      } else {
        res = await $http(searchParams)
      }
      if (res) {
        if (typeof this.props.formatData === 'function') {
          res = this.props.formatData(res, searchParams, {action}) || res
        }
        if (typeof res === 'string') {
          Message.error(res)
          return
        }
        let resdata = res.data || []
        resdata.forEach((r, i) => {
          r.uuid = getUuid()
          r.index = this.props.pagination === false ? i + 1 : ((res.currentPageNum - 1) * res.pageSize + i + 1)
        })
        this.setState({
          dataSource: resdata,
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
  // 刷新
  refresh(data) {
    this.searchData = data
    this.PageChange(1, 3)
  }
  
  render() {
    const Component = this.props.component
    const attrs = this.props.attrs || {}
    const dataKey = this.props.dataSourceKey || 'dataSource'
    const defineDataProps = {
      [dataKey]: this.state.dataSource
    }
    return <div className="pcs-paging-list" style={{position: 'relative', ...(this.props.style || {})}}>
      <Loading visible={this.state.loading} style={{left: '45%', top: '30%', position: 'absolute'}}></Loading>
      <div style={{minHeight: this.props.minHeight || 300, border: this.props.hasBorder !== false ? '1px solid #eee' : 'none', marginBottom: 5}}>
        {Component && <Component {...attrs} {...defineDataProps} ></Component>}
      </div>
      {this.props.pagination !== false && <Pagination
        onChange={this.PageChange}
        inset={this.props.pagination}
        sizeLocked
        onPageSizeChange={this.onPageSizeChange}
        pageSizeList={this.state.pageConfig.pageSizeList}
        pageSize={this.state.pageConfig.pageSize}
        current={this.state.pageConfig.current}
        total={this.state.pageConfig.total}
      ></Pagination>|| null}
    </div>
  }
}

export default PagingList
