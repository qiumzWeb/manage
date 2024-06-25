import React, {useState, useEffect, useRef} from 'react'
import {Icon} from "@/component"
import HelpTips from '@/component/HelpTips/index'
import './px2rem.scss'
import {thousands} from 'assets/js'
import TableSlider from '../tableSlider'
const columns = [
  {title: 'KPI口径', tips: '【当天日期】  包裹类型   KPI起算开始时间～KPI起算结束时间   KPI达成时间', dataIndex: 'kpiName', width: 200},
  {title: '到达未签', tips: '按照KPI口径，已批次到达一段包裹量-已签收一段包裹量；', dataIndex: 'arriveButNotSignPackageQuantity'},
  {title: '已签未入', tips: '按照KPI口径，已签收一段包裹量-已入库一段包裹量；', dataIndex: 'signButNotInstockPackageQuantity'},
  {title: '已入未上', tips: '按照KPI口径，已入库一段包裹量-已上架一段包裹量；', dataIndex: 'needOnShelvesPackageQuantity'},
]
export default function App(props) {
  const {style, ...attrs} = props
  const data = props.data || {}
  useEffect(() => {

  }, [])
  return <div className='insingle-add-up-box' style={style}>
        <div className='single-add-up-title'>
          {/* <Icon defineType="enter-store" mr="10" ></Icon> */}
          入库
        </div>
        {/* <div className='single-left-title'>入库</div> */}
        <div className='single-add-up-data'>
          <div className='single-add-up-list'>
          <div className='single-add-up-list-cell left'>
            <div className='blod flex-center'>批次到达
            <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
          <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
            {`截止到当天（00:00:00~23:59:59）的统计时间，所有已做批次到达的一段包裹总量；`}
          </pre>
        </HelpTips>
            </div>
            <div className='up-cell-value main'>{thousands(data.batchArrivePackageQuantity || 0)}</div>
          </div>
            <div className='single-add-up-list-cell'>
              <div className='blod flex-center'>签收
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
          <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
            {`截止到当天（00:00:00~23:59:59）的统计时间，所有已做签收的一段包裹总量；`}
          </pre>
        </HelpTips>
              </div>
              <div className='up-cell-value'>{thousands(data.signPackageQuantity || 0)}</div>
              {/* <div>到达未签</div>
              <div className='up-cell-value red'>{thousands(data.arriveButNotSignPackageQuantity || 0)}</div> */}
            </div>
            <div className='single-add-up-list-cell'>
              <div className='blod flex-center'>入库
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
          <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
            {`截止到当天（00:00:00~23:59:59）的统计时间，所有已做入库的一段包裹总量；`}
          </pre>
        </HelpTips>
              </div>
              <div className='up-cell-value'>{thousands(data.instockPackageQuantity || 0)}</div>
              {/* <div>已签未入</div>
              <div className='up-cell-value red'>{thousands(data.signButNotInstockPackageQuantity || 0)}</div> */}
            </div>
            <div className='single-add-up-list-cell'>
              <div className='blod flex-center'>上架
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
          <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
            {`截止到当天（00:00:00~23:59:59）的统计时间，所有已做上架的一段包裹总量；`}
          </pre>
        </HelpTips>
              </div>
              <div className='up-cell-value'>{thousands(data.onShelvesPackageQuantity || 0)}</div>
              {/* <div>已入未上</div>
              <div className='up-cell-value red'>{thousands(data.needOnShelvesPackageQuantity || 0)}</div> */}
            </div>
            <div className='single-add-up-list-cell'>
              <div className='blod flex-center'>上架完成率
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
          <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
            {`与集运宝KPI报表保持一致，已上架一段包裹量/已入库一段包裹量；`}
          </pre>
        </HelpTips>
              </div>
              <div className='up-cell-value'>{(data.onShelvesRate || '0.00')}%</div>
              {/* <div>上架及时率</div>
              <div className='up-cell-value red'>{((data.onShelvesOnTimeRate || 0) * 100).toFixed(2)}%</div> */}
            </div>
            <div className='single-add-up-list-cell'>
              <div className='blod flex-center'>上架及时率
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
          <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
            {`与集运宝KPI报表保持一致，时效内上架一段包裹量/应上架一段包裹量；`}
          </pre>
        </HelpTips>
              </div>
              {/* <div className='up-cell-value'>{((data.onShelvesRate || 0) * 100).toFixed(2)}%</div>
              <div>上架及时率</div> */}
              <div className='up-cell-value red'>{data.onShelvesOnTimeRate || '0.00'}%</div>
            </div>
          </div>
        </div>
        <TableSlider
          style={{height: `calc(100% - ${px2rem(130)})`}}
          data={data.instockKpiDataList || []}
          columns={columns}
        ></TableSlider>
    </div>
}