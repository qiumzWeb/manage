import React, {useEffect, useState, useRef, useMemo} from 'react';
import { Form } from '@alifd/next'
import Item from './Item'
import { getChildDisplayName, getChildren, AssignProps } from 'assets/js/proxy-utils'
import { isTrue, getObjType, getUuid, isEmpty } from 'assets/js'
import { Grid } from '@/component'
import DefineSearchSet from '@/component/DefineSearchSet/index';
function AForm (props) {
  const {direction, size, children, defineSearch, getDefineComponent, code, style={}, ...attrs} = props
  const [newChild, setNewChild] = useState([])
  const [defineData, setDefineData] = useState(null)
  const [formMaxHeight, setFormMaxHeight] = useState(100000);
  const form = useRef()
  const formClassName = useMemo(() => getUuid(), []);
  const defineConfigCache = useRef({})
  // 生成自定义查询组件
  const setDefineComponent = (rowChild) => {
    const config = {}
    rowChild.forEach((col, index) => {
      if (!col || !col.props.children || col.props.outsider) return
      config[col.key] = {
        label: col.props.children.props.label,
        required: !!col.props.required,
        show: !!col.props.show,
        index: index + 1
      }
    })
    // 若数据字段变更，则 抛出 新组件
    if (String(Object.keys(defineConfigCache.current)) != String(Object.keys(config))) {
      defineConfigCache.current = config;
      const defineComponent = <DefineSearchSet
        btnProps={{mr: '10'}}
        data={config}
        code={code || location.pathname}
        setFormMaxHeight={(height) => {
          setFormMaxHeight(height)
        }}
        onChange={(data) => {
          setDefineData(data)
        }}
        form={form}
      ></DefineSearchSet>;
      typeof getDefineComponent === 'function' && getDefineComponent(defineComponent)
    }
  }
  // 获取渲染children
  const getChildrens = (callBack, filterData) => {
    if (getObjType(callBack) === 'Object' && !filterData) {
      filterData = callBack
    }
    let filterRowChild = []
    const newChildren =  getChildren(children).map((child, index) => {
      const childName = getChildDisplayName(child)
      const prop = {...child.props}
      if (childName === 'Row') {
        let rowChild = getChildren(prop.children).flat()
        // 若子组件 全是 Col 布局，则添加 默认 gutter属性
        if (
          !rowChild.some(rc => getChildDisplayName(rc) !== 'Col')
        ) {
           (prop.gutter = '12')
        }
        if (defineSearch) {
          filterRowChild = filterRowChild.concat(rowChild)
          if (getObjType(filterData) === 'Object') {
            rowChild = rowChild.filter(col => {
              if (filterData[col.key]) {
                return filterData[col.key].show || filterData[col.key].required
              } else {
                return true
              }
            })
            rowChild.sort((a, b) => {
              if (filterData[a.key] && filterData[b.key]) {
                return filterData[a.key].index - filterData[b.key].index
              } else {
                return 0
              }
            })
          } else {
            rowChild = []
          }
        }
        return <Grid.Row {...prop} key={index}>
          {rowChild}
        </Grid.Row>
      }
      return child
    })
    if (typeof callBack === 'function' && !isEmpty(filterRowChild)) {
      callBack(filterRowChild)
    }
    return newChildren;
  }

  useEffect(() => {
    setNewChild(getChildrens(setDefineComponent))
  }, [])
  useEffect(() => {
    setNewChild(getChildrens(setDefineComponent, defineData))
  }, [children, defineData])
  return <Form
    {...attrs}
    className={"pcs-form-manage-base-" + formClassName}
    ref={form}
    style={{maxHeight: formMaxHeight, overflow: 'hidden', ...style}}
  >
    {newChild}
  </Form>
}
AssignProps(AForm, Form, (key, to) => {
  if (key === 'Item') (to[key] = Item)
})
export default AForm