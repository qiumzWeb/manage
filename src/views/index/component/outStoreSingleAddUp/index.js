import React, {useState, useEffect, useRef} from 'react'
import {Icon} from "@/component"
import HelpTips from '@/component/HelpTips/index'
import './px2rem.scss'
import {thousands} from 'assets/js'
import TableSlider from '../tableSlider'
const columns = [
  {title: 'KPI口径', dataIndex: 'kpiName', tips: '【当天日期】  包裹类型   KPI起算开始时间～KPI起算结束时间   KPI达成时间', width: 200},
  {title: '已通知未下架', dataIndex: 'noticeButNotOffShelvesPackageQuantity', tips: '按照KPI口径，已出库通知一段包裹量-已下架一段包裹量；'},
  {title: '已下未播', dataIndex: 'offShelvesNotAllotPackageQuantity', tips: '按照KPI口径，已下架一段包裹量-已播种一段包裹量；'},
  {title: '已播未合', dataIndex: 'allotNotMergePackageQuantity', tips: '按照KPI口径，已播种一段包裹量-已合箱一段包裹量；'},
  {title: '已合未组包', dataIndex: 'mergeNotOutStockPackageQuantity', tips: '按照KPI口径，已合箱一段包裹量-已组包一段包裹量；'},
]
export default function App(props) {
  const {style, ...attrs} = props
  const data = props.data || {}
  useEffect(() => {

  }, [])
  return <div className='outsingle-add-up-box' style={style}>
        <div className='single-add-up-title'>
          {/* <Icon defineType="out-store" mr='10'></Icon> */}
          出库
        </div>
        {/* <div className='single-left-title'>出库</div> */}
        <div className='single-add-up-data'>
          <div className='single-add-up-list'>
          <div className='single-add-up-list-cell'>
            <div className='blod flex-center'>出库通知
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
              <span style={{fontSize: px2rem(14)}}>截止到当天（00:00:00~23:59:59）的统计时间，所有已接收到出库通知的一段包裹总量；</span>
              </HelpTips>
            </div>
            <div className='up-cell-value main'>{thousands(data.outStockNoticePackageQuantity || 0)}</div>
          </div>
            <div className='single-add-up-list-cell'>
              <div className='blod flex-center'>下架
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
                <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
                  {`截止到当天（00:00:00~23:59:59）的统计时间，所有已做下架的一段包裹总量；`}
                </pre>
              </HelpTips>
              </div>
              <div className='up-cell-value'>{thousands(data.offShelvesPackageQuantity || 0)}</div>
              {/* <div>已通知未下</div>
              <div className='up-cell-value red'>{thousands(data.noticeButNotOffShelvesPackageQuantity || 0)}</div> */}
            </div>
            <div className='single-add-up-list-cell'>
              <div className='blod flex-center'>播种
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
                  <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
                    {`截止到当天（00:00:00~23:59:59）的统计时间，所有已做播种的一段包裹总量；`}
                  </pre>
                </HelpTips>
              </div>
              <div className='up-cell-value'>{thousands(data.allotPackageQuantity || 0)}</div>
              {/* <div>已下未播</div>
              <div className='up-cell-value red'>{thousands(data.offShelvesNotAllotPackageQuantity || 0)}</div> */}
            </div>
            <div className='single-add-up-list-cell'>
              <div className='blod flex-center'>合箱
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
                <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
                  {`截止到当天（00:00:00~23:59:59）的统计时间，所有已做合箱的一段包裹总量；`}
                </pre>
              </HelpTips>
              </div>
              <div className='up-cell-value'>{thousands(data.mergePackageQuantity || 0)}</div>
              {/* <div>已播未合</div>
              <div className='up-cell-value red'>{thousands(data.allotNotMergePackageQuantity || 0)}</div> */}
            </div>
            <div className='single-add-up-list-cell'>
              <div className='blod flex-center'>出库
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
                <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
                  {`截止到当天（00:00:00~23:59:59）的统计时间，所有已做出库的一段包裹总量；`}
                </pre>
              </HelpTips>
              </div>
              <div className='up-cell-value'>{thousands(data.outStockPackageQuantity || 0)}</div>
              {/* <div>已合未出库</div>
              <div className='up-cell-value red'>{thousands(data.mergeNotOutStockPackageQuantity || 0 )}</div> */}
            </div>
            <div className='single-add-up-list-cell'>
              <div className='blod flex-center'>出库完成率
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
                <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
                  {`与集运宝KPI报表保持一致，已出库一段包裹总量/已下发出库通知一段包裹总量；`}
                </pre>
              </HelpTips>
              </div>
              <div className='up-cell-value'>{(data.outStockRate || '0.00')}%</div>
              {/* <div>出库及时率</div>
              <div className='up-cell-value red'>{((data.outStockOnTimeRate || 0) * 100).toFixed(2)}%</div> */}
            </div>
            <div className='single-add-up-list-cell'>
              <div className='blod flex-center'>出库及时率
              <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: "isRemXl"}}>
                <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
                  {`与集运宝KPI报表保持一致，时效内已出库一段包裹总量/应出库一段包裹总量；`}
                </pre>
              </HelpTips>
              </div>
              {/* <div className='up-cell-value'>{((data.outStockRate || 0) * 100).toFixed(2)}%</div> */}
              {/* <div>出库及时率</div> */}
              <div className='up-cell-value red'>{(data.outStockOnTimeRate || '0.00')}%</div>
            </div>
          </div>
        </div>
        <TableSlider
          style={{height: `calc(100% - ${px2rem(130)})`}}
          data={data.outstockKpiDataList}
          columns={columns}
        ></TableSlider>
    </div>
}