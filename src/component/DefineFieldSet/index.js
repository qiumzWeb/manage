import React, {useEffect, useState, useRef, useMemo} from 'react'
import { Dialog, Button, Table, Icon, NumberPicker, Message } from '@/component'
import DraggableTable from '@/component/DraggableTable'
import { getObjType, deepClone, deepAssign, getUuid } from 'assets/js'
import Cookie from 'assets/js/cookie'
import ATipsCard from '@/component/ATipsCard'
import ArrorToChildSet from './ArrorToChildSet'
import Bus from 'assets/js/bus'
import { columns } from './config'

const editData = {}
export default function DefineFieldSet(props) {
  const cacheKey = props.code + '_' + Cookie.get('accountId')
  const {btnProps, onChange, inset } = props
  const [visible, setVisible] = useState(false)
  const [selectRow, setSelectRow] = useState([])
  const [listData, setListData] = useState([])
  const childRef = useRef()
  const defaultData = useMemo(() => deepClone(props.data), [])
  const realData = useRef(props.data)
  realData.current = props.data
  // 初始化数据
  async function initData(data) {
    Bus.setState({
      [cacheKey]: {}
    })
    const sD = await getListData(data)
    setSelectRow(sD.filter(f => f.show))
    setListData(sD)
    updateField(sD)
  }
  useEffect(initData, [])
  // 表头变动时更新数据
  useEffect(async() => {
    const sD = await getListData()
    setSelectRow(sD.filter(f => f.show))
    setListData(sD)
  }, [props.data])
  // 打开设置
  function openSet() {
    setVisible(true)
    editData[cacheKey] = {}
  }
  // 编辑后，未点确定 时 数据重置
  async function resetData() {
    const sD = await getListData()
    setSelectRow(sD.filter(f => f.show))
    setListData(sD)
    delete editData[cacheKey]
  }
  // 合并缓存数据
  async function getListData(data) {
    const cacheData = inset ? null : await window.defineFieldDb.get(cacheKey)
    const propsData = data || realData.current
    let sD = []
    if (cacheData) {
      sD = getData(Object.entries(propsData).reduce((a, [key, b]) => {
          a[key] = deepAssign({}, b, cacheData[key])
          return a
      }, {}))
    } else {
      sD = getData(propsData)
    }
    // 保存数据
    updateBusStoreData(sD)
    return sD
  }
  // 更新bus数据
  function updateBusStoreData(list) {
    // 保存数据
    const busStore = {}
    list.forEach(item => {
      busStore[item.key] = item
    })
    Bus.setState({
      [cacheKey]: deepAssign(Bus.getState(cacheKey) || {}, busStore)
    })
  }
  // 对象转成数组
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
  // 数组转成对象
  function getDataToObject(list) {
    const newData = {}
    Array.isArray(list) && list.forEach(l => {
      newData[l.key] = l
    })
    return newData
  }
  // 确认设置
  async function onOk() {
    try {
      const tData = getData(Bus.getState(cacheKey))
      tData.forEach(t => {
        t.show = selectRow.some(s => s.key === t.key)
        const edit = editData[cacheKey]
        Object.keys(columns).forEach(dataIndex => {
          if (edit[t.key] && edit[t.key].hasOwnProperty(dataIndex)) {
            t[dataIndex] = edit[t.key][dataIndex]
          }
        })
  
      })
      tData.sort((a, b) => a.index - b.index)
      await updateDbData(tData)
      onClose()
      updateField(tData)
    } catch(e) {console.log(e, 99)}

  }
  // 关闭
  function onClose() {
    setVisible(false)
    resetData()
  }
  // 更新表头
  function updateField(data) {
    const searchData = getDataToObject(data)
    typeof onChange === 'function' && onChange(searchData)
  }
  // 更新缓存
  async function updateDbData(data) {
    if (inset) return
    const searchData = getDataToObject(data)
    await window.defineFieldDb.set(cacheKey, getDbData(searchData))
  }
  // 处理缓存数据，react.element 无法存入缓存需删除
  function getDbData(data) {
    if (getObjType(data) !== 'Object') return data
    const cd = deepClone(data)
    Object.values(cd).forEach(d => {
      d.label && (d.label.$$typeof) && (delete d.label)
      if (d.children) {
        d.children = getDbData(d.children)
      }
    })
    return cd
  }
  // 多表头渲染
  function CellRender(val, index, record) {
    if (getObjType(record.children) === 'Object') {
      return <ArrorToChildSet
        cacheKey={cacheKey}
        name={[record.key]}
        container={childRef}
        data={record.children}
        value={val}
        onChange={(data) => {
          // 更新bus 数据
          const currentBusData = Bus.getState(cacheKey)
          currentBusData[record.key].children = data
          Bus.setState({[cacheKey]: currentBusData})
        }}
      ></ArrorToChildSet>
    }
    return val
  }
  // 更多设置
  const SetList = [
    {text: '清除缓存', onClick: async () => {
      Dialog.confirm({
        title: '确定清除缓存？',
        content: '清除缓存后，列表字段展示将恢复为默认设置',
        onOk: async() => {
          try{
            await window.defineFieldDb.remove(cacheKey);
            await initData(defaultData);
            Message.success('清除缓存成功');
            document.body.click();
          } catch(e) {
            Message.error('清除缓存失败')
          }
        }
      })
    }}
  ]
  const MoreSet = (
    <ATipsCard
      PopUpPisition={{bottom: 10}}
      trigger={<Icon s="m" className="main-color" style={{cursor: 'pointer'}} mr="10" type="set" title="更多设置"></Icon>}
    >
      <div style={{background: '#fff', color: '#333', padding: 10}}>
        <div>{SetList.map((item, index) => <Button key={index} text onClick={item.onClick}>
          <Icon
            type="arrow-right"
            className="main-color"
            style={{fontWeight: 'bold'}}
          ></Icon>
          {item.text}
        </Button>)}
        </div>
      </div>
    </ATipsCard>
  );
  // 自定义列设置
  const DefineFieldSet = (<div style={{display: 'flex', alignItems: 'flex-end'}} onClick={e => e.stopPropagation()}>
  <div style={{background: '#fff'}}>
  <DraggableTable
    style={{width: 600}}
    className="small"
    inset
    copyHide
    dataSource={listData}
    primaryKey="key"
    onChange={(data) => {
      updateBusStoreData(data)
      setListData(data)
    }}
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
      <Table.Column title="排序" width={50} dataIndex='index'></Table.Column>
      {Object.entries(columns).map(([dataIndex, item], cindex) => {
        return <Table.Column title={item.title} width={item.width} key={cindex} dataIndex={dataIndex} cell={(val, index, record) => {
          if (record.children) return '-'
          const Com = item.component
          return  dataIndex == 'lock' ? <Com {...(item.attrs || {})} isDetail={record.required} value={val} onChange={num => {
            const edit = editData[cacheKey]
            if (!edit[record.key]) {
              edit[record.key] = {}
            }
            edit[record.key][dataIndex] = num
          }}></Com> : <Com {...(item.attrs || {})} defaultValue={val} onChange={num => {
            const edit = editData[cacheKey]
            if (!edit[record.key]) {
              edit[record.key] = {}
            }
            edit[record.key][dataIndex] = num
          }}></Com>
        }}></Table.Column>
      })}
      <Table.Column title="列表字段（可拖拽排序）" dataIndex='label' cell={CellRender}></Table.Column>
  </DraggableTable>
  </div>
  {/* 子组件渲染 */}
  <div style={{minHeight: '100%'}} ref={childRef}></div>
</div>);

  return <ATipsCard
    PopUpPisition={{bottom: 10}}
    onShow={openSet}
    onClose={onClose}
    trigger={visible && <div>
      {MoreSet}
      <Button type="primary" mr="10" onClick={onOk}>确定</Button>
      <Button mr="10" onClick={onClose}>取消</Button>
    </div> || <Button iconSize="medium" {...(btnProps || {})}>
      <Icon mr="5" type="set"></Icon>
      表格列自定义设置
    </Button>}
  >
    {DefineFieldSet}
  </ATipsCard>
}