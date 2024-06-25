import React, {useEffect, useState, useRef, useMemo} from 'react'
import { Dialog, Button, Table, Icon, Message } from '@/component'
import DraggableTable from '@/component/DraggableTable'
import { getObjType, deepClone } from 'assets/js'
import Cookie from 'assets/js/cookie'
import { addWatchDom } from '@/component/Table/utils'
const formConfig = { 
  maxHeight: 158
}
export default function DefineSearchSet(props) {
  const cacheKey = props.code + '_' + Cookie.get('accountId')
  const {btnProps, onChange, setFormMaxHeight, form } = props
  const [visible, setVisible] = useState(false)
  const [selectRow, setSelectRow] = useState([])
  const [listData, setListData] = useState([])
  const [formHeightToggle, setFormHeightToggle] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const DragRef = useRef()
  const timer = useRef()
  const defineConfigData = useRef({})
  // const defaultData = useMemo(() => deepClone(props.data), [])
  // 初始化数据
  async function initData(data) {
    const cacheData = await window.defineSearchDb.get(cacheKey)
    let sD = {}
    if (cacheData) {
      sD = getData(Object.assign({}, props.data, cacheData))
    } else {
      sD = getData(data || props.data)
    }
    setSelectRow(sD.filter(f => f.show))
    setListData(sD)
    updateSearch(sD, false)
  }
  useEffect(() => {
    if (String(Object.keys(props.data)) !== String(Object.keys(defineConfigData.current))) {
      defineConfigData.current = props.data
      initData()
    }
  }, [props.data])

  useEffect(async() => {
    typeof setFormMaxHeight === 'function' && setFormMaxHeight(formConfig.maxHeight);
    await initData()
    // 监听form表单dom 变化
    let unWatch = () => {};
    const formDom = form.current && form.current.props && form.current.props.className && document.querySelector(`.${form.current.props.className}`);
    const childNodes = formDom && formDom.childNodes;
    if (formDom && childNodes) {
      
      unWatch = addWatchDom(() => {
        getWatchFormDom(formDom)
      })
    }
    return () => {
      unWatch()
    }
  }, []);
  // 监听form表单dom 的变动
  function getWatchFormDom(formDom) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      let childrenTotalHeight = 0
      formDom.childNodes.forEach(item => {
        childrenTotalHeight += (item && item.scrollHeight || 0)
      })
      if (childrenTotalHeight > formConfig.maxHeight) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
    }, 100)
  }
  // 获取数据
  function getData(data) {
    const newList = []
    getObjType(data) === 'Object' && Object.entries(data).forEach(([key, val]) => {
      newList.push({
        key,
        ...val
      })
    })
    newList.sort((a, b) => a.index - b.index)
    return newList
  }
  function getDataToObject(list) {
    const newData = {}
    Array.isArray(list) && list.forEach(l => {
      newData[l.key] = l
    })
    return newData
  }
  function openSet() {
    setVisible(true)
  }
  function onOk() {
    const tData = [...listData]
    tData.forEach(t => {
      t.show = selectRow.some(s => s.key === t.key)
    })
    tData.sort((a, b) => a.index - b.index)
    setListData(tData)
    updateSearch(tData)
    onClose()
  }
  function onClose() {
    setVisible(false)
  }
  function onCancel() {
    onClose()
    initData()
  }
  function updateSearch(data, isUnCache) {
    const searchData = getDataToObject(data)
    typeof onChange === 'function' && onChange(searchData)
    isUnCache !== false && window.defineSearchDb.set(cacheKey, searchData)
  }
  // 清除缓存
  function clearCache() {
    Dialog.confirm({
      title: '确定清除缓存？',
      content: '清除缓存后，查询字段展示将恢复为默认设置',
      onOk: async() => {
        try{
          await window.defineSearchDb.remove(cacheKey);
          await initData(defineConfigData.current);
          Message.success('清除缓存成功');
          onClose()
        } catch(e) {
          Message.error('清除缓存失败')
        }
      }
    })
  }
  return <span>
    <Button.Group>
      {showMore && <Button onClick={() => {
        setFormHeightToggle((show) => {
          if (show) {
            typeof setFormMaxHeight === 'function' && setFormMaxHeight(formConfig.maxHeight)
          } else {
            typeof setFormMaxHeight === 'function' && setFormMaxHeight(100000)
          }
          return !show
        })
      }}><Icon type={formHeightToggle ? "arrow-up" : "arrow-down"} mr="5"></Icon>更多</Button> || null}
      <Button title="查询设置" iconSize="medium" {...(btnProps || {})} onClick={openSet}><Icon type="set"></Icon></Button>
    </Button.Group>
    <Dialog
      title="查询设置"
      style={{width: 500}}
      visible={visible}
      footer={
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Button s mr="10" onClick={clearCache}>清除缓存</Button>
          <div>
            <Button p mr="10" onClick={onOk}>确定</Button>
            <Button onClick={onCancel}>取消</Button>
          </div>
        </div>
      }
      // onOk={onOk}
      // onCancel={onClose}
      onClose={onCancel}
    >
      <DraggableTable
        ref={DragRef}
        className="small"
        dataSource={listData}
        copyHide
        onChange={(data) => {
          setListData(data)
        }}
        primaryKey="key"
        rowSelection={{
          onChange: (keys, rows) => {
            setSelectRow(rows)
          },
          selectedRowKeys: selectRow.map(s => s.key),
          getProps: record => {
            return {
              disabled: record.required
            }
          }
        }}
      >
          <Table.Column title="序号" width={60} dataIndex='index'></Table.Column>
          <Table.Column title="查询字段（可拖拽排序）" dataIndex='label'></Table.Column>
      </DraggableTable>
    </Dialog>
  </span>
}