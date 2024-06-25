import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, ImagePreview } from '@/component'
import QueryList from '@/component/queryList/index'
import { qSearch, tColumns, UPPHConfigTable, UppHSumDataModel, getUPPHDetailData } from './config'
import { getRangTime } from '@/report/utils'
import { isHttpUrl, isEmpty } from 'assets/js'
import DialogButtonModel from '@/atemplate/queryTable/config/dialogButton'
import HpphHeader from './component/upphHeader'
import { UPPHPLANOPTIONS } from '@/report/options';


export default function App(props) {
  const query = useRef()
  const beforeSearch = (req) => {
    if (!req.data.warehouseId) return '请选择仓库';
    const data = req && req.data
    const [s, e] = data['timeScoped']
    data['timeScoped'] = [s && s.startOf && s.startOf('day') || s, e && e.endOf && e.endOf('day') || e]
    const time = getRangTime(data, {time: 'timeScoped', start: 'timeScopeStart', end: 'timeScopeEnd'})
    if (!time.timeScopeStart || !time.timeScopeEnd) return '请选择查询时间范围'
    return {
      ...req,
      data: {
        ...data,
        ...time,
      }
    }
  }
  const formatData = (data) => {
  }
  function getParams() {
    return query.current.field.getValues()
  }
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: '/sys/broadcast/history/list',
        method: 'post',
      }}
    >
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          const isUPPH = record.contentType === 'UPPH';
          let url = record.contentDetail;
          if (isUPPH && (!url || isHttpUrl(url))) {
            if (isEmpty(record.taskId)) return '-';
            return <DialogButtonModel
              title="详情"
              dialogTitle="播报详情"
              DialogWidth={1300}
              headerSlot={({data}) => <HpphHeader data={data || {}}></HpphHeader>}
              footer={false}
              formProps={{hasBorder: false}}
              getData={async() => {
                const res = (await getUPPHDetailData({id: record.taskId})) || {}
                // const res = {}
                return {
                  ...res,
                  upphSubPlans: UPPHPLANOPTIONS.map(m => {
                    const newMap = (Array.isArray(res.upphSubPlans) && res.upphSubPlans.find(r => r.indicatorCode == m.value) || {})
                    const planEffect = (Array.isArray(res.upphSubPlans) && res.upphSubPlans.find(r => r.indicatorCode == 'SUB_PLAN_EFFECT') || {})
                    // if (newMap.indicatorCode)
                    return {
                      ...m,
                      ...newMap,
                      planEffect
                    }
                  })
                }
              }}
              groupConfig={{
                base: {title: '总计划-动态调整', model: UppHSumDataModel},
                other: {title: '子计划-产能', model: UPPHConfigTable}
              }}
              btnProps={{text: true, type: 'link'}}
            ></DialogButtonModel>
          }
          if (isHttpUrl(url)) {
            const urlList = [url]
            return <ImagePreview  urlList={urlList}>
              {(lists, open) => {
                return <Button text type='link' onClick={() => open()}>详情</Button>
              }}
            </ImagePreview>
          } else {
            return url && <Button text type='link' onClick={() => Dialog.alert({
              title: '播报详情',
              content: <pre style={{lineHeight: '20px', whiteSpace: 'break-spaces'}}> {url}</pre>,
              okProps: {
                children: '关闭'
              }
            })}>详情</Button> || '-'
          }
        }}
      </div>
    </QueryList>
  </div>
}