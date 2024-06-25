import React, { useState, useEffect, useRef } from 'react';
import ComputeBgImg from 'assets/imgs/compute-bg.png';
import { getWName, getToTT } from 'assets/js';
import dayjs from 'dayjs'


export default function UPPHHeader (props) {
  const { data } = props;

  return <div className='flex-center' style={{
    width: '100%',
    height: 80,
    backgroundColor: '#F6F7FC',
    backgroundImage: `url(${ComputeBgImg})`,
    backgroundPosition: 'top right 10px',
    backgroundRepeat: 'no-repeat',
    justifyContent: 'space-between',
    color: "#666",
    borderRadius: 10,
    marginBottom: 20
  }}>
    <div style={{paddingLeft: 32}}>
      <div>{dayjs(data.reportDate || Date.now()).format("YYYY-MM-DD")} {(getToTT(data.reportTime) || '00') + ":00"}</div>
      <div style={{color: '#333', fontSize: 20}}>{getWName(data.warehouseId)}-动态UPPH</div>
    </div>
    <div style={{paddingRight: 232, textAlign: 'right'}}>
      <div>截止目前全仓综合人数</div>
      <div className='success-color' style={{fontSize:28 }}>{data.upphMasterPlan && data.upphMasterPlan.warehouseComprehensiveEffect || '-'}</div>
    </div>
  </div>
}