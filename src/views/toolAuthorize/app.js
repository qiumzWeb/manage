import React, { useState, useEffect, useRef } from 'react'
import { Button, Tree, Dialog, Message, Loading, Cascader } from '@/component'
import { authConfig, searchModel, empColumns } from './config'
import APaingList from '@/component/APaginglist'
import QueryList from '@/component/queryList'
import API from 'assets/api'
import { getWid, isEmpty } from 'assets/js'
import { getTreeList, saveToolAuth } from './api'
App.title = '工具权限管理'
export default function App(props) {
  const [empData, setEmpData] = useState([])
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkedKeys, setCheckedKeys] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const [treeSource, setTreeSource] = useState({})
  const query = useRef()
  // 查询拦截
  function beforeSearch(req) {
    const {name} = req && req.data
    if (isEmpty(name)) return '请输入员工或工号'
    return {
      ...req,
      url: req.url(name),
      data: undefined
    }
  }
  // 返回数据拦截
  function formatData(res, req, formatData) {
    return formatData(res)
  }
  // 选择员工进行授权
  function setAuthorize(record) {
    setEmpData(record)
    setVisible(true)
  }
  // 渲染工具树
  function getToolTree(res) {
    const Tree = []
    const currentCheckedKeys = []
    const currentExpandedKeys = []
    if (res && Array.isArray(res.groups)) {
      res.groups.forEach(g => {
        const group = {
          ...g,
          label: g.desc,
          value: g.name,
          children: []
        }
        if (Array.isArray(res.tools)) {
          res.tools.forEach(t => {
            // isAuth 为true  默认选中
            // key 值 相同 ，组装为children
            if (t.group == g.name) {
              if (t.auth) {
                currentCheckedKeys.push(t.name)
              }
              if (isEmpty(currentExpandedKeys)) {
                currentExpandedKeys.push(g.name)
              }
              group.children.push({
                ...t,
                label: t.label,
                value: t.name
              })
            }
          })
        }
        Tree.push(group)
      })
      setTreeSource(res)
      setCheckedKeys(currentCheckedKeys)
      setExpandedKeys(currentExpandedKeys)
    }
    return {
      ...res,
      data: Tree
    }
  }
  // 授权
  async function onOk() {
    try {
      setLoading(true)
      if (Array.isArray(treeSource.tools)) {
        treeSource.tools.forEach(t => {
          if (checkedKeys.includes(t.name) || checkedKeys.includes(t.group)) {
            t.auth = true
          } else {
            t.auth = false
          }
        })
      }
      await saveToolAuth(treeSource)
      Message.success('授权成功')
      setTreeSource({})
      setCheckedKeys([])
      setExpandedKeys([])
    } catch(e) {
      Message.error(e.message)
    } finally {
      setLoading(false)
    }
    onClose()
  }
  // 关闭弹窗
  function onClose() {
    setVisible(false)
  }
  return <div>
    <QueryList
      toolSearch
      initSearch={false}
      searchModel={searchModel}
      columns={empColumns}
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: () => API.getJobName,
        method: 'get',
      }}
    >
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          return <Button text type="link" onClick={() => setAuthorize(record)}>授权</Button>
        }}
      </div>
    </QueryList>
    <Dialog
      visible={visible}
      title={`工具授权（${empData.displayName || empData.userName}-${empData.loginName}）`}
      width={750}
      onOk={onOk}
      onClose={onClose}s135
      onCancel={onClose}
      okProps={{loading, disabled: isEmpty(treeSource)}}
    >
      <APaingList
        ref={query}
        initSearch
        pagination={false}
        minHeight={100}
        component={Cascader}
        // mockData={authConfig}
        formatSearchParams={(req) => {
          return {
            ...req,
            data: {loginName: empData.loginName}
          }
        }}
        formatData={getToolTree}
        options={{
          url: '/tools/getAuthInfo',
          method: 'get'
        }}
        attrs={{
          multiple: true,
          onChange: keys => setCheckedKeys(keys),
          onExpand: keys => setExpandedKeys(keys),
          value: checkedKeys,
          expandedValue: expandedKeys,
          listStyle: {
            width: '350px',
            height: 'calc(100vh - 280px )'
          }
        }}
      ></APaingList>
    </Dialog>
  </div>

}