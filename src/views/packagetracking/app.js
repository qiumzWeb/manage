import React, {useEffect, useState, useRef} from 'react'
import { Button, Message, Tab, Loading, Collapse, Table, Dialog, Card } from '@/component'
import AForm from '@/component/AForm'
import { isEmpty, isTrue } from 'assets/js'
import { searchModel, SecondOrderInfoModel, firstPackageColumns, SecondOrderTrackColumns } from './config'
import { getQueryList, getPackageTrack } from './api'
import TrackList from './track'
App.title="包裹轨迹跟踪"
let dataList = {}
export default function App(props) {
  const [loading, setLoading] = useState(false)
  const [packageList, setPackageList] = useState({})
  const [activeKey, setActiveKey] = useState('')
  const formRef = useRef()
  // 获取
  function getCodeList(searchCode){
    return searchCode && searchCode.split(/\n|\s/).filter(e => e) || []
  }
  // 查询包裹
  async function onSearch(key) {
    const data = formRef.current.getData()
    data.noList = [...new Set(getCodeList(data.noList))]
    if (isEmpty(data.warehouseId)) return Message.warning('请选择仓库')
    if (isEmpty(data.noList)) return Message.warning('请输入查询单号')
    if(!key) {
      if (data.noList.length > 10) return Message.warning('最多支持10个单号查询')
      dataList = {}
      setActiveKey(data.noList[0])
    } else {
      setActiveKey(key)
    }
    if (!(isTrue(key) && dataList[key])) {
      await getPackageInfo(data, key)
    }
  }
  // 获取包裹信息
  async function getPackageInfo(data, No) {
    const packageNoList = data.noList;
    No = No || packageNoList[0];
    const index = packageNoList.findIndex(p => p == No);
    const lastNo = {};
    (index + 1 < packageNoList.length) && packageNoList.slice(index + 1).forEach(p => lastNo[p] = null);
    setLoading(true);
    try {
      const res = await getQueryList({
        ...data,
        noList: [No]
      })
      dataList = {
        ...dataList,
        [No]: res || [],
        ...lastNo
      }
      setPackageList(dataList)
    } catch(e) {
      if (isEmpty(dataList)) {
        dataList = {
          [No]: null,
          ...lastNo
        }
      }
      setPackageList(dataList)
      Message.error(No + ' : '+ e.message)
    } finally {
      setLoading(false)
    }
  }
  return <div className='pcs-packageTracking' style={{position: 'relative'}}>
    <AForm ref={formRef} formModel={searchModel}></AForm>
    <Button type="primary" onClick={() => onSearch()}>查询</Button>
    <Loading visible={!!loading} style={{left: '45%', top: '50%', position: 'absolute'}}></Loading>
    <div style={{width: '100%', minHeight: 500, border: '1px solid #ccc', marginTop: 10, padding: 10}}>
      <Tab onChange={(key) => {onSearch(key)}} activeKey={activeKey}>
        {
          Object.entries(packageList).map(([k, pl]) => {
            return <Tab.Item key={k} title={<span style={{fontWeight: 'bold'}}>【{k}】</span>}>
            {
              (isEmpty(pl) || pl.length == 1)  ? <TrackList packageKey={k} data={pl && pl[0]}></TrackList> : <Tab>
                {
                  Array.isArray(pl) && pl.map(p => {
                    return <Tab.Item key={p.orderDetail.delegateNo} title={p.orderDetail.delegateNo}>
                      <TrackList packageKey={k} data={p}></TrackList>
                    </Tab.Item>
                  })
                }
              </Tab>
            }
            </Tab.Item>
          })
        }
      </Tab>
    </div>
  </div>
}