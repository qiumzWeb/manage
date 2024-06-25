/**
 * 生产达成管理报表
 */
import React, {createRef} from 'react';
import { Button, Dialog, Input, Message, Select, Form, Grid, Field, Icon } from '@/component'
import QueryList from '@/component/queryList'
import { qSearch, tColumns } from './config/produceConfig'
import { produceSearchApi, getProduceExport, produceSearchSumApi} from './api'
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
    const {planDate, ...d} = data.data
    if (!d.warehouseId) {
      return '请选择仓库名称'
    }
    if (!Array.isArray(planDate)) {
      return '请选择日期区间'
    } else {
      d.jobDateStart = planDate[0] && planDate[0].format('YYYY-MM-DD 00:00:00')
      d.jobDateEnd = planDate[1] && planDate[1].format('YYYY-MM-DD 23:59:59')
      if (!d.jobDateStart || !d.jobDateEnd) {
        return '请选择日期区间'
      }
    }
    if (d.timeScope) {
      const time = []
      const rang = d.timeScope.split(',')
      rang.forEach(r => {
        const t = this.getRangTime(r)
        t.forEach(tr => {
          if(!time.includes(tr)) {
            time.push(tr)
          }
        })
      })
      if (d.timeScope && !time.length) {
        return '请输入有效的时间'
      }
      d.timeScope = time
    } else {
      delete d.timeScope
    }
    this.setState({
      searchData: data.data
    })
    return {
      ...data,
      data: d
    }
  }
  getRangTime(time) {
    const t = []
    const nt = time.replace(/\s/g, '')
    if (/^\d+\-\d+$/.test(nt)) {
      const sp = nt.split('-')
      const min = Math.min(...sp)
      const max = Math.min(Math.max(...sp), 24)
      for(let i = min; i < max; i++){
        // t.push(i + '-' + (i+1))
        t.push(i)
      }
    }
    return t
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
      getProduceExport(data.data).finally(() => {
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
            url: produceSearchApi,
            sumUrl: produceSearchSumApi,
            method: 'post'
          }}
        >
          <span slot="tools">
            <Button mr='10' type="secondary" onClick={() => this.exportData()}>{this.state.exprotLoading && <Icon type="loading"/>} 导出</Button>
          </span>
        </QueryList>
      </div>
    )
  }
}
