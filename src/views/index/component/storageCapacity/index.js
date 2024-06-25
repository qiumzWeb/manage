import React, {useState, useEffect, useRef} from 'react'
import HelpTips from '@/component/HelpTips/index'
import './px2rem.scss'
import TableSlider from '../tableSlider'
const Columns = [
  {title: '库区组', dataIndex: 'districtGroupName'},
  {title: '在架', dataIndex: 'totalPackageCount'},
  {title: '已入未上', dataIndex: 'inStockTotalPackageCount'},
  {title: '峰值库容', dataIndex: 'maxTotalPackageNum'},
  {title: '剩余库容', dataIndex: 'surplusTotalPackageCount'},
  {title: '预警值', dataIndex: 'warningTotalPackageNum'},
  {title: '库容利用(%)', dataIndex: 'totalPackageRate'},
]
export default function App(props) {
  const {style} = props
  return <div className='storage-c-box' style={style}>
      <div className='storage-c-title'>
        {/* <Icon defineType="split-info" mr="10"></Icon> */}
        <span className='s-c-b-title'>分区库容情况</span>
        <HelpTips maxWidth={px2rem(500)} isRem iconProps={{ml: px2rem(5), className: 'isRemXl'}}>
            <pre style={{whiteSpace:'break-spaces', width: '100%', fontSize: px2rem(14)}}>
              {`库区组：以每个仓库已经划分好的库区组编号为准（eg：A区、B区，参考库区组配置中的名称）；
在架：截止到当前日期所有已上架未下架的一段包裹数量；
已入未上：截止到当前日期已经入库未上架的一段包裹数量；
峰值库容（库区组维度）：取基础配置中预警值配置中的库区组库容预警值；；
剩余库容：峰值库容-在架数量；
预警值：取基础配置中预警值配置中的库存总量预警值；
库容利用率：在架数量/峰值库容`}
            </pre>
          </HelpTips>
      </div>
      <TableSlider
        style={{height: `calc(100% - ${px2rem(80)})`}}
        columns={Columns}
        data={props.data}
        totalData={{...(props.totalData || {}), districtGroup: '累计'}}
      ></TableSlider>
  </div>
}