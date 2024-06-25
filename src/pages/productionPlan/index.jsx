import React, { createRef } from 'react';
import { Button, Dialog, Message, Icon, DialogButton } from '@/component';
import QueryList from '@/component/queryList';
import { qSearch, tColumns, modifyFormModel } from './config/indexConfig';
import { searchApi, toDelete, toEdit, getExport, getDownloadTemplate, getUpload} from './api';
import UploadFile from "./components/uploadFile";
import { isEmpty } from 'assets/js';
export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      visible: false,
      uploadFileVisible: false,
      searchData: '',
      exprotLoading: false,
      defaultParams: props.location.state || {}
    }
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
      d.planDateStart = planDate[0] && planDate[0].format('YYYY-MM-DD 00:00:00')
      d.planDateEnd = planDate[1] && planDate[1].format('YYYY-MM-DD 23:59:59')
      if (!d.planDateStart || !d.planDateEnd) {
        return '请选择日期区间'
      }
    }
    if (d.planTimeList) {
      const time = []
      const rang = d.planTimeList.split(',')
      rang.forEach(r => {
        const t = this.getRangTime(r)
        t.forEach(tr => {
          if(!time.includes(tr)) {
            time.push(tr)
          }
        })
      })
      if (d.planTimeList && !time.length) {
        return '请输入有效的时间'
      }
      d.planTimeList = time
    } else {
      delete d.planTimeList
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
        t.push(i + '-' + (i+1))
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
      getExport(data.data).finally(() => {
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
          defaultParams={this.state.defaultParams}
          initSearch={!isEmpty(this.state.defaultParams)}
          searchModel={qSearch}
          columns={tColumns}
          columnWidth={100}
          defaultValue='-'
          formatSearchParams={this.beforeSearch}
          formatData={this.formatData}
          tableOptions={{
            url: searchApi,
            method: 'post'
          }}
        >
          <span slot="tools">
            <Button mr="10"  type="secondary" onClick={() => this.setState({uploadFileVisible: true})}>导入</Button>
            <Button  type="secondary" onClick={() => this.exportData()}>{this.state.exprotLoading && <Icon type="loading"/>} 导出</Button>
          </span>
          <div slot="tableCell" prop="make">
            {(val, index, record) => {
              return <div>
                <DialogButton
                  title="编辑"
                  DialogWidth={750}
                  config={modifyFormModel}
                  data={record}
                  onSubmit={this.toModify}
                  refresh={() => this.queryList.refresh()}
                  btnProps={{type: 'link', text: true, mr: 10}}
                ></DialogButton>
                <DialogButton
                  title="删除"
                  data={record}
                  confirmMsg="确认删除该条数据？"
                  onSubmit={this.Delete}
                  refresh={() => this.queryList.refresh()}
                  btnProps={{type: 'link', text: true}}
                ></DialogButton>
              </div>
            }}
          </div>
        </QueryList>
        <UploadFile
          data={this.state.searchData}
          visible={this.state.uploadFileVisible}
          onClose={() => this.setState({uploadFileVisible: false})}
          getDownloadTemplate={getDownloadTemplate}
          getUpload={getUpload}
        ></UploadFile>
      </div>
    )
  }
  Delete = async (record) => {
    try {
      await toDelete({id: record.id})
      Message.success('删除成功')
    } catch (e) {
      return e.message
    }
  }
  toModify = async (data, orgData) => {
    try {
      await toEdit({
        ...orgData,
        ...data
      })
      Message.success('修改成功')
    } catch (e) {
      return e.message
    }
  }
}