import React from 'react';
import QueryList from '@/component/queryList'
import { qSearch, tColumns, batchImportModel, getImportRules, getUpdateRuleToUCS, flashSowOptions } from './config/planConfig'
import { Button, Dialog, Message, DialogButton } from '@/component'
import $http from 'assets/js/ajax';
import PlanDetail from './rulesModify'
import './common.scss';
class Plan extends React.Component {
  constructor(props) {
    super(props)
    this.queryList = {}
    this.qForm = {}
    this.planDetail = {}
  }
  // 格式化查询参数
  formatSearchParams = (req) => {
    return {
      ...req,
      url: req.url.replace('${warehouseId}', req.data.warehouseId)
    }
  }
  // 格式化渲染数据
  formatData = (res) => {
    return {
      ...res,
      data: res.data.map(d => ({ ...d, updateBy: d.operatorVO && d.operatorVO.operatorName}))
    }
  }

  // 导入
  batchImportSubmit = async(formData) => {
    try {
      await getImportRules(formData)
      Message.success('导入成功')
    } catch(e) {
      return e.message
    }
  }
  refresh = () => {
    this.queryList.refresh()
  }

  // 推送到UCS
 async pushToUcs(data) {
    try {
      await getUpdateRuleToUCS({...data, solutionId: data.id})
      this.refresh()
    } catch(e) {
      Message.error(e.message)
    }
  }
  render() {
    return (
      <div>
        <QueryList
          ref={(el) => { this.queryList = el}}
          // 查询配置
          toolSearch
          initSearch={false}
          searchModel={qSearch}
          defaultValue="-"
          // 表头配置
          columns={tColumns}
          columnWidth={100}
          // 格式化查询参数
          formatSearchParams={this.formatSearchParams}
          // 格式化接口数据
          formatData={this.formatData}
          // 配置
          tableOptions={{
            url: '/warehouse/${warehouseId}/sorting-solutions/list',
            method: 'post'
          }}
        >
          <div style={{display: 'flex'}} slot="tools">
            <Button mr='10' onClick={() => {
              this.planDetail.open({
                solutionName: '',
                status: '0',
                solutionScene: 0,
                deviceType: 1,
                isAdd: true,
                sortingType: ''
              })
            }}>新增</Button>
            <DialogButton
                title="批量导入"
                config={batchImportModel}
                DialogWidth={600}
                onSubmit={this.batchImportSubmit}
                refresh={this.refresh}
              ></DialogButton>
          </div>
          <div slot="tableCell" prop="make">
            {
              (val, index, record) =>
                <div>
                  <Button p mr="10" onClick={() => {
                    this.planDetail.open({...record})
                  }} text>修改</Button>
                  <Button type="primary" mr="10" onClick={() => this.Delete(record)} text>删除</Button>
                  {flashSowOptions.map(f => f.value).includes(record.sortingType) && <DialogButton
                    title="推送UCS"
                    btnProps={{text: true, p: true}}
                    confirmMsg="是否将规则配置推送到UCS？"
                    onSubmit={async () => await this.pushToUcs(record)}
                    refresh={this.refresh}
                  ></DialogButton>}
                </div>
            }
          </div>
        </QueryList>
        <PlanDetail ref={ref => this.planDetail = ref} refresh={() => this.queryList.refresh()}></PlanDetail>
      </div>
    )
  }
  Delete(record) {
    Dialog.confirm({
      title: '提示',
      content: '确认删除该条数据？',
      onOk: async () => {
        try {
          await $http({
            url: `/warehouses/${record.warehouseId}/sorting-solution/${record.id}/delete`,
            type: 'post',
          })
          Message.success('删除成功')
          this.queryList.refresh()
        } catch (e) {
          Message.error(e.errMsg || e)
        }
      }
    })
  }
}
export default  Plan
