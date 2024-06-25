import React, {createRef} from 'react';
import QueryList from '@/component/queryList'
import AForm from '@/component/AForm'
import { tColumns, listColumns, addConfig } from './config/indexConfig'
import { Button, Dialog, Input, Message, Select, Form, Grid, Field, Icon, Table } from '@/component'
import { searchApi, listSearch, addContainer} from './api'
import { getStepBaseData, setStepBaseData, saveStepNode, InitDefaultData } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      visible: false,
      uploadFileVisible: false,
      searchData: '',
      exprotLoading: false,
      selectRow: [],
      addVisible: false,
      addLoading: false,
      detailData: {
        warehouseId: getStepBaseData().warehouseId,
        warehouseName: getStepBaseData().warehouseName
      }
    }
    this.queryList = createRef()
    this.listSearch = createRef()
    this.selectRecord = ''
    this.addRef = createRef()
  }
  beforeSearch = (req) => {
    this.setState({
      searchData: {
        warehouseId: getStepBaseData().warehouseId
      }
    })
    return {
      ...req,
      data: {
        ...req.data,
        warehouseId: getStepBaseData().warehouseId
      }
    }
  }

  formatData = (data) => {
    // data.data = data.ProductionPlanVO
  }
  // 新增容器
  add = () => {
    this.setState({addVisible: true})
  }
  refresh() {
    console.log('被激活了====')
    this.queryList.refresh()
  }
  addOnOk = async () => {
    const result = await this.addRef.validate()
    if (!result) return
    this.setState({addLoading: true})
    const data = this.addRef.getData()
    await addContainer(data)
    this.setState({
      addLoading: false,
    })
    this.addClose()
    this.queryList.refresh()
  }
  addClose = () => {
    this.setState({addVisible: false})
  }
  render() {
    return (
      <div>
        {/* 查询列表 */}
        <QueryList
          ref={(ref) => {
            this.queryList = ref
          }}
          toolSearch
          defaultParams={{
            warehouseName: getStepBaseData().warehouseName,
            warehouseId: getStepBaseData().warehouseId
          }}
          showDefineSearch={false}
          initSearch={true}
          pagination={true}
          columns={tColumns}
          defaultValue="-"
          columnWidth={150}
          formatSearchParams={this.beforeSearch}
          formatData={this.formatData}
          tableOptions={{
            url: searchApi,
            method: 'post',
            attrs: {
              inset: true,
            }
          }}
        >
          { !getStepBaseData().readOnly && <div style={{display: 'flex'}} slot="tools">
            <Button onClick={() => this.add()}>新增容器</Button>
          </div>}
          <div slot="tableCell" prop="counts">
            {(val, index, record) => {
              return <Button type="primary" text onClick={() => {
                this.setState({visible: true})
                this.selectRecord = record
              }}>查看</Button>
            }}
          </div>
        </QueryList>
        {/* 修改 */}
        <Dialog
          title="单据清单"
          style={{width: '500px'}}
          visible={this.state.visible}
          onCancel={this.onCancel}
          onClose={this.onCancel}
          footer={false}
        >
        <QueryList
          ref={(ref) => {
            this.listSearch = ref
          }}
          initSearch
          pagination={false}
          columns={listColumns}
          formatSearchParams={(req) => {
            return {
              ...req,
              data: {
                ...this.selectRecord
              }
            }
          }}
          formatData={(data) => {
            return {
              data
            }
          }}
          tableOptions={{
            url: listSearch,
            method: 'post',
          }}
        >
        </QueryList>
        </Dialog>
        {/* 新增 */}
        <Dialog
          title="新增"
          style={{width: '800px'}}
          visible={this.state.addVisible}
          onCancel={this.addClose}
          onClose={this.addClose}
          okProps={{loading: this.state.addLoading}}
          onOk={this.addOnOk}
        >
          <AForm ref={ref => this.addRef = ref} data={this.state.detailData} formModel={addConfig}></AForm>
        </Dialog>
      </div>
    )
  }
  onCancel = () => {
    this.setState({visible: false})
  }
}
export default  Index