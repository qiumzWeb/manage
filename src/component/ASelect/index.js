import React from 'react'
import {Select, Dropdown, Menu, Icon, Radio } from '@/component'
import $http from 'assets/js/ajax';
import API from 'assets/api';
import { getWid, isTrue, _getName } from 'assets/js'
// 获取仓库
const getWarehosesList = $http({
  url: API.getWarehouseNameList,
  method: 'get',
}).then(res => {
  if (res && res.data) {
    const list =  res.data
    return [].concat(list.map(l => ({
      ...l,
      label: l.warehouseName,
      value: l.warehouseId
    })))
  }
}).catch(error => {
  return []
})
export default class ASelect extends React.Component{
  static displayName= 'ASelect'
  constructor(props) {
    super(props)
    const {watchKey, getOptions, onChange, field, allValue, formatOptions, ...attrs} = this.props
    this.attrs = attrs
    this.getOptions = getOptions
    this.onChange = onChange
    this.field = field
    this.watchKey = watchKey
    this.oldDropValue = this.props.value
    this.formatOpt = formatOptions
    this.historyWatchKeyValue = this.getWatchKeyValue()
    this.state = {
      options: [],
      showSearch: false,
      [watchKey]: this.historyWatchKeyValue,
      dropDownValue: this.props.value
    }
  }
  formatOptions(val, options, field, props) {
    if (typeof this.formatOpt === 'function') {
      return this.formatOpt(val, options, field, props)
    }
  }
  getWatchKeyValue = () => this.watchKey && this.field && (this.watchKey.split(',').map(w => this.field.getValue(w)) + '')
  componentDidMount() {
    if (typeof this.getOptions === 'function') {
      // 初始化数据加载 action 值为 0
      this.getOptions({...this.props, action: 0}).then(options => {
        options = this.formatOptions(this.props.value, options, this.field, this.props) || options
        this.setState({
          options
        })
      })
    } else {
      this.getWarehousesList()
    }
  }
  // 获取value
  getValue(value) {
    // 解决前后端数据类型不一致时， 取前端 option 的匹配值
    const options = this.state.options
    if (Array.isArray(value)) {
      return options.filter(o => value.some(v => v == o.value)).map(o => o.value)
    } else {
      return (options.find(o => o.value == value) || {}).value
    }
  }
  // 暴露复制 文案
  getDetailCopyName = async() => {
    const options = await (typeof this.getOptions === 'function' && this.getOptions({...this.props, action: 0}) || getWarehosesList)
    return _getName(options, this.props.value, this.props.defaultValue)
  }
  getChangeKey(watchValue) {
    const changeIndex = (watchValue || '').split(',').findIndex((f,i) => f !== (this.state[this.watchKey]|| '').split(',')[i]);
    return (this.watchKey || '').split(',')[changeIndex];
  }
  componentDidUpdate() {
    const watchValue = this.getWatchKeyValue()
    if (
      typeof this.getOptions === 'function' &&
      watchValue !== this.historyWatchKeyValue
    ) {
      const changeKey = this.getChangeKey(watchValue)
      this.historyWatchKeyValue = watchValue
      // 监听依赖属性 变动 加载， action 值为 1， 可根据判断action 的值来判断 是否依赖关系发生变动
      this.getOptions({...this.props, action: 1, actionKey: changeKey}).then(options => {
        options = this.formatOptions(this.props.value, options, this.field, this.props) || options
        this.setState({
          options,
          [this.watchKey]: watchValue
        })
      })
    }
    if (this.props.value !== this.oldDropValue) {
      this.oldDropValue = this.props.value
      this.setState({
        dropDownValue: this.props.value
      })
    }
  }
  getWarehousesList() {
    this.getOptions = async() => await getWarehosesList
    this.getOptions().then(options => {
      this.setState({
        showSearch: true,
        options
      })
    })
  }
  render() {
    const {
      watchKey, getOptions, onChange, field, onClick, allValue, onSearch, isRadio,
      isdetail, isDropDown, isDetail, defaultValue, style, formatOptions, dropStyle,
      getPopupContainer,
      ...attrs
    } = this.props
    if (isTrue(allValue)) {
      Object.assign(attrs, {
        hasSelectAll: false
      })
      this.formatOpt = (val, options) => {
        if(Array.isArray(val) && val.length) {
            if (val.some(v => v.value == allValue)) {
                return options.map(o => ({
                    ...o,
                    disabled: o.value != allValue
                }))
            } else {
                return options.map(o => ({
                    ...o,
                    disabled: o.value == allValue
                }))
            }
        }
        return options.map(o => ({
            ...o,
            disabled: false
        }))
      }
    }
    return (
      // 详情显示
    (isdetail || isDetail) && 
      <span style={style}>{Array.isArray(this.props.value)
        ? this.props.value.map(v => _getName(this.state.options, v)) + '' || defaultValue
        : _getName(this.state.options, this.props.value) || defaultValue
      }</span>
    ) || (
      // 下拉弹框
      isDropDown && <Dropdown
        trigger={<span style={{cursor: 'pointer',display: 'flex', alignItems: 'center', ...dropStyle}}>
          {(this.state.options.find(o => o.value == this.state.dropDownValue) || {label: defaultValue}).label}
          {this.props.hasArrow != false && <Icon type="arrow-d" s="m" ml="5"></Icon>}
        </span>}
        triggerType={["click"]}
        {...attrs}
      >
        <Menu className='pcs-menu' style={{maxHeight: '500px', height: 'auto', ...style}}>
          {this.state.options.map((option, index) => {
            return <Menu.Item key={index}
              onClick={() => {
               if (typeof onClick === 'function') {
                onClick(option.value)
               } else {
                this.setState({
                  dropDownValue: option.value
                })
                typeof this.onChange === 'function' && this.onChange(option.value)
               }
              }}
            >{option.label}</Menu.Item>
          })}
        </Menu>
      </Dropdown>
    ) || (
      // 单选群组
      isRadio && <Radio.Group
        style={{width: '100%', ...style}}
        {...attrs}
        dataSource={this.state.options}
        value={this.getValue(this.props.value)}
        onChange={(val, ...args) => {
          typeof this.onChange === 'function' && this.onChange(val, ...args)
          const options = this.formatOptions(val, this.state.options, this.field, this.props)
          options && this.setState({options})
        }}
      ></Radio.Group>
    ) || (
    // 普通选择框
    <Select
      style={{width: '100%', ...style}}
      // maxTagCount={2}
      popupContainer={typeof getPopupContainer === 'function' && getPopupContainer() || document.body}
      tagInline
      showSearch={this.state.showSearch}
      {...attrs}
      onSearch={onSearch && (val => {
        typeof onSearch == 'function' && onSearch(val, field)
      })}
      dataSource={this.state.options}
      value={this.props.value}
      onChange={(val, ...args) => {
        typeof this.onChange === 'function' && this.onChange(val, ...args)
        const options = this.formatOptions(val, this.state.options, this.field, this.props)
        options && this.setState({options})
      }}
      onVisibleChange={(val) => {
        if (val) {
          const options = this.formatOptions(this.props.value, this.state.options, this.field, this.props)
          options && this.setState({options})
        }
      }}
    ></Select>)
  }
}
