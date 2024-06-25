import React, {useEffect, useState, useRef} from 'react'
import ReactDOM from 'react-dom'
import { Icon } from '@/component'
import ChildrenSet from './childrenSet'
import Bus from 'assets/js/bus'
export default function ArrorToChildSet(props) {
  const {onChange, value, data, container, cacheKey, name } = props
  const [visible, setVisible] = useState(false)
  const [childrenTable, setChildrenTable] = useState(null)
  useEffect(() => {
    const unBus = Bus.$on('childrenVisibleChange', (activeName) => {
      if (!activeName.includes(name.slice(-1)[0])) {
        setChildrenTable(null)
        setVisible(false)
      }
    })
    return unBus
  }, [])
  // 子组件渲染
  const childSet = (<ChildrenSet
    cacheKey={cacheKey}
    parentName={name}
    data={data}
    value={value}
    onChange={(listData) => {
      typeof onChange === 'function' && onChange(listData)
    }}
  ></ChildrenSet>);
  function setChild(e) {
    e.stopPropagation()
    const childContainer = container.current;
    if (childContainer) {
      Bus.$emit('childrenVisibleChange', name)
      const isOpen = !visible
      setVisible(isOpen)
      if (isOpen) {
        setChildrenTable(ReactDOM.createPortal(childSet, childContainer))
      } else {
        setChildrenTable(null)
      }
    }
  }
  return <div
    onClick={setChild}
    style={{display: 'flex', justifyContent: 'space-between'}}
    >
    <span>{value}</span>
    <div style={{flex: 1, cursor: 'pointer', textAlign: 'right'}}>
      <Icon
        type={!visible ? "arrow-right" : "arrow-up"}
        className="main-color"
        style={{fontWeight: 'bold'}}
      ></Icon>
    </div>
    {childrenTable}
  </div>
}