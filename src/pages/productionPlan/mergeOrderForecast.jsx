/**
 * 出库段每小时合单预测报表
 */
import React, {createRef} from 'react';
import { Button, Dialog, Input, Message, Select, Form, Grid, Field, Icon } from '@/component'
import QueryList from '@/component/queryList'
import { qSearch, tColumns } from './config/mergeOrderForecastConfig'
import { outStockSearchApi, getOutStockExport } from './api'
export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      visible: false,
      uploadFileVisible: false,
      searchData: '',
      exprotLoading: false
    }
    this.field = new Field(this)
    this.queryList = createRef()
  }
  beforeSearch = (data) => {
    const d = {...data.data}
    if (!d.warehouseId) {
      return '请选择仓库名称'
    }
    if (!d.jobDate) {
      return '请选择日期'
    }
    d.jobDate = d.jobDate.format && d.jobDate.format('YYYY-MM-DD') || d.jobDate
    !d.nowDate && (d.nowDate = new Date().toLocaleDateString().replace(/\//g, '-'))
    !d.nowTime && (d.nowTime = this.getTimeHours())
    this.setState({
      searchData: d
    })
    return {
      ...data,
      data: d
    }
  }
  getTimeHours = () => {
    let hour = new Date().getHours()
    return hour + '-' + (hour + 1)
  }
  formatData = (data) => {
    // data.data = data.ProductionPlanVO
  }
  // 导出
  exportData = () => {
    try {
      if (!this.state.searchData) {
        return Message.error('请先查询数据，再执行导出')
      }
      const data = this.beforeSearch({data: this.state.searchData})
      if (typeof data === 'string') {
        Message.error(data)
        return
      }
      if (this.state.exprotLoading) return
      this.setState({
        exprotLoading: true
      })
      getOutStockExport(data.data).finally(() => {
        this.setState({
          exprotLoading: false
        })
      })
    } catch(e) {
      Message.error(e.message)
      this.setState({
        exprotLoading: false
      })
    }
  }
  render() {
    return (
      <div className="pcsbox">
        {/* 查询列表 */}
        <QueryList
          ref={(ref) => {
            this.queryList = ref
          }}
          toolSearch
          initSearch={false}
          searchModel={qSearch}
          columns={tColumns}
          defaultValue="-"
          columnWidth={100}
          formatSearchParams={this.beforeSearch}
          formatData={this.formatData}
          tableOptions={{
            url: outStockSearchApi,
            method: 'post'
          }}
        >
          <div style={{display: 'flex'}} slot="tools">
            <Button type="secondary" onClick={() => this.exportData()}>{this.state.exprotLoading && <Icon type="loading"/>} 导出</Button>
          </div>
        </QueryList>
      </div>
    )
  }
}
