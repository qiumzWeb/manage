import React, {useEffect, useState, useRef} from 'react';
import { AForm, Button, Card, Message, Loading, CountTimeDown, AnchorPosition } from '@/component';
import { searchModel, getData, getWaveTypeOptions, isCollectedOrder, isTimeout } from './config';
import { filterNotEmptyData, getTimeStampToHMS, isEmpty } from 'assets/js';
import dayjs from 'dayjs'
require('./app.scss');
App.title = "闪电播集包库位监控"
export default function App(props) {
  const form = useRef()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  // 初始化
  useEffect(() => {
    setTimeout(searchData, 1000)
  }, [])
  // 查询数据
  async function searchData() {
    const searchParams = form.current.getData()
    let init = true
    setLoading(true)
    await getData(filterNotEmptyData(searchParams), res => {
      Array.isArray(res) && setData((preRes) => {
        const newRes = Array.isArray(preRes) && !init ? preRes : []
        init = false
        const SortArr =  newRes.concat(res.map(r => ({
          ...r,
          type: searchParams.type
        })))
        // 按库位号排序
        SortArr.sort((a, b) => a.positionCode - b.positionCode);
        // 按库位状态排序
        SortArr.sort((a, b) => a.sortNo - b.sortNo);
        return SortArr;
      })
    }).catch(e => {
      Message.error(e && e.message || '请求失败')
    })
    setLoading(false)
  }
  // 标题
  function RenderTitle(attrs) {
    const { name, value } = attrs
    return  <div className='fl-card-li text-center card-title'>
      <span className='text-name'>{name}</span>
      {value}
    </div>
  }

  // 左右布局
  function RenderLRContent(attrs) {
    const { left, right, center } = attrs
    return <div className={`fl-card-li fl-card-grid-around`}>
      {left && <div className="cell-box" style={left.flex ? {flex: left.flex} : {flex: 1.5}}>
        <span className='text-name'>
          {left.name}
        </span>
        {left.value}
      </div> || null}
      {center && <div className="cell-box" style={center.flex ? {flex: center.flex} : {}}>
        <span className='text-name'>
          {center.name}
        </span>
        {center.value}
      </div> || null}
      {right && <div className="cell-box" style={right.flex ? {flex: right.flex} : {}}>
        <span className='text-name'>
          {right.name}
        </span>
          {right.value}
      </div> || null}
    </div>
  }

  // 列表布局
  function RenderListContent(attrs) {
    const { name, list, title, defaultList} = attrs
    const renderList = (cellList, key) => <div key={key} className={`fl-card-grid fl-card-grid-${cellList.length}`}>
    {cellList.map((l,i) => {
      return <div className='crad-list-cell' key={i}>{l}</div>
    })}
  </div>
    return <div className='fl-card-li'>
      <div className='text-title'>
        {name}
      </div>
      {title && !isEmpty(list) ? renderList(title) : null}
      {Array.isArray(list) && !isEmpty(list) ? list.map((item, index) => {
        return renderList(item, index)
      }): renderList(defaultList)}
    </div>
  }

  return <div className='flashSowPackageMonitor'>
    <AnchorPosition
      data={data}
      loading={loading}
      contentClassName="flashSowCard"
    >
      <AForm formModel={searchModel} ref={form}>
        <div slot="formCell" prop="searchBtn">
          {({}) => {
            return <Button p mt="31" onClick={searchData}>查询</Button>
          }}
        </div>
      </AForm>
    <div slot="listCell">
      {(d, index) => {
        if (d.type == 1) {
              {/* 异常库位 */}
              return <Card key={index} className='flashSow-card'>
                <Card.Content className='flashSow-card-box'>
                  {!isEmpty(d.waveCode) && isCollectedOrder(d) && <div className='flag-over succ'>已集齐</div> || null}
                  <RenderTitle name="库位号：" value={
                    <>
                  {d.positionCode || '-'}
                    <span className='warn-color'>(异常库位)</span>
                    </>
                  }></RenderTitle>
                  <RenderLRContent
                    left={{name: '集包波次号：', value: <span>
                      {d.waveCode || '-'}
                      {!isEmpty(d.waveCode) && (isCollectedOrder(d) && <span className='flag succ'>已集齐</span> || <span className='flag grad'>未集齐</span>) || null}
                    </span>}}
                    right={{name: '大包总数：', value: d.totalBigbagNum || '-'}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '在库总数：', value: d.inPositionNum || '-'}}
                    right={{name: `大包丢失${d.isLostTailBigbag === false ? '（非尾包）': ''}：`, value: d.lostBigbagCount || '-'}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '集包时长：', value: d.instockDurationTimes && <>
                      {getTimeStampToHMS(d.instockDurationTimes)}
                      {/* <CountTimeDown autoPlay={false} value={d.instockDurationTimes} type="up"></CountTimeDown> */}
                      <span className='warn-color' style={{marginLeft: 10}}>
                      {isTimeout(d) && '(超时效，请重点关注) ' || ''}
                      {/* {!d.isOffShelvesComplete ? '存在未下架包裹' : ''} */}
                      </span>
                    </> || '-', flex: 2,}}
                    right={{value: <span className='warn-color'>
                      {d.isOffShelvesComplete == false ? '(存在未下架包裹)' : ''}
                    </span>}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '波次截单剩余时间：', value: d.kpiEndDate && 
                      ((d.kpiEndDate < 0 ? '超时' : '') + getTimeStampToHMS(Math.abs(d.kpiEndDate)))
                      // <CountTimeDown autoPlay={false} value={d.kpiEndDate}></CountTimeDown>
                     || '-'}}
                    right={{name: '波次类型：', value: Array.isArray(d.waveType) && d.waveType.map(t => getWaveTypeOptions[t]).join('/') || '-'}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '波次总订单数：', value: d.waveOrderNums || '-'}}
                    right={{name: '波次总包裹数：', value: d.wavePackageNums || '-'}}
                  ></RenderLRContent>

                  <RenderLRContent
                    left={{name: '已集齐订单数：', value: d.collectedOrderCount || '-'}}
                    right={{name: '已集齐包裹数： ', value: d.collectPkgCount || '-'}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '未集齐订单数：', value: d.unCollectedOrderCount || '-'}}
                    right={{name: '未集齐包裹数：  ', value: d.unCollectPkgCount || '-'}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '标记少货的订单数：', value: d.tagLostOrderNum || '-'}}
                    right={{name: '标记少货的包裹数：  ', value: d.tagLostPackageNum || '-'}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '标记丢失的尾包数量：', value: d.expTailPkgCount || '-'}}
                    right={{name: '标记丢失的非尾包数量：', value: d.expNotTailPkgCount || '-'}}
                  ></RenderLRContent>
                  {/* <RenderLRContent
                    left={{name: '已异常上架包裹数量：', value: d.xxx || '-'}}
                    right={{name: '未异常上架包裹数量：', value: d.xxx || '-'}}
                  ></RenderLRContent> */}
                  <RenderLRContent
                    left={{name: '可异常上架订单数量：', value: d.expShelvesOrderCount || '-'}}
                    right={{name: '可异常上架包裹数量：', value: d.expShelvesPkgCount || '-'}}
                  ></RenderLRContent>
                  <RenderListContent
                    name="在库大包："
                    list={Array.isArray(d.instockBigbag) && d.instockBigbag.map(item => {
                      return [item.containerCode, item.position, item.instockDateTime]
                    }) || [['-', '-', '-']]}
                  ></RenderListContent>
                  <RenderListContent
                    name="丢失大包："
                    list={Array.isArray(d.lostBigbags) && d.lostBigbags.map(item => {
                      const status = ['未确认', '已确认', '已取消']
                      return [
                        item.containerCode || '-',
                        status[item.confirmType] || '-',
                        item.markTime && dayjs(item.markTime).format('YYYY-MM-DD HH:mm:ss') || '-'
                      ]
                    }) || [['-', '-', '-']]}
                  ></RenderListContent>

                </Card.Content>
              </Card>
            } else {
              {/* 正常库位 */}
              return <Card key={index} className='flashSow-card'>
                <Card.Content className='flashSow-card-box'>
                  {!isEmpty(d.waveCode) && isCollectedOrder(d) && <div className='flag-over succ'>已集齐</div> || null}
                  <RenderTitle name="库位号：" value={d.positionCode || '-'}></RenderTitle>
                  <RenderLRContent
                    left={{name: '集包波次号：', value:<span>
                      {d.waveCode || '-'}
                      {!isEmpty(d.waveCode) && (isCollectedOrder(d) && <span className='flag succ'>已集齐</span> || <span className='flag grad'>未集齐</span>) || null}
                    </span>}}
                    right={{name: '集包进度：', value: (d.inPositionNum || '-') + "/" + (d.totalBigbagNum || '-') || '-'}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '集包时长：', value: d.instockDurationTimes && <>
                      {getTimeStampToHMS(d.instockDurationTimes)}
                      {/* <CountTimeDown autoPlay={false} value={d.instockDurationTimes} type="up"></CountTimeDown> */}
                      <span className='warn-color' style={{marginLeft: 10}}>
                      {isTimeout(d) && '(超时效，请重点关注) ' || ''}
                      {/* {!d.isOffShelvesComplete ? '存在未下架包裹' : ''} */}
                      </span>
                    </> || '-', flex: 2}}
                    right={{value: <span className='warn-color'>
                      {d.isOffShelvesComplete == false ? '(存在未下架包裹)' : ''}
                    </span>}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '波次截单剩余时间：', value: d.kpiEndDate && 
                    <>
                      {d.kpiEndDate < 0 && <span className='warn-color'>超时</span>}
                      {getTimeStampToHMS(Math.abs(d.kpiEndDate))}
                    </>
                    || '-'}}
                    right={{name: '波次类型：', value: Array.isArray(d.waveType) && d.waveType.map(t => getWaveTypeOptions[t]).join('/') || '-'}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '波次总订单数：', value: d.waveOrderNums || '-'}}
                    right={{name: '波次总包裹数：', value: d.wavePackageNums || '-'}}
                  ></RenderLRContent>

                  <RenderLRContent
                    left={{name: '已集齐订单数：', value: d.collectedOrderCount || '-'}}
                    right={{name: '已集齐包裹数： ', value: d.collectPkgCount || '-'}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '未集齐订单数：', value: d.unCollectedOrderCount || '-'}}
                    right={{name: '未集齐包裹数：  ', value: d.unCollectPkgCount || '-'}}
                  ></RenderLRContent>
                  <RenderLRContent
                    left={{name: '标记少货的订单数：', value: d.tagLostOrderNum || '-'}}
                    right={{name: '标记少货的包裹数：  ', value: d.tagLostPackageNum || '-'}}
                  ></RenderLRContent>
                  <RenderListContent
                    name="已集包入区："
                    list={
                      Array.isArray(d.instockBigbag) && d.instockBigbag.map(item => {
                        return [item.containerCode, item.position, item.instockDateTime]
                      }) || [['-', '-', '-']]
                      }
                  ></RenderListContent>
                  <RenderListContent
                    name="已到达："
                    list={
                      Array.isArray(d.arriveBigbag) && d.arriveBigbag.map(item => {
                        return [
                          item.containerCode || '-',
                          item.outSlot || '-',
                          item.outDateTime && dayjs(item.outDateTime).format('YYYY-MM-DD HH:mm:ss') || '-'
                        ]
                      }) || [['-', '-', '-']]
                      }
                  ></RenderListContent>
                  <RenderListContent
                    name="运输中："
                    title={['', '开始运输时间', '顶扫设备', '顶扫时间']}
                    list={
                      Array.isArray(d.transportingBigbag) && d.transportingBigbag.map(item => {
                        return [
                          item.containerCode || '-',
                          item.beginTransTime  && dayjs(item.beginTransTime).format('YYYY-MM-DD HH:mm:ss') || '-',
                          item.recommendSlot || '-',
                          // item.lastScanCode || '-',
                          // item.lastScanTime && dayjs(item.lastScanTime).format('YYYY-MM-DD HH:mm:ss') || '-'
                          item.recommendDateTime && dayjs(item.recommendDateTime).format('YYYY-MM-DD HH:mm:ss') || '-'
                        ]
                      }) || null
                      }
                    defaultList={['-','-', '-', '-']}
                  ></RenderListContent>
                  <RenderListContent
                    name="下架中："
                    list={
                      Array.isArray(d.offShelveOperators) && d.offShelveOperators.map(item => {
                        return [
                          item.containerCode || '-',
                          (item.offShelvesCount || '-') + "/" + (item.currentTotalCount || '-'),
                          (getTimeStampToHMS(item.costTime) || '-'),
                          (getTimeStampToHMS(item.leftTime) || '-'),
                          ((item.displayName || '') + (item.employeeNo ? `(${item.employeeNo})` : '')) || '-',
                        ]
                      }) || null
                    }
                    defaultList={['-', '-', '-', '-', '-']}
                    title={['', '', '拣选时长', '预估时长', '']}
                  ></RenderListContent>
                </Card.Content>
              </Card>
            }
      }}
    </div>
    </AnchorPosition>
  </div>
}