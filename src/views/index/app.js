import React, {useEffect, useState, useRef} from 'react'
import { Icon, CnIcon } from '@/component'
import { getMonitorData, getInstockOutstock } from './api'
import FullScreen from '@/component/FullSreen'
import { useActivate } from 'react-activation'
require('./scss/px2rem.scss')
// 快捷入口
// import SetFastEntry from './component/setFastEntry'
// 蓄水监控
import NoshelfMonitor from './component/noshelfMonitor'
// 库存总量
import StoreTotal from './component/storeTotal'
// 入库累计总量
import InStoreSingleAddUp from './component/inStoreSingleAddUp'
// 出库累计总量
import OutStoreSingleAddUp from './component/outStoreSingleAddUp'
// 分时作业监控
import JobMonitor from './component/jobMonitor'
// 分区库容情况
import StorageCapacity from './component/storageCapacity'
// 待作业量&异常监控
import AbnormalMonitor from './component/abnormalMonitor'
App.title = '首页'
let timer = null
export default function App(props) {
  const [MonitorData, setMonitorData] = useState({})
  const [InOrOutStore, setInOrOutStore] = useState({})
  const [loading, setLoading] = useState(false)
  const [updateDate,setUpdateDate] = useState('')
  const indexBox = useRef()
  useActivate(() => {
    getData()
  })
  useEffect(() => {
    // 加载数据
    getData()
    return () => {
      clearTimeout(timer)
    }
  }, [])
  // 获取数据
  async function getData() {
    clearTimeout(timer)
    if (loading) return
    setLoading(true)
    try {
      getInstockOutstock().then(d => {
        // 加载出入库
        setInOrOutStore(d)
      })
      const res = await getMonitorData()
      // Object.entries(res.currentDayData).forEach(([key, val]) => (res.currentDayData[key] = val + 900000))
      setMonitorData(res || {})
    } catch(e) {
      // Message.error(e.message || e)
    } finally {
      setLoading(false)
      timer = setTimeout(() => {
        getData()
        clearTimeout(timer)
      }, 10 * 60 * 1000)
    }
  }
  console.log(indexBox, '布局框')
  return <div style={{overflow: 'auto', height: '100%', fontSize: px2rem(14)}}>
  <div className="indexPage" ref={indexBox}>
    <div className="in-top">
      <div className="in-t-left">
        <span className="in-title">核心指标监控</span>
        <span>{MonitorData.currentDayData && MonitorData.currentDayData.dataTime || ''}</span>
        <span className="refresh link" onClick={() => getData()}>
          <CnIcon type={loading && "loading" || "refresh"} mr={px2rem(6)} className="isRemXl"></CnIcon>刷新
        </span>
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <FullScreen node={indexBox && indexBox.current} className="isRemXl"></FullScreen>
      </div>
    </div>
    <div className="pageTop">
      <div className="t-l-p bbox">
        <StoreTotal data={MonitorData} chartData={MonitorData}>
        <StorageCapacity data={MonitorData.districtGroupStorageCapacityList} totalData={MonitorData.totalDistrictGroupStorageCapacity}></StorageCapacity>
        </StoreTotal>
      </div>
      <div className="t-m-p">
        <div className='t-m-p-top'>
          <div style={{flex: 1}}>
              {/* <div className='tmp-all-total'>揽收~集运批次到达包裹量<span>343434344</span></div> */}
              <InStoreSingleAddUp data={InOrOutStore}></InStoreSingleAddUp>
          </div>
          {/* <SetFastEntry></SetFastEntry> */}
          <NoshelfMonitor data={MonitorData}></NoshelfMonitor>
        </div>
        <OutStoreSingleAddUp style={{marginTop: px2rem(5)}} data={InOrOutStore}></OutStoreSingleAddUp>
      </div>
    </div>
    <div className="pageBottom">
      <div className="t-l-b bbox">
        <JobMonitor data={MonitorData.timeSharingOperationMonitorVOs}></JobMonitor>
      </div>
      <div className="t-r-b">
        <AbnormalMonitor
          data={MonitorData.needDoTaskAndExceptionMonitorVOs}
          totalData={[
            {...(MonitorData.sumNeedDoTaskAndExceptionMonitorVO || {}), timeInterval: 'T ~ T-4'},
            {...(MonitorData.sumNeedDoTaskAndExceptionMonitor30DayVO || {}), timeInterval: 'T ~ T-30'}
          ]}
        ></AbnormalMonitor>
      </div>
    </div>
  </div>
  </div>
}