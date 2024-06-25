import React from 'react';
import { Button, Loading, Message } from '@/component';
import AForm from '@/component/AForm'
import $http from 'assets/js/ajax';
import {getUuid, isObj, isEmpty, isTrue} from 'assets/js';
class ASearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.form = null
    this.defaultParams = props.defaultParams || {}
    this.qSearch = Array.isArray(props.searchModel) ? props.searchModel : (props.searchModel && [props.searchModel] || [])
    this.searchOptions = props.searchOptions || {}
    this.searchParams = null
    this.state = {
      loading: false,
    }
  }
  getChildren() {
    if (!this.props.children) return []
    return Array.isArray(this.props.children) ? this.props.children : [this.props.children]
  }
  // 初始化
  componentDidMount() {
    if (typeof this.props.afterMounted === 'function') {
      this.props.afterMounted(this)
    }
    if (this.props.initSearch) {
      this.onSearch({action: 1})
    }
  }
  getData() {
    return this.form && this.form.getData && this.form.getData()
  }
  // 查询
  async onSearch({action, formData}) {
    let data = this.getData()
    if (formData) {
      data = formData
    } else if (action == 2 && this.searchParams) {
      data = this.searchParams.data
    }
    this.setState({
      loading: true
    })
    try {
      let searchParams = {
        url: this.searchOptions.url,
        type: this.searchOptions.method || 'post',
        data,
      }
      if (typeof this.props.formatSearchParams === 'function') {
        searchParams = this.props.formatSearchParams(searchParams, action) || searchParams;
      }
      if (typeof searchParams === 'string') {
        Message.warning(searchParams)
        return
      }
      this.searchParams = searchParams
      let res = await $http(searchParams)
      if (res) {
        if (typeof this.props.formatData === 'function') {
          res = this.props.formatData(res, this.searchParams) || res
        }
        if (typeof res === 'string') {
          Message.warning(res)
          return
        }
      }
    } catch (e) {
      Message.error(e.message)
    } finally {
      this.setState({
        loading: false
      })
    }
  }
  // 刷新
  refresh(data) {
    if (typeof data === 'object') {
      this.form.setData(data)
    }
    this.onSearch({action: 2, formData: data})
  }
  render() {
    const tableTools = this.getChildren().filter(c => c && c.props && c.props.slot === 'tools')
    const expandSlotScope = this.getChildren().filter(c => c && c.props && c.props.slot === 'expand')
    const childrens = this.getChildren().filter(c => c && c.props && !c.props.slot)
    return <div className="pcs-query-form" style={{position: 'relative',...(this.props.style || {})}}>
      <Loading visible={!!this.state.loading} style={{left: '45%', top: '60%', position: 'absolute'}}></Loading>
      <AForm formModel={this.qSearch} ref={ref => this.form = ref} data={this.defaultParams}></AForm>
      <div >
        {tableTools.map((c, index) => {
          const child = c.props.children
          return <span key={index}>
           {typeof child === 'function' ? child(this) : child}
          </span>
        })}
        {this.props.toolSearch !==false ? <Button
          mr="10"
          ml={isEmpty(tableTools) ? 0 : 10}
          type="primary"
          onClick={() => this.onSearch({action: 1})}
        >{this.props.searchBtnText || '查询'}</Button> : ''}
        {expandSlotScope}
      </div>
      {childrens}
    </div>
  }
}

export default ASearchForm
