import React, {useState, useEffect, useRef} from 'react'
import Echarts from 'assets/js/charts'
import {Icon} from "@/component"
import HelpTips from '@/component/HelpTips/index'
import './px2rem.scss'
import {thousands} from 'assets/js'
import moment from 'moment'
export default function App(props) {
  const boxRef = useRef()
  const [tagStatus, setTagStatus] = useState(0)
  const data = props.data || {}
  return <div style={{height: '100%'}}>
    <div className='store-top-box'>
      <div className='s-t-title'>
        库存监控
        <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: 'isRemXl'}}>
          <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
{`实际值：截止统计时间内，已上架一段包裹量总和；
预警值：取基础配置中预警值配置中的库存总量预警值；
首单实际：截止统计时间内，已入库的首单单量；
首单预警：基础配置中预警值配置中的首单预警值（全仓维度），也需要按照巷道维度进行维护，聚合出全仓维度；`
        }</pre>
        </HelpTips>
      </div>
      <div className="s-t-data">
        <div className='s-t-tap'>
          <div className={"s-tag " + (tagStatus==0 && 'active' || '')}>
            <div>实际 <span className='large'>{thousands(data.totalPackageCount || 0)}</span></div>
            <div>预警 <span>{thousands(data.totalPackageStorageCapacityWarning || 0)}</span></div>
          </div>
          <div className={"s-tag " + (tagStatus==1 && 'active' || '')}>
            <div>首单实际 <span className='large'>{thousands(data.firstPackageStorageCount || 0)}</span></div>
            <div>首单预警 <span>{thousands(data.firstPackageStorageCapacityWarning || 0)}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div style={{height: `calc(100% - ${px2rem(218)})`}}>
      {props.children}
    </div>
    <div className='s-t-out'>
        超12天包裹量 <span>{thousands(data.over12DayPackageCount || 0)}</span>
      </div>
    <div className="store-bottom-list">
      <div className='s-bottom-cell'>
        <div className='cell-title'>利用率</div>
        <div className='cell-value'>{data.warehouseTotalPackageRate || '0.00'}%</div>
        {/* <div className='cell-small'>环比昨日 <span> 13% </span><Icon defineType="data-up"></Icon></div> */}
      </div>
      <div className='s-bottom-cell'>
        <div className='cell-title'>合单比</div>
        <div className='cell-value'>{data.warehouseMergeRate || '0.00'}</div>
        {/* <div className='cell-small'>环比昨日 <span> 13% </span><Icon defineType="data-up"></Icon></div> */}
      </div>
      <div className='s-bottom-cell'>
        <div className='cell-title'>尾包率</div>
        <div className='cell-value'>{data.isTailRate || '0.00'}%</div>
        {/* <div className='cell-small'>环比昨日 <span> 13% </span><Icon defineType="data-up"></Icon></div> */}
      </div>
    </div>
  </div>
}