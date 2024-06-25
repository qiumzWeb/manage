import React, { useEffect, useState, useRef } from 'react';
import { LargeScreenBox, ASelect, Arial, ClampEllipsis, Message, CurrentDate, OverSlider, JumpNumber } from '@/component';
import { getWid, thousands, getTimeStampToHMS } from 'assets/js';
import { useSetTimer } from 'assets/js/ahooks';
import { getMonitorData, StatusConfig } from './config';
require('./scss/px2rem.scss');


FlashSowCollectPackage.title = "闪电播集包库区监控大屏"
export default function FlashSowCollectPackage(props) {
  const [baseData, setBaseData] = useState({})
  const [searchDate, setSearchDate] = useState();
  useEffect(() => {
    getData();
  }, [])

  useSetTimer(getData, 1000 * 60);
  function getData() {
    getMonitorData((resDate) => {
      setSearchDate(resDate);
    }).then(res => {
      if (res) {
        setBaseData(res || {})
      }
    }).catch(e => Message.error(e.message))
  }

  function RenderCard({ title, totalData, listData}) {
    return <LargeScreenBox.Card
      title={title}
      style={{width: '98%', margin: `${px2rem(30)} auto ${px2rem(20)}`, minHeight: `calc(50% - ${px2rem(60)})`}}
    >
      <div className='top-content'>
        <div className='flex-center'>
          <div className='success-c flex-center' style={{marginRight: px2rem(40)}}>
            <LargeScreenBox.Label className="label-btn blue-bg white-c">已集齐库位</LargeScreenBox.Label>
            <div style={{minWidth: px2rem(50)}}>
              <JumpNumber value={totalData.ready || 0} style={{fontSize: px2rem(30)}}></JumpNumber>
            </div>
            
          </div>
          <div className='warn-c flex-center' style={{marginRight: px2rem(40)}}>
            <LargeScreenBox.Label className="label-btn blue-bg white-c">未集齐-超时库位</LargeScreenBox.Label>
            <div style={{minWidth: px2rem(50)}}>
              <JumpNumber value={totalData.notReadyAndTimeout || 0} style={{fontSize: px2rem(30)}}></JumpNumber>
            </div>
            
          </div>
          <div className='white-c flex-center' style={{marginRight: px2rem(40)}}>
            <LargeScreenBox.Label className="label-btn blue-bg white-c">空闲库位</LargeScreenBox.Label>
            <div style={{minWidth: px2rem(50)}}>
              <JumpNumber value={totalData.empty || 0} style={{fontSize: px2rem(30)}}></JumpNumber>
            </div>
          </div>
        </div>

        <div className='flex-center white-c'>
          <div className='flex-center' style={{marginRight: px2rem(16)}}>
            <LargeScreenBox.Label className="warn-color-back label-block"></LargeScreenBox.Label>
            未集齐-超时
          </div>
          <div className='flex-center' style={{marginRight: px2rem(16)}}>
            <LargeScreenBox.Label className="fail-color-back label-block"></LargeScreenBox.Label>
            未集齐-未超时
          </div>
          <div className='flex-center' style={{marginRight: px2rem(16)}}>
            <LargeScreenBox.Label className="success-color-back label-block"></LargeScreenBox.Label>
            已集齐-待播种
          </div>
          <div className='flex-center' style={{marginRight: px2rem(16)}}>
            <LargeScreenBox.Label className="white-color-back label-block"></LargeScreenBox.Label>
            空闲
          </div>
        </div>
      </div>
      <div className='content-list flex-center'>
        {
          Array.isArray(listData) && listData.map((list, index) => {
            return <div key={index} className='f-list-cell' style={{flex: 1}}>
              <div className='f-cell-title title-c'>{list[0]?.deviceCode}</div>
              <div className='flex-center f-cell-list-title'>
                <div style={{flex: 1}}>位号</div>
                <div style={{flex: 2}}>占用时长</div>
              </div>
              <div style={{height: px2rem(300), overflow: 'auto'}}>
                <OverSlider>
                  {list.map((l, i) => {
                    return <div className={`flex-center f-cell-list-item ${StatusConfig[l.status]}`}>
                      <div style={{flex: 1}}>{l.positionCode}</div>
                      <ClampEllipsis style={{flex: 2, fontWeight: 400}}>{!l.empty && l.occupiedTime || '-'}</ClampEllipsis>
                    </div>
                  })}
                </OverSlider>
              </div>
            </div>
          })
        }
      </div>
    </LargeScreenBox.Card>
  }

  return <LargeScreenBox
    title="闪电播集包库区监控"
    subLeft={<CurrentDate value={searchDate}></CurrentDate>}
    subRight={<ASelect value={getWid()} isDetail></ASelect>}
    className="flash-sow-collect-package"
  >
    {RenderCard({
      title: '正常集包区',
      totalData: baseData.normalData || {},
      listData: baseData.normalDeviceDataList || []
    })}
    {RenderCard({
      title: '异常集包区',
      totalData: baseData.abnormalData || {},
      listData: baseData.abnormalDeviceDataList || []
    })}
  </LargeScreenBox>
}