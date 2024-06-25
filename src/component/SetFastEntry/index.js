import React, {useState, useEffect} from 'react'
import { Dialog, Button, Icon, Tree, Message } from '@/component'
import Draggable from '@/component/Draggable'
import {_menus_, BusMenuMap, defineFastEntry, sleepTime} from 'assets/js'
import Bus from 'assets/js/bus'
import './index.scss'
export default function DefineFastEntry(props) {
  const {visible, onClose, data, onChange, limit = 0} = props
  const [dataSet, setDataSet] = useState(data)
  const [menuTree, setMenuTree] = useState([])
  const [checkKeys, setCheckKeys] = useState([])
  useEffect(() => {
    setDataSet(data)
  }, [data])
  useEffect(() => {
    setCheckKeys(dataSet.map(d => d.key || d.routePath))
  }, [dataSet])
  useEffect(async() => {
    const mTree = await window.dbStore.get(_menus_)
    if (Array.isArray(mTree)) {
      setMenuTree(mTree)
    }
    const UnBus = window.dbStore.watch(_menus_, (baseMenuTree) => {
      if (Array.isArray(baseMenuTree)) {
        setMenuTree(baseMenuTree)
      }
    })
    return () => {
      console.log('销毁了---------')
      UnBus()
    }
  }, [])
  function onOk() {
    onClose()
    if (typeof onChange === 'function') {
      onChange(dataSet)
      window.dbStore.set(defineFastEntry, dataSet)
    }
  }
  function getMenuTreeNode(tree) {
    if (Array.isArray(tree)) {
      return tree.map((t, index) => {
        if (t.show === false) return null
        if (Array.isArray(t.childrens) && t.childrens.length) {
          return <Tree.Node label={t.text} key={t.key}>{getMenuTreeNode(t.childrens)}</Tree.Node>
        } else {
          return <Tree.Node label={t.text} key={t.key}></Tree.Node>
        }
      })
    }
    return null
  }
  function onCheck(keys) {
    const selectKeys = keys.filter(f => !(/^\/\d/g).test(f))
    if (selectKeys.length > limit) {
      if (dataSet.length === limit) {
        return Message.warning('当前快捷入口可添加数量为0， 请先移除快捷入口再添加')
      }
      return Message.warning('选择的入口数量超出可添加的快捷入口数量')
    }
    setCheckKeys(selectKeys)
    const menuMap = Bus.getState(BusMenuMap)
    const fastEntryData = selectKeys.map(k => menuMap[k])
    setDataSet(fastEntryData)
  }
  return <Dialog
    title="管理快捷入口"
    style={{width: '800px'}}
    visible={visible}
    onClose={onClose}
    footer={<>
      <Button mr="10" onClick={onClose}>取消</Button>
      <Button mr="10" type="primary" onClick={onOk}>保存</Button>
    </>}
  >
  <div className="set-entry-box">
      <div className="set-left">
        <div className="set-tap-title">展示效果</div>
        <div>
          {props.children}
          <Draggable dataSource={dataSet} onChange={(d) =>{
            setDataSet(d)
          }}>
            {Array.isArray(dataSet) && dataSet.map((d, index) => {
              return <div key={index} index={index} style={{display: 'flex', marginTop: 20, alignItems: 'center'}}>
                <div className={`set-cell-row`}>{d.text}</div>
                <Icon type="error" size="large"
                  style={{marginLeft: 20, color: "#C3CBD5", cursor: 'pointer'}}
                  onClick={() => {
                    dataSet.splice(index, 1)
                    setDataSet([...dataSet])
                  }}
                ></Icon>
              </div>
            })}
          </Draggable>
          <div style={{width: 262, marginTop: 20}}>
            <div style={{textAlign: 'center'}}>当前还可以添加<span style={{fontWeight: 'bold', color: '#ff7a24'}}> {limit - dataSet.length} </span>个快捷入口</div>
            <div style={{textAlign: 'center', color: '#999', marginTop: 4}}>(支持上下拖动调整顺序)</div>
          </div>
        </div>
      </div>
      <div className="set-right">
        <div className="set-tap-title">添加入口</div>
        <div className="setTree">
          <Tree checkable onCheck={onCheck} checkedKeys={checkKeys}>
            {getMenuTreeNode(menuTree)}
          </Tree>
        </div>
      </div>
  </div>
  </Dialog>
}