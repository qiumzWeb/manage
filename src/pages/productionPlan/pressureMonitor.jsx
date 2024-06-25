/**
 * 仓内各环节待生产进度压力监控
 */
import React, {createRef} from 'react';
import { Button, Dialog, Input, Message, Select, Form, Grid, Field, Icon } from '@/component'
import QueryList from '@/component/queryList'
import { qSearch, tColumns } from './config/pressureMonitorConfig'
import { pressureMonitorDownTem, pressureMonitorSearch, getPressureMonitorExport, getPressureMonitorUpload} from './api'
import UploadFile from "./components/uploadFile"
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
    if (!d.jobDate) {
      return '请选择日期'
    }
    d.jobDate = d.jobDate.format && d.jobDate.format('YYYY-MM-DD') || d.jobDate
    this.setState({
      searchData: data.data
    })
    return {
      ...data,
      data: d
    }
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
      getPressureMonitorExport(data.data).finally(() => {
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
            url: pressureMonitorSearch,
            method: 'post'
          }}
        >
          <div style={{display: 'flex'}} slot="tools">
            <Button mr="10" type="secondary" onClick={() => this.setState({uploadFileVisible: true})}>导入</Button>
            <Button type="secondary" onClick={() => this.exportData()}>{this.state.exprotLoading && <Icon type="loading"/>} 导出</Button>
          </div>
        </QueryList>
        <UploadFile
          data={this.state.searchData}
          visible={this.state.uploadFileVisible}
          onClose={() => this.setState({uploadFileVisible: false})}
          getDownloadTemplate={pressureMonitorDownTem}
          getUpload={getPressureMonitorUpload}
        ></UploadFile>
      </div>
    )
  }
}