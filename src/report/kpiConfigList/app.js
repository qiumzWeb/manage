import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Card, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns } from './config'
import AForm from '@/component/AForm'
import ExportFile from '@/component/ExportFile/index'
import API from 'assets/api'
import Bus from 'assets/js/bus'
import baseModel from './editConfig/base'
import computedModel from './editConfig/computed'
import reachModel from './editConfig/reach'
import SLAModel from './editConfig/SLA'
import $http from 'assets/js/ajax'
import FormGroup from '@/component/FormGroup/index'
import { fmtTime } from '@/report/utils'
import { isTrue } from 'assets/js'
export default function App(props) {
  const [data, setData] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const query = useRef()
  const form = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
  }
  const formatData = (data) => {
  }
  function getParams() {
    return query.current.field.getValues()
  }
  function refresh() {
    query.current.refresh()
  }
  // 保存
  async function onOk() {
    const result = await form.current.getData()
    if (result) {
      try{
        let slaNodeKeys = []
        let isHasRepeat = false
        Array.isArray(result.slaConfig) && result.slaConfig.forEach(s => {
          s.time = fmtTime(s.time, 'HH:mm:ss')
          // 验证 考核节点是否重复
          if (slaNodeKeys.includes(s.slaNode)) {
            isHasRepeat = true
          } else {
            slaNodeKeys.push(s.slaNode)
          }
        })
        if (isHasRepeat) {
          return Message.warning('SLA考核环节不可重复选择')
        }
        result.slaConfig = JSON.stringify(result.slaConfig)
      }catch(e){}
      console.log(result, '成功')
      const kpiRuleValue = isTrue(result.kpiRuleValue1) ? result.kpiRuleValue1 : result.kpiRuleValue2
      result.kpiRuleValue = fmtTime(kpiRuleValue, 'HH:mm:ss')
      delete result.kpiRuleValue1
      delete result.kpiRuleValue2
      result.kpiStartCalculationTime = fmtTime(result.kpiStartCalculationTime, 'HH:mm:ss')
      result.kpiEndCalculationTime = fmtTime(result.kpiEndCalculationTime, 'HH:mm:ss')
      result.kpiStartEffectiveDate = fmtTime(result.kpiStartEffectiveDate, 'YYYY-MM-DD HH:mm:ss')
      result.kpiEndEffectiveDate = fmtTime(result.kpiEndEffectiveDate, 'YYYY-MM-DD HH:mm:ss')
      setLoading(true)
      if (data.isAdd) {
        await add(result)
      } else {
        await modify(result)
      }
      setLoading(false)
    }
  }
    // 新增
    async function add(data) {
      try {
        await $http({
          url: API.addKpiConfig,
          method: 'post',
          data
        })
        Message.success('新增成功')
        onClose()
        refresh()
      } catch(e) {
        Message.error(e.message)
      }
    }
    // 修改
    async function modify(modifyData) {
      try {
        await $http({
          url: API.modifyKpiConfig,
          method: 'post',
          data: Object.assign({}, data, modifyData)
        })
        Message.success('修改成功')
        onClose()
        refresh()
      } catch(e) {
        Message.error(e.message)
      }
    }
  // 关闭
  function onClose() {
    setVisible(false)
  }
  // 删除
  function onDelete(data) {
    Dialog.confirm({
      title: '删除KPI配置',
      content: `确认删除后数据不可恢复！`,
      onOk: async() => {
        try {
          await $http({
            url: API.deleteById.replace("{id}", data.id),
            method: 'delete'
          })
          Message.success('删除成功')
          refresh()
        } catch(e) {
          Message.error(e.message)
        }
        onClose()
      }
    })
  }
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      columnWidth={150}
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: API.getKpiListNew,
        method: 'post',
      }}
    >
      <div slot='tools'>
        <Button mr="10" type="normal" onClick={() => {
          setData({isAdd: true})
          setVisible(true)
        }}>新增</Button>
        <ExportFile commandKey="/pcsKpiConfigList" btnProps={{mr: 0}} params={getParams}></ExportFile>
      </div>
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          return <div>
            <Button text type='link' mr="10" onClick={() => {
              setVisible(true)
              setData({
                ...record,
                kpiRuleValue1: record.kpiRuleUnit == '1' && record.kpiRuleValue,
                kpiRuleValue2: record.kpiRuleUnit != '1' && record.kpiRuleValue,
                slaConfig: record.slaConfig && JSON.parse(record.slaConfig) || []
              })
            }}>修改</Button>
            <Button text type="link" onClick={() => onDelete(record)}>删除</Button>
          </div>
        }}
      </div>
    </QueryList>
    <Dialog
      title={data.isAdd ? '新增' : '修改'}
      width={'100%'}
      visible={visible}
      onOk={onOk}
      okProps={{loading}}
      onClose={onClose}
      onCancel={onClose}
    >
      <FormGroup
        ref={form}
        data={data}
        group={{
          base: { title: 'KPI基础信息', model: baseModel },
          computed: { title: 'KPI计算参数', model: computedModel },
          reach: { title: 'KPI达成规则', model: reachModel, subTitle: 'KPI止算时间类型值 ≤ 规则计算结果' },
          SLA: { title: 'SLA考核规则', model: SLAModel, show: data => data.kpiType }
        }}
      ></FormGroup>
    </Dialog>
  </div>
}