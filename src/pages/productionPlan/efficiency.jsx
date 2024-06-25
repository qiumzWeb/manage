import React from 'react';
import { Button, Dialog, Input, Message, Select, Form, Grid, Field } from '@/component'
import QueryList from '@/component/queryList'
import { qSearch, tColumns, getJobNodeOptions } from './config/efficiencyConfig'
import { efficiencyQuery, getEfficiencyExport, getEfficiencyUpload, efficiencyDownTem} from './api'
import ASelect from '@/component/ASelect'
import UploadFile from "./components/uploadFile"
export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      visible: false,
      searchData: ''
    }
    this.field = new Field(this)
  }
  isAdd = () => !!this.field.getValue('isAdd')
  beforeSearch = (data) => {
    const {jobDateRang, ...d} = data.data
    if (!d.warehouseId) {
      return '请选择仓库名称'
    }
    if (d.type === 0) {
      if (!Array.isArray(jobDateRang)) {
        return '请选择日期区间'
      } else {
        d.jobDateStart = jobDateRang[0] && jobDateRang[0].format('YYYY-MM-DD 00:00:00')
        d.jobDateEnd = jobDateRang[1] && jobDateRang[1].format('YYYY-MM-DD 23:59:59')
        if (!d.jobDateStart || !d.jobDateEnd) {
          return '请选择日期区间'
        }
      }
    }
    if (d.type === 1) {
      if (!d.jobDate) {
        return '请选择日期'
      } else {
        d.jobDate = d.jobDate.format('YYYY-MM-DD')
      }
      if (!d.jobTime) {
        d.jobTime = '0-24'
      }
      if (d.jobTime) {
        const time = []
        const rang = d.jobTime.split(',')
        rang.forEach(r => {
          const t = this.getRangTime(r)
          t.forEach(tr => {
            if(!time.includes(tr)) {
              time.push(tr)
            }
          })
        })
        d.jobTimeList = time
      }
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
      getEfficiencyExport(data.data)
    } catch(e) {
      Message.error(e.message)
    }
  }
  render() {
    return (
      <div className="pcsbox">
        {/* 查询列表 */}
        <QueryList
          toolSearch
          initSearch={false}
          searchModel={qSearch}
          columns={tColumns}
          defaultValue="-"
          columnWidth={100}
          formatSearchParams={this.beforeSearch}
          formatData={this.formatData}
          tableOptions={{
            url: efficiencyQuery,
            method: 'post'
          }}
        >
          <span slot="tools">
            {(ql) => {
              const type = ql.field && ql.field.getValue('type')
              return <span>
                {type === 1 ? <Button mr="10" type="secondary" onClick={() => this.setState({uploadFileVisible: true})}>导入</Button> : ''}
                <Button  type="secondary" onClick={() => this.exportData()}>导出</Button>
              </span>
            }}
          </span>
          <div slot="tableCell" prop="make">
            {(val, index, record) => {
              return <div style={{display: 'flex', justifyContent: 'space-around'}}>
                <Button type="link" onClick={() => {
                  this.setState({
                    visible: true
                  })
                  this.field.setValues(record)
                }} text>编辑</Button>
                <Button type="link" onClick={() => this.Delete(record)} text>删除</Button>
              </div>
            }}
          </div>
        </QueryList>
        {/* 修改 */}
        <Dialog
          title={this.isAdd() && '新增' || '修改'}
          style={{width: '400px'}}
          visible={this.state.visible}
          onOk={this.toSave}
          onCancel={this.onCancel}
          onClose={this.onCancel}
        >
          <Form field={this.field} inline={false} >
            <Grid.Row wrap>
              <Grid.Col span="24">
                <Form.Item label="仓库名称" required>
                  <ASelect name="warehouseId" isdetail={!this.isAdd()}></ASelect>
                </Form.Item>
              </Grid.Col>
              <Grid.Col span="24">
                <Form.Item label="作业环节" required>
                  <ASelect name="jobNodeCode" isdetail={!this.isAdd()} getOptions={getJobNodeOptions}></ASelect>
                </Form.Item>
              </Grid.Col>
              <Grid.Col span="24">
                <Form.Item label="标准作业人效值" required>
                  <Input name="planCount" placeholder="请输入"></Input>
                </Form.Item>
              </Grid.Col>
            </Grid.Row>
          </Form>
        </Dialog>
        <UploadFile
          title="导入环节人效"
          data={this.state.searchData}
          visible={this.state.uploadFileVisible}
          onClose={() => this.setState({uploadFileVisible: false})}
          getDownloadTemplate={efficiencyDownTem}
          getUpload={getEfficiencyUpload}
        ></UploadFile>
      </div>
    )
  }
  Delete(record) {
    Dialog.confirm({
      title: '提示',
      content: '确认删除该条数据？',
      onOk: async () => {
        try {
          await toDelete({id: record.id})
          Message.success('删除成功')
        } catch (e) {
          Message.error(e.message)
        }
      }
    })
  }
  toSave = async () => {
    try {
      await toEdit({
        ...this.field.getValues()
      })
      Message.success(this.isAdd() && '新增成功' || '修改成功')
    } catch (e) {
      Message.error(e.message)
    }
    this.onCancel()
  }
  onCancel = () => {
    this.setState({visible: false})
  }
}