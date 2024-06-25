import React from 'react';
import { thousands, isTrue } from 'assets/js'
require('./px2rem.scss')
export default function App(props) {
  const data = props.data || {}
  // data.sort((a, b) => {
  //   const getType = type => isTrue(type) ? type : -1
  //   return (a && getType(a.turnoverType)) - (b && getType(b.turnoverType))
  // })
  // 
  return <div className='noshelf-monitor'>
    <div className='noshelf-title'>蓄水监控</div>
    <div className="noshelf-count">
      {/* {data.map((d, index) => {
        return <div key={index} className={isTrue(d.turnoverType) ? 'noshelf-type' : 'noshelf-total'}>
        <span>{d.turnoverTypeName || ''}</span>{thousands(d.turnoverTypePackageNum)}
      </div>
      })} */}
      <div className='noshelf-total'><span>总量</span>{thousands(data.totalPackageNum)}</div>
      <div className='noshelf-type'><span>特</span>{thousands(data.toppriorPackageNum)}</div>
      <div className='noshelf-type'><span>快</span>{thousands(data.priorPackageNum)}</div>
      <div className='noshelf-type'><span>中</span>{thousands(data.belowPackageNum)}</div>
      <div className='noshelf-type'><span>慢</span>{thousands(data.normalPackageNum)}</div>
      <div className='noshelf-type'><span>无</span>{thousands(data.nonePackageNum)}</div>
    </div>
  </div>
}