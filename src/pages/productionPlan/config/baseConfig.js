import React from 'react'
import { Input, Select, NumberPicker, TimePicker } from '@/component'
import ASelect from '@/component/ASelect'
import { getRuleTye, getJobNode, getBizType } from '../api'
import {getWid} from 'assets/js'
const formItem = {
  labelCol: null,
  wrapperCol: null
}
export const qStatus = ['禁用', '启用']
export const qSearch = {
  warehouseId: {
    label: '仓库名称',
    defaultValue: getWid(),
    component: ASelect,
    formItem
  },
  ruleType: {
    label: '规则类型',
    component: ASelect,
    formItem,
    attrs: {
      getOptions: async () => {
        let res = []
        try {
          res = await getRuleTye()
        } catch(e) {}
        return [].concat(res.map(r => ({
          ...r,
          label: r.ruleTypeDesc,
          value: r.ruleType
        })))
      },
      onChange: (val, ql) => {
        if (ql.searchParams) {
          ql.refresh()
        } else {
          ql.setState({
            tableData: []
          })
        }
      }
    }
  }
}

export const tColumns = {
  warehouseId: {
    title: '仓库名称',
    width: 150,
    lock: 'left',
    cell: (val, index, record) => {
      return <ASelect isdetail value={val}></ASelect>
    }
  },
  ruleType: {
    title: '规则类型',
    width: 150,
    cell: (val) => {
      return <ASelect isdetail value={val} getOptions={async () => {
        let res = []
        try {
          res = await getRuleTye()
        } catch(e) {}
        return res.map(r => ({
          ...r,
          label: r.ruleTypeDesc,
          value: r.ruleType
        }))
      }}></ASelect>
    }
  },
  ruleKey: {
    title: '发货到仓规律（T-当天）',
    show: isOneDay,
    width: 150,
  },
  ruleKey1: {
    title: '作业环节',
    show: (that) => !isOneDay(that),
    width: 150,
    cell: (val, index, records) => {
      return <ASelect isdetail value={records.ruleKey} getOptions={async () => {
        try {
          const options = await getJobNode()
          return (options || []).map(o => ({
            ...o,
            label: o.jobNode,
            value: o.jobNodeCode
          }))
        } catch (e) {
          return []
        }
      }}></ASelect>
    }
  },
  ruleSecondKey: {
    title: '业务类型',
    show: isProTest,
    width: 150,
    cell: (val, index, records) => {
      return <ASelect isdetail value={records.ruleSecondKey} getOptions={async () => {
        try {
          const options = await getBizType()
          return (options || []).map(o => ({
            ...o,
            label: o.bizType,
            value: o.bizTypeCode
          }))
        } catch (e) {
          return []
        }
      }}></ASelect>
    }
  },
  jdTime: {
    title: '截单时间',
    show: isOutTest,
    width: 150,
    cell: (val, index, records) => {
      return (records.ruleSonValue || '--') + '-' + (records.ruleMomValue || '--')
    }
  },
  ruleValue: {
    title: '到仓量占比发货',
    show: isOneDay,
    width: 150
  },
  ruleValue1: {
    title: '标准作业人效值',
    show: isNDay,
    cell: (val, index, records) => records.ruleValue,
    width: 150
  },
  ruleValue2: {
    title: '应完成时间',
    show: isProTest,
    cell: (val, index, records) => records.ruleValue,
    width: 150
  },
  ruleNumValue: {
    title: 'n值',
    show: isNDay,
    width: 100
  },
  ruleNumValue1: {
    title: '单人产能',
    show: isProTest,
    width: 100,
    cell: (val, index, records) => records.ruleNumValue,
  },
  ruleRateValue: {
    title: '作业环节工时比例',
    show: isNDay,
    width: 150
  },
  ruleRateZpValue: {
    title: '招聘环节需求人数比率',
    show: isNDay,
    width: 150,
    cell: (val, index, record) => {
      return <div>{record.ruleSonValue || '--'} / {record.ruleMomValue || '--'}</div>
    }
  },
  make: {
    title: '操作',
    width: 100,
    lock: 'right'
  }
}

// 发货到他规律
export const tDays = ['T-8', 'T-7', 'T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'T']

// 规则类型N开 // 环节人效
function isNDay(that) {
  return getRuleType(that) == 2
}
// 出入库生产计划
function isOneDay(that) {
  return getRuleType(that) < 2
}

// 出库合单预测
function isOutTest(that) {
  return getRuleType(that) == 3
}

// 生产压力监控
function isProTest(that) {
  return getRuleType(that) == 4
}

function getRuleType(that) {
  return that.field && that.field.getValue('ruleType')
}


// 新增修改
export const formModel = {
  warehouseId: {
    label: '仓库名称',
    span: 12,
    component: ASelect,
    defaultValue: getWid(),
    disabled: data => !data.isAdd,
    required: true,
  },
  ruleType: {
    label: '规则类型',
    required: true,
    span: 12,
    disabled: data => !data.isAdd,
    component: ASelect,
    attrs: {
      onChange(val, vm) {
        vm.field.setValue('ruleKey', '')
      },
      getOptions: async() => {
        let res = []
        try {
          res = await getRuleTye()
        } catch(e) {}
        return res.map(r => ({
          ...r,
          label: r.ruleTypeDesc,
          value: r.ruleType
        }))
      }
    }
  },
  ruleKey: {
    label: (data, vm) => {
      const type = data.ruleType
      return type >= 2 ? '作业环节' : '发货到仓规律'
    },
    span: 12,
    required: true,
    disabled: (data) => !data.isAdd,
    component: React.forwardRef(function RuleKey (props, ref) {
      const data = props.field && props.field.getValues()
      const type = data.ruleType
      return type >= 2 ? <ASelect
      {...props}
      getOptions={async() => {
        try {
          const options = await getJobNode()
          return (options || []).map(o => ({
            ...o,
            label: o.jobNode,
            value: o.jobNodeCode
          }))
        } catch (e) {
          return []
        }
      }}
    ></ASelect> : <Select
      ref={ref}
      {...props}
      dataSource={tDays.map(t => ({ lable: t, value: t }))}
    ></Select>
    })
  },
  ruleSecondKey: {
    label: '业务类型',
    span: 12,
    show: data => data.ruleType === 4,
    component: ASelect,
    attrs: {
      getOptions: async() => {
        try {
          const options = await getBizType()
          return (options || []).map(o => ({
            ...o,
            label: o.bizType,
            value: o.bizTypeCode
          }))
        } catch (e) {
          return []
        }
      }
    }
  },
  ruleValue: {
    label: (data) => {
      const type = data.ruleType
      const obj = {
        0: '到仓量占比发货',
        1: '到仓量占比发货',
        2: '标准作业人效值',
        3: '',
        4: '应完成时间'
      }
      return obj[type] || '到仓量占比发货'
    },
    show: (data) => data.ruleType !== 3,
    span: 12,
    component: React.forwardRef(function RuleValue(props, ref) {
      const field = props.field
      const data = field && field.getValues()
      return data.ruleType === 4 ?  <TimePicker ref={ref} {...props} format="HH:mm" /> : <Input {...props}></Input>
    }),
    required: (data) => {
      return data.ruleType !== 3 && !(data.ruleType == 2 && ['abnormal', 'function'].includes(data.ruleKey))
    } ,
  },
  ruleNumValue: {
    label: (data) => {
      return data.ruleType === 2 ? "n值" : '单人产能'
    },
    span: 12,
    show: (data) => [2, 4].includes(data.ruleType),
    component: NumberPicker,
    attrs: {
      placeholder: '请输入整数',
      defaultValue: ""
    }
  },
  ruleRateValue: {
    label: '作业环节工时比例',
    span: 12,
    show: (data) => data.ruleType === 2,
    component: NumberPicker,
    attrs: {
      placeholder: '请输入数字',
      defaultValue: "",
      precision: 2
    }
  },
  ruleSonValue: {
    label: '招聘人数缺口之环节需求人数比率',
    span: 12,
    expandKeys: ['ruleMomValue'],
    show: (data) => data.ruleType === 2,
    component: React.forwardRef(function RuleRate (props, ref) {
      const field = props.field
      const data = field && field.getValues()
      return <span ref={ref}>
        <NumberPicker
          {...props}
          style={{width: "45%"}} placeholder=" 比率分子"
        ></NumberPicker>
        <span style={{display: 'inline-block', width: '10%', height: '35px', textAlign:'center', lineHeight: '35px', fontWeight: 'bold'}}>/</span>
        <NumberPicker defaultValue="" min="0" value={data.ruleMomValue || ''}
          style={{width: "45%"}} placeholder="比率分母"
          onChange={(val) => {
            field.setValue('ruleMomValue', val)
          }}
        ></NumberPicker>
      </span>
    }),
    attrs: {
      defaultValue: "",
      min: 0
    }
  },
  ruleMomValue: {
    label: '截单时间',
    span: 12,
    expandKeys: ['ruleSonValue'],
    show: (data) => data.ruleType === 3,
    component: React.forwardRef(function RuleRate (props, ref) {
      const field = props.field
      const data = field && field.getValues()
      return <span ref={ref}>
        <NumberPicker defaultValue="" min="0" max='24' value={data.ruleSonValue || ''}
          style={{width: "45%"}} placeholder="开始小时时间"
          onChange={(val) => {
            field.setValue('ruleSonValue', val)
          }}
        ></NumberPicker>
        <span style={{display: 'inline-block', width: '10%', height: '35px', textAlign:'center', lineHeight: '35px', fontWeight: 'bold'}}>-</span>
        <NumberPicker
          {...props}
          style={{width: "45%"}} max="24" placeholder="结束小时时间"
        ></NumberPicker>
      </span>
    }),
    attrs: {
      defaultValue: "",
      min: 0
    }
  }
}