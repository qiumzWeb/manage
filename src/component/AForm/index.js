import React from 'react';
import { Grid, Field } from '@alifd/next';
import { Form, Input, Loading } from '@/component';
import { getObjType as isType, isTrue, isEmpty, debounce, getResult } from 'assets/js';
import { getChildren } from 'assets/js/proxy-utils';
import { getTipsLabel, getRangTime, isEmptyTime, getStrToDayjsTime } from '@/report/utils';
import dayjs from 'dayjs';
const FormItem = Form.Item;
const { Row, Col } = Grid;
export default class AForm extends React.Component {
  constructor(props) {
    super(props)
    this.openData = {...(props.expandData || {})}
    this.field = new Field(this)
    // 组件模型
    this.qSearch = getChildren(this.props.formModel)
    this.formData = props.data
    // 数据状态(每个组件是否显示、必填、禁用、标题)
    this.dataStatus = {}
    // 数据转换集
    this.dataFormats = {}
    // 自定义校验集
    this.validates = {}
    this.state = {
      loading: false,
      loadingSize: ''
    }
    this.FromListFields = {}
  }
  // 初始化
  componentDidMount() {
    // 装模数据， 处理 format
    this.qSearch.forEach(qs => {
      Object.entries(qs).forEach(([key, v]) => {
        // defaultValue 默认值处理
        if (v.hasOwnProperty('defaultValue')) {
          getResult(v.defaultValue, this).then(val => {
            if (!this.field.getValue(key)) {
              this.field.setValue(key, val)
            }
          })
        }
        if (typeof v.format === 'function') {
          // action : inset: 设置 field value, output: 输出 formData 数据
          this.dataFormats[key] = (data, action) => {
            return v.format(data[key], { data, form: this, action })
          }
        }
        /**
         * 时间转换
         */
        if (v.timeFormat) {
          this.dataFormats[key] = (data, action) => {
            const value = data[key]
            const values = {
              inset: getStrToDayjsTime(value),
              output: value && dayjs(value).format(
                typeof v.timeFormat === 'function' ? v.timeFormat(value, {data, form: this, action}) : v.timeFormat
              ) || ''
            }
            return values[action]
          }
        }
        // 时间区间转换
        if (Array.isArray(v.transTimeCode)) {
          const [start, end] = v.transTimeCode;
          this.dataFormats[key] = (data, action) => {
            const values = {
              inset: [
                !isEmptyTime(start) && getStrToDayjsTime(data[start]) || '',
                !isEmptyTime(end) && getStrToDayjsTime(data[end]) || ''
              ],
              output: getRangTime(data, {
                time: key,
                start,
                end,
                fmt: v.format
              })
            }
            return values[action]
          }
        }
      })
    })
    // 将处理后的 数据 回填, 若有扩展数据 ，一并合并
    if (isType(this.props.data) === 'Object' && isType(this.openData) === 'Object') {
      Object.assign(this.props.data, this.openData)
    }
    this.setData(this.props.data)
  }
  // 显示弹窗
  setLoading = (loading, size = 'large') => {
    this.setState({ loading, loadingSize: size })
  }
  // 向外暴露数据
  setOpenData(data) {
    if (isType(data) !== 'Object') return
    this.updateOpenData(data)
    typeof this.props.setOpenData === 'function' && this.props.setOpenData(data)
  }
  // 更新openData
  updateOpenData(data) {
    Object.assign(this.openData, data);
    this.updateFromListFields()
  }
  // 全局更新所有子table 的 field
  updateFromListFields() {
    Object.entries(this.FromListFields).forEach(([key, fields]) => {
      this.setTableField(fields.watchKey, fields, key)
    })
  }
  // 更新子组件为Table的 field
  setTableField(watchKey, fields, key) {
    if (this.dataStatus[key].show && watchKey && typeof watchKey === 'string') {
      const keyList = watchKey.split(',')
      const openData = {}
      keyList.forEach(k => {
        openData[k] = isTrue(this.openData[k]) ?  this.openData[k] : this.formData[k]
      })
      fields.forEach(field => {
        field.setValues(openData)
      })
    }
  }
  // 对比fields 是否相同
  isSameFields(fs1, fs2) {
    if (Array.isArray(fs1) && Array.isArray(fs2)) {
      if (fs1.length === fs2.length) {
        return fs1.every((f, index) => {
          const v1 = f.getValues()
          const v2 = fs2[index].getValues()
          if (JSON.stringify(v1) != JSON.stringify(v2)) {
            return false
          } else {
            return true
          }
        })
      } else {
        return false
      }
    } else {
      return fs1 === fs2
    }
  }
  // 获取数据
  getData() {
    const data = {}
    const formData = this.field.getValues()
    this.qSearch.forEach((q) => {
      Object.entries(q).forEach(([key, val]) => {
        // 组件是否显示
        const show = typeof val.show === 'function' ? val.show(formData, this) : (val.show !== false)
        // 当前组件显示并且非展示字段
        if (show && val.onlyShow != true) {
          let value = formData[key];
          // 格式化数据
          if (this.dataFormats[key]) {
            value = (this.dataFormats[key])(formData, 'output')
          }
          // 如果数据是个对象并且需要详情数据，直接将数据合并到整个请求对象中(针对于多选菜单的(例如 AFormTable)，一个字段可能表示着一个对象)
          if (isType(value) === 'Object' && val.useDetailValue) {
            Object.assign(data, value);
            return
          }
          // 赋值
          data[key] = value
          // 额外处理：如果有扩展字段，将扩展字段的值取出来
          if (Array.isArray(val.expandKeys)) {
            val.expandKeys.forEach(v => {
              data[v] = formData[v]
            })
          }
        }
      })
    })
    return data
  }
  // 设置数据
  setData(data) {
    if (isType(data) !== 'Object') return
    Object.entries(data).forEach(([key, val]) => {
      let value = val
      // 格式化数据
      if (this.dataFormats[key]) {
        value = (this.dataFormats[key])(data, 'inset');
      }
      const newValue = isTrue(value) ? value : this.props.defaultValue;
      this.field.setValue(key, newValue)
    })
  }
  // 数据校验
  async validate() {
    const result = await new Promise(resolve => {
      this.field.validate((error, value) => {
        if (error) {
          Object.keys(error).forEach(key => {
            if (this.dataStatus[key] && this.dataStatus[key].required) {
              resolve(false)
            }
          })
        }
      })
      // 触发自定义校验
      Object.entries(this.validates).forEach(([key, call]) => {
        const data = this.getData()
        const definedValidateResult = call(data[key], data, (msg) => {
          this.field.setError(key, msg)
        })
        if (!definedValidateResult) {
          resolve(false)
        }
      })
      resolve(true)
    })
    return result
  }
  // 更新数据 校验 规则 
  updateValidate({show, key, required, requiredMessage, validate, expandValidate }) {
    if (!show) {
      delete this.validates[key]
      delete this.FromListFields[key]
      return
    }
    // 必填校验
    if (required) {
      // 为解决动态字段表单无法检查到的校验bug, 表单字段变更后，添加默认自定义校验规则
     const defaultValidate = (itemValue, itemData, setError) => {
       if (isEmpty(itemValue)) {
         setError(requiredMessage)
         return false
       }
       return true
     }
     // 自定义校验 
     if (typeof validate === 'function') {
       this.validates[key] = new Proxy(defaultValidate, {
         apply(call, ctx, props) {
           return Reflect.apply(call, ctx, props) && Reflect.apply(validate, ctx, props)
         }
       })
     } else {
       this.validates[key] = defaultValidate
     }
     // 自定义其它校验
     if (typeof expandValidate === 'function') {
       this.validates[key] = new Proxy(this.validates[key], {
         apply(call, ctx, props) {
           return Reflect.apply(expandValidate, ctx, props) && Reflect.apply(call, ctx, props)
         }
       })
     }
   }
  //  非必填校验
   else {
     if (typeof validate === 'function') {
       this.validates[key] = validate
     } else {
       delete this.validates[key]
     }
     if (typeof expandValidate === 'function') {
       if (typeof this.validates[key] === 'function') {
         this.validates[key] = new Proxy(this.validates[key], {
           apply(call, ctx, props) {
             return Reflect.apply(expandValidate, ctx, props) && Reflect.apply(call, ctx, props)
           }
         })
       } else {
         this.validates[key] = expandValidate
       }
     }
   }
  }
  // 重置
  reset() {
    this.field.reset()
  }
  componentDidUpdate() {
    if (JSON.stringify(this.props.data) !== JSON.stringify(this.formData)) {
      this.formData = this.props.data
      this.setData(this.props.data)
    }
    if (
      this.props.expandData &&
      Object.entries(this.props.expandData).some(([key, val]) => {
        return this.openData[key] !== val
      })
    ) {
      this.updateOpenData(this.props.expandData)
      this.setData(this.props.expandData)
    }
  }
  render() {
    return <div>
      <Loading visible={this.props.loading || this.state.loading}
        style={{ position: 'absolute', top: '45%', left: '48%' }}
        size={this.state.loadingSize}
      ></Loading>
      <Form field={this.field}
        defineSearch={typeof this.props.getDefineComponent === 'function'}
        getDefineComponent={this.props.getDefineComponent}
        code={this.props.defineSearchCode}
      >
        {
          Array.isArray(this.qSearch) && this.qSearch.map((q, index) => {
            return <Row gutter="12" key={index} wrap>
              {
                Object.entries(q).map(([key, val], cIndex) => {
                  let Component = val.component || Input
                  // 插槽
                  const slotScope = getChildren(this.props.children).find(c => c && c.props && c.props.slot === 'formCell' && c.props.prop == key);
                  if (slotScope) {
                    const child = slotScope.props.children
                    Component = typeof child === 'function' ? React.forwardRef(slotScope.props.children) : Component;
                  }
                  const formValues = this.field.getValues();
                  // 是否显示
                  const show = typeof val.show === 'function' ? val.show(formValues, this) : (val.show !== false);
                  // 隐藏时,如果有值 刚缓存起来
                  if (!show && formValues[key] !== undefined) {
                    val.cacheValue = formValues[key]
                  }
                  // 若有默认值 ,回填 默认值 
                  if (show && formValues[key] === undefined) {
                    if (val.cacheValue !== undefined) {
                      this.field.setValue(key, val.cacheValue)
                    } else if (val.hasOwnProperty('defaultValue')) {
                      getResult(val.defaultValue, this).then(dv => {
                        if (!this.field.getValue(key)) {
                          this.field.setValue(key, dv)
                        }
                        
                      })
                    }
                  }
                  // 是否必填
                  const required = typeof val.required === 'function' ? val.required(formValues, this) : !!val.required;
                  {/* 是否是详情 */}
                  let isDetail = typeof this.props.isDetail === 'function' ? this.props.isDetail(formValues, this) : this.props.isDetail;
                  // 是否禁用
                  let disabled = isDetail=== true ? true : (typeof val.disabled === 'function' ? val.disabled(formValues, this) : !!val.disabled);
                  // 标题
                  let label = typeof val.label === 'function' ? val.label(formValues, this) : val.label;
                  // 错误信息
                  const requiredMessage = (typeof label === 'string' ? label : '') + '必填';
                  // 如果有tips属性，替换为 带提示的 标题
                  if (val.tips) {
                    label = getTipsLabel(label, val.tips);
                  }
                  // 将所有的状态缓存一份
                  if (!this.dataStatus[key]) this.dataStatus[key] = {}
                  Object.assign(this.dataStatus[key], {
                    show, required, disabled, label
                  })

                  // 组件宽度：默认 12 ，如果有自定义属性，使用自定义属性 (span 或 fixedSpan)
                  let colAttrs = {
                    fixedSpan: 12
                  }
                  val.span && (colAttrs = { span: val.span })
                  val.fixedSpan && (colAttrs = { fixedSpan: val.fixedSpan })
                  // 更新校验规则
                  this.updateValidate({
                    key,
                    show,
                    required,
                    requiredMessage,
                    validate: val.validate,
                    expandValidate: this.dataStatus[key].validate
                  })
                  const valStyle = (val.attrs || {style: {}}).style || {};
                  const cell = <Col {...colAttrs} key={key} show={val.isExpand !== true} required={val.isExpand !== true} outsider={val.outsider}>
                    <FormItem label={label} {...(val.formItem || {})} required={required} requiredMessage={requiredMessage}>
                      <Component {...(val.attrs || {})} disabled={disabled} name={key} style={{...valStyle, width: '100%', }} onChange={(value, ...args) => {
                        if (val.attrs && typeof val.attrs.onChange === 'function') {
                          val.attrs.onChange(value, this, ...args)
                        }
                      }} field={this.field} validate={(vCall) => {
                        // 挂载自定义校验，自定义组件可使用'
                        // 更新校验规则
                        this.updateValidate({
                          key,
                          show: this.dataStatus[key].show,
                          required: this.dataStatus[key].required,
                          requiredMessage,
                          validate: val.validate,
                          expandValidate: vCall
                        })
                        Object.assign(this.dataStatus[key], { validate: vCall })
                      }} getopenfields={({fields, watchKey, hasUpdate}) => {
                        // 加载时更新数据
                        if (
                          watchKey && Array.isArray(fields) && !isEmpty(fields) && (
                            !this.FromListFields[key] || hasUpdate || (
                              this.FromListFields[key] && !this.isSameFields(this.FromListFields[key], fields)
                            )
                          )
                        ) {
                          this.setTableField(watchKey, fields, key)
                        }

                        // 更新域
                        if (this.dataStatus[key].show && Array.isArray(fields) && !isEmpty(fields)) {
                          this.FromListFields[key] = fields
                          this.FromListFields[key].watchKey = watchKey
                        }
                      }}></Component>
                    </FormItem>
                  </Col>
                  return show ? cell : ''
                })
              }
            </Row>
          })
        }
      </Form>
    </div>
  }
}