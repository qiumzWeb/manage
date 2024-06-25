import React, {useState, useRef, useEffect} from 'react'
import { Message, Button, Grid, Card, Dialog } from '@/component'
import ASearchForm from '@/component/ASearchForm'
import OutStoreDetail from './outStoreDetail'
import { onEnter } from 'assets/js/utils'
import { getEmptyList, isEmpty } from 'assets/js'
import Cookie from 'assets/js/cookie'
import $http from 'assets/js/ajax'
import { fmtTime } from '@/report/utils'
import dayjs from 'dayjs'
require('./index.scss')
const { Row, Col } = Grid
const SplitValue = 5
let timer = null
let isTimer = true
let searchparams = {}
export default function App(props) {
  const isActive = useRef(props.isActive)
  const [wallData, setWallData] = useState([])
  const [selectedSlot, setSelectedSlot] = useState({})
  const [noticeList, setNoticeList] = useState([])
  const [baseData, setBaseData] = useState({})
  const query = useRef()
  const noticeRef = useRef()
  const outStoreDetailRef = useRef()
  useEffect(() => {
    isActive.current = props.isActive
  }, [props.isActive])
  useEffect(() => {
    isTimer = true
    return () => {
      isTimer = null
      clearTimeout(timer)
    }
  }, [])
  // 查询拦截
  function beforeSearch(req, action) {
    // 手动查询 清除历史查询
    if (action == 1) {
      clearTimeout(timer)
    }
    const data = req.data
    if (!data || !data.wallCode) return '请输入分拣墙号'
    searchparams = data
    return {
      ...req,
      url: req.url.replace('{warehouseId}', Cookie.get('warehouseId')).replace('{wallCode}', data.wallCode)
    }
  }
  // 获取亮灯通知
  async function getSlotCollectCompalated(list) {
    console.log('检查查询参数', searchparams)
    if (!isEmpty(searchparams)) {
      clearTimeout(timer)
      try {
        const res = await $http({
          url: `/noneShelvesSortingWall/slotCollectComplated/${Cookie.get('warehouseId')}/${searchparams.wallCode}`,
          method: 'get',
        })
        if (Array.isArray(res)) {
          const len = res.length
          // 最多显示100条最新记录
          // const historyList = len > 100 ? [] : noticeList.slice(len - 100)
          const noticeData = [
            // ...historyList,
            ...res.map(r => ({...r, date: fmtTime(dayjs(res.responseDate), 'YYYY-MM-DD HH:mm:ss')}))
          ]
          const wdata = list || wallData
          setWallData(wdata.map(w => {
            if (noticeData.some(n => n.slot == w.slot)) {
              return {
                ...w,
                finished: 1
              }
            }
            return {...w}
          }))
          setNoticeList(noticeData)
          setTimeout(() => {
            noticeRef.current.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
          }, 500)
        }
      } catch(e) {
        console.log(e)
      } finally {
        timer = setTimeout(() => refresh(), 1000 * 60 * 1)
      }

    }
  }
  // 查询结果
  function formatData(res) {
    const list = res && res.sortingWallSlotVOList
    if (res) {
      Array.isArray(list) && setWallData(list)
      setBaseData(res)
    } 
    // 定时查询
    if (isTimer) {
      timer = setTimeout(() => getSlotCollectCompalated(list), 0)
    }
  }

  function refresh(data) {
    // tab 页切走时，不处理数据
    if (!isActive.current) return;
    query.current && query.current.refresh && query.current.refresh(data)
  }
  // 完结格口
  // 已集齐
  const isFinishedMessage = (selectSlot) => {
    return <div>
    确认完结格口 <span className='warn-color'>{selectSlot.slot}</span>
    {selectSlot.shouldScanPkgNum ? <span>
      , 包裹数量：<span className='warn-color'>{selectSlot.shouldScanPkgNum}</span> 
    </span> : ''}
    </div>
  }
  // 未集齐
  const notFinishedMessage = (selectSlot) => {
    return <div>
    当前格口未集齐，确认完结格口 <span className='warn-color'>{selectSlot.slot}</span>
    {selectSlot.shouldScanPkgNum ? <span>
      , 正常包裹数量：<span className='warn-color'>{selectSlot.shouldScanPkgNum}</span>
      , 已扫描包裹数量：<span className='warn-color'>{selectSlot.slotScanPkgNum}</span>
    </span> : ''}
    </div>
  }
  function getFinishSlot() {
    if (isEmpty(selectedSlot)) return Message.warning('请选择需要完结的格口！')
    Dialog.confirm({
      title: '完结格口',
      content: selectedSlot.shouldScanPkgNum == selectedSlot.slotScanPkgNum ? isFinishedMessage(selectedSlot) : notFinishedMessage(selectedSlot),
      onOk: async() => {
        try {
          await $http({
            url: '/noneShelvesSortingWall/finishSlot',
            method: 'post',
            data: {
              warehouseId: Cookie.get('warehouseId'),
              wallCode: searchparams.wallCode,
              taskCode: baseData.taskCode,
              slotNo: selectedSlot.slot,
              solutionId: baseData.solutionId
            }
          })
          Message.success('完结格口成功')
          setSelectedSlot({})
          refresh()
        } catch(e) {
          Message.error(e.message)
        }
      },
    })
  }

  return <div className='sorting-wall-noshelf'>
    <ASearchForm
      ref={query}
      initSearch={false}
      formatSearchParams={beforeSearch}
      formatData={formatData}
      searchOptions={{
        url: '/noneShelvesSortingWall/queryWall/{warehouseId}/{wallCode}',
        method: 'post',
      }}
      searchModel={{
        wallCode: {
          label: '',
          fixedSpan: 16,
          attrs: {
            placeholder: '请输入分拣计划名称',
            onKeyDown: onEnter(e => refresh()),
            ref: ref => ref && ref.focus()
          }
        }
      }}
    >
      <div slot="tools">
        <Button mr="10" type="secondary" disabled={!selectedSlot.shouldScanPkgNum} onClick={getFinishSlot}>完结格口</Button>
        <Button onClick={() => {
          outStoreDetailRef.current.open()
        }}>查看出库堆垛架</Button>
      </div>
      <div style={{marginTop: 10}}>
        <Row gutter="12">
          <Col span="16">
            <Card definedStyle={{minWidth: 500, marginBottom: 10, height: 'calc(100vh - 340px)', overflow: 'auto'}}>
              <Card.Header title="分拣墙"></Card.Header>
              <Card.Divider inset></Card.Divider>
              <Card.Content style={{overflow: 'auto', maxHeight: 'calc(100vh - 414px)'}}>
                {/* <Row gutter="12"> */}
                {getEmptyList(Math.ceil(wallData.length / SplitValue)).map((_,i) => {
                  return <Row gutter="12">
                    {getEmptyList(SplitValue).map((_,index) => {
                      const item = wallData[i * SplitValue + index]
                      if (!item) return <Col></Col>
                      return <Col>
                          <Card definedStyle={{marginBottom: 10, color: item.finished ? '#fff' : '#333', cursor: 'pointer'}}
                            className={`${item.finished ? 'succ-back' : ''} ${selectedSlot.slot == item.slot ? 'selected' : ''}`}
                            onClick={() => setSelectedSlot(item)}
                          >
                            <Card.Content style={{color: (item.finished) ? '#fff' : '#333',}}>
                              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, height: 80}}>
                              {item.slotScanPkgNum || 0}
                              </div>
                            </Card.Content>
                            <Card.Divider></Card.Divider>
                            <Card.Actions style={{textAlign: 'center', fontSize: 20 }}>{item.slot}</Card.Actions>
                          </Card>
                      </Col>
                    })}
                  </Row>
                })}
                {/* </Row> */}
              </Card.Content>
            </Card>
          </Col>
          <Col>
            <Card definedStyle={{minWidth: 300, height: 'calc(100vh - 340px)', overflow: 'auto'}}>
              <Card.Header title="通知"></Card.Header>
              <Card.Divider inset></Card.Divider>
              <Card.Content  style={{overflow: 'auto', maxHeight: 'calc(100vh - 414px)'}}>
                <div ref={noticeRef} style={{fontSize: 16}}>
                  {noticeList.map((item, index) => {
                    return <div key={index} style={{marginBottom: 30}}>
                      <div style={{fontWeight: 'bold', marginBottom: 10}}>{item.date}</div>
                      <div>分拣墙： 
                        <span className='warn-color'>{item.wallCode}</span>
                        {'→'}
                        <span className='downcenter_FAIL' style={{fontWeight: 'bold', fontSize: 25, marginLeft: 5}}>{item.slot}</span> 
                        <span style={{marginLeft: 5}}>格口订单已集齐;</span>
                      </div>
                    </div>
                  })}
                </div>
              </Card.Content>
            </Card>
          </Col>
        </Row>
      </div>
    </ASearchForm>
    <OutStoreDetail ref={outStoreDetailRef}></OutStoreDetail>
  </div>
}