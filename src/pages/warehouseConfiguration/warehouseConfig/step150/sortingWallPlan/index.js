import React from 'react';
import QueryList from '@/component/queryList'
import { tColumns } from './config/planConfig'
import { Button, Dialog, Message } from '@/component'
import $http from 'assets/js/ajax';
import PlanDetail from './rulesModify'
import './common.scss';
import { getStepBaseData, setStepBaseData, saveStepNode, stepJump } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
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
      url: req.url.replace('${warehouseId}', getStepBaseData().warehouseId)
    }
  }
  refresh() {
    console.log('激活了===')
    this.queryList.refresh()
  }
  // 格式化渲染数据
  formatData = (res) => {
    return {
      ...res,
      data: res.data.map(d => ({ ...d, updateBy: d.operatorVO && d.operatorVO.operatorName}))
    }
  }
  render() {
    return (
      <div>
        <QueryList
          ref={(el) => { this.queryList = el}}
          // 查询配置
          toolSearch
          defaultParams={{
            warehouseName: getStepBaseData().warehouseName,
            warehouseId: getStepBaseData().warehouseId
          }}
          showDefineSearch={false}
          initSearch={true}
          pagination={true}
          defaultValue="-"
          // 表头配置
          columns={tColumns}
          // 格式化查询参数
          formatSearchParams={this.formatSearchParams}
          // 格式化接口数据
          formatData={this.formatData}
          // 配置
          tableOptions={{
            url: '/warehouse/${warehouseId}/sorting-solutions/list',
            method: 'post',
            attrs: {
              inset: true
            }
          }}
        >
          {!getStepBaseData().readOnly && <div style={{display: 'flex'}} slot="tools">
            <Button onClick={() => {
              this.planDetail.open({
                warehouseName: getStepBaseData().warehouseName,
                warehouseId: getStepBaseData().warehouseId,
                solutionName: '',
                status: '',
                solutionScene: 0,
                deviceType: 1,
                isAdd: true,
                sortingType: ''
              })
            }}>新增分拣计划</Button>
          </div>}
          <div slot="tableCell" prop="make">
            {
              (val, index, record) =>
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                  <Button type="primary" onClick={() => {
                    this.planDetail.open({
                      warehouseName: getStepBaseData().warehouseName,
                      warehouseId: getStepBaseData().warehouseId,
                      ...record
                    })
                  }} text>修改</Button>
                  <Button type="primary" onClick={() => this.Delete(record)} text>删除</Button>
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
