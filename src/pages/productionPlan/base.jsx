import React from 'react';
import { Message, DialogButton } from '@/component'
import QueryList from '@/component/queryList'
import { tColumns, qSearch, tDays, formModel } from './config/baseConfig'
import cookie from 'assets/js/cookie';
import { ruleApi, toAddRule, toDeleteRule, toEditRule } from './api'
import moment from 'moment'
import { getWid } from 'assets/js'
export default class Plan extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      loading: false,
      data: {},
      visible: false,
      detailVisible: false,
      details: '',
      searchData: ''
    }
    this.queryList = {}

  }
  beforeSearch = (req) => {
    if (!req.data.warehouseId) {
      return '请选择仓库'
    }
    if (req.data.ruleType !== 0 && !req.data.ruleType) return '请选择规则类型'
    this.setState({
      searchData: req.data
    })
  }
  render() {
    return (
      <div className="pcsbox">
        <QueryList
          toolSearch
          initSearch={false}
          ref={(el) => { this.queryList = el}}
          // 查询配置
          searchModel={qSearch}
          // 表头配置
          columns={tColumns}
          defaultValue="-"
          columnWidth={100}
          // 格式化查询参数
          formatSearchParams={this.beforeSearch}
          // 格式化接口数据
          formatData={(data) => {}}
          // 配置
          tableOptions={{
            url: ruleApi,
            method: 'post'
          }}
        >
          <span slot="tools">
            <DialogButton
              title="新增"
              config={formModel}
              DialogWidth={700}
              data={{
                isAdd: true
              }}
              onSubmit={this.toAdd}
            ></DialogButton>
          </span>
          <div slot="tableCell" prop="make">
            {
              (val, index, record) =>
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                  <DialogButton
                    title="修改"
                    config={formModel}
                    DialogWidth={700}
                    beforeShow={({data}) => {
                      if (data.ruleType === 4 && data.ruleValue) {
                        data.ruleValue = moment('2021-11-11 ' + record.ruleValue + ":00")
                      }
                    }}
                    data={record}
                    onSubmit={this.toModify}
                    btnProps={{type: 'link', text: true}}
                  ></DialogButton>
                  <DialogButton
                    title="删除"
                    confirmMsg="确认删除该条数据？"
                    data={record}
                    onSubmit={this.Delete}
                    refresh={() => this.queryList.refresh()}
                    btnProps={{type: 'link', text: true}}
                  ></DialogButton>
                </div>
            }
          </div>
        </QueryList>
      </div>
    )
  }
  Delete = async (record)  => {
    try{
      await toDeleteRule({
        id: record.id
      })
      Message.success('删除成功')
    } catch (e) {
      return e.message || e
    }
  }
  toAdd = async (data) => {
    if (data.ruleType === 4) {
      data.ruleValue && (data.ruleValue = data.ruleValue.format('HH:mm'))
    }
    if (this.checkData(data)) return false
    try {
      await toAddRule(data)
      Message.success('新增成功')
      this.queryList.refresh({
        warehouseId: data.warehouseId,
        ruleType: data.ruleType
      })
    } catch (e) {
      return e.message || e
    }
  }
  toModify = async (formData, orgData) => {
    const data = {
      ...orgData,
      ...formData
    }
    if (data.ruleType === 4) {
      data.ruleValue && (data.ruleValue = data.ruleValue.format('HH:mm'))
    }
    if (this.checkData(data)) return false
    try {
      await toEditRule(data)
      Message.success('修改成功')
      this.queryList.refresh({
        warehouseId: data.warehouseId,
        ruleType: data.ruleType
      })
    } catch (e) {
      return e.message || e
    }
  }
  checkData(data) {
    if (this.isEmpty(data.warehouseId)) {
      Message.warning('仓库名称必填')
      return true
    }
    if (data.ruleType < 2) {
      if (this.isEmpty(data.ruleValue)) {
        Message.warning('到仓量占比发货必填')
        return true
      }
    }
    if (data.ruleType === 2) {
      // if (this.isEmpty(data.ruleValue)) {
      //   Message.warning('标准作业人效值必填')
      //   return true
      // }
      if (
        (this.isEmpty(data.ruleSonValue) && !this.isEmpty(data.ruleMomValue)) ||
        (!this.isEmpty(data.ruleSonValue) && this.isEmpty(data.ruleMomValue))
      ) {
        Message.warning('招聘人数缺口之环节需求人数比率格式错误')
        return true
      }
    }
    return false
  }
  isEmpty(val) {
    return val === undefined || val === null || val === ''
  }
}
