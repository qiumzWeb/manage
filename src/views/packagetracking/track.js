import React, {useEffect, useState, useRef} from 'react'
import { Button, Message, Tab, Loading, Collapse, Table, Dialog, Card } from '@/component'
import AForm from '@/component/AForm'
import { isEmpty, isTrue } from 'assets/js'
import { searchModel, SecondOrderInfoModel, firstPackageColumns, SecondOrderTrackColumns } from './config'
import { getQueryList, getPackageTrack } from './api'
export default function App(props) {
  const { packageKey, data } = props
  const [packageTrackData, setPackageTrackData] = useState({})
  const [tableLoading, setTableLoading] = useState(false)
  // 查询包裹轨迹
  async function searchPackageTrack(record, packageNo) {
    try {
      setTableLoading(true)
      const res = await getPackageTrack({
        trackType: 'package',
        packageReferLogisticsOrderCode: record.referLogisticsOrderCode,
        warehouseId: record.warehouseId
      })
      if (isEmpty(res)) {
        packageTrackData[packageNo] = {
          ...record,
          data: []
        }
      } else {
        packageTrackData[packageNo] = {
          ...record,
          data: res
        }
      }
      setPackageTrackData({...packageTrackData})
    } catch(e) {
      Message.error(e.message)
    } finally {
      setTableLoading(false)
    }
  }
  const currentTrackData = packageTrackData[packageKey]
  const p = data
  return <div>
    {p && <Collapse defaultExpandedKeys={['0', '1', '2']}>
      {p.orderDetail && <Collapse.Panel title={`二段订单信息-${p.orderDetail.orderCarriageStatusLabel}`}>
        <AForm defaultValue="-" data={p.orderDetail || {}} formModel={SecondOrderInfoModel}></AForm>
      </Collapse.Panel>}
      {p.orderTrackLogList && <Collapse.Panel title="二段订单轨迹">
        <Table inset fixedHeader={false} dataSource={p.orderTrackLogList || []}>
          {Object.entries(SecondOrderTrackColumns).map(([key, item]) => {
            return <Table.Column key={key} dataIndex={key} {...item}></Table.Column>
          })}
        </Table>
      </Collapse.Panel>}
      {p.packageList && <Collapse.Panel title="一段包裹信息">
        <Table loading={tableLoading} inset fixedHeader={false} dataSource={p.packageList || []}>
          {Object.entries(firstPackageColumns).map(([key, item]) => {
            if (key == 'referLogisticsOrderCode') {
              item.cell = (val, index, record) => {
                return <a onClick={() => searchPackageTrack(record, packageKey)}>{val}</a>
              }
            }
            return <Table.Column key={key} dataIndex={key} {...item}></Table.Column>
          })}
        </Table>
        {!isEmpty(currentTrackData) && <Card title={`包裹轨迹【${currentTrackData.referLogisticsOrderCode}】-${currentTrackData.packageStatusLabel}`}>
          <Card.Content>
            <Table inset fixedHeader={false} dataSource={currentTrackData.data || []}>
              {Object.entries(SecondOrderTrackColumns).map(([key, item]) => {
                return <Table.Column key={key} dataIndex={key} {...item}></Table.Column>
              })}
            </Table>
          </Card.Content>
        </Card> || null}
      </Collapse.Panel>}
    </Collapse>}
  </div>
}