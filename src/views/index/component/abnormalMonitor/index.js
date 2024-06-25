import React, {useState, useEffect, useRef} from 'react'
import {Icon} from "@/component"
import HelpTips from '@/component/HelpTips/index'
import './px2rem.scss'
import TableSlider from '../tableSlider'
const Columns = [
  {title: '时间区间', dataIndex: 'timeInterval', },
  {title: '待入库', dataIndex: 'needInstockPackageQuantity'},
  {title: '待上架', dataIndex: 'needOnShelvesPackageQuantity'},
  {title: '待下架', dataIndex: 'needOffShelvesPackageQuantity'},
  {title: '待播种', dataIndex: 'needAllotPackageQuantity'},
  {title: '待合箱', dataIndex: 'needMergePackageQuantity'},
  {title: '待组包', dataIndex: 'needPackPackageQuantity'},
  {title: '标记少破', dataIndex: 'markExceptionPackageQuantity'},
  {title: '确认少破', dataIndex: 'confirmExceptionPackageQuantity'},
  {title: '移除标记', dataIndex: 'canceledExceptionPackageQuantity'},
]
export default function App(props) {
  const {style} = props
  useEffect(() => {

  }, [])
  Array.isArray(props.data) && props.data.sort((a, b) => a.timeInterval.localeCompare(b.timeInterval))
  return <div className='abnormal-m-box' style={style}>
      <div className='abnormal-m-title'>
        {/* <Icon defineType="al-watch" mr="10"></Icon> */}
        <span className='a-m-b-title'>{'待作业量&异常监控'}</span>
        <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: 'isRemXl'}}>
            <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
              {`时间：当前日期-1（T-1）到当前日期-5（T-5），当月累计为一个月每天的数据量加和显示具体的计算月份（eg：8月累计（当月的T-1每天的累加））；
待入库：已签收，未入库的一段包裹数量；
待上架：已入库，待上架的一段包裹数量；
待下架：待下架：已通知出库，待下架的一段包裹数量；
待播种：已下架，待播种的一段包裹数量；
待合箱：已播种，待合箱的一段包裹数量；
待组包：已合箱，待组包的一段包裹数量；
标记少/破：实操标记包裹少/破的日期，所有的一段包裹数量；
确认少/破：实操确认包裹少/破的日期，所有的一段包裹数量；
移除标记：实操移除标记一段包裹量总和；
`}
            </pre>
          </HelpTips>
      </div>
      <TableSlider
        style={{height: `calc(100% - ${px2rem(97)})`}}
        columns={Columns}
        data={props.data}
        totalData={props.totalData || {}}
      >
      </TableSlider>
  </div>
}