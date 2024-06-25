import React, {useRef, useEffect} from 'react'
import { Dialog, Icon } from '@/component'
import { Button, Message } from '@/component'
import Api from 'assets/api'
import QueryList from '@/component/queryList'
import { columns } from './config'
import Bus from 'assets/js/bus'
import qs from 'querystring'
import moment from 'moment'
DownLoadCenter.title = '下载中心'
export default function DownLoadCenter() {
  const query = useRef()
  useEffect(() => {
    const unBus = Bus.$on('routeRefresh', ()=> {
      Bus.$emit('downLoadRefresh')
    })
    const unRefresh = Bus.$on('downLoadRefresh', () => refresh())
    return () => {
      unBus()
      unRefresh()
    }
  }, [])
  function refresh() {
    query.current && query.current.refresh()
  }
  return <div>
    <div style={{fontSize: '12px', color: '#999', display: 'flex', alignItems: 'center', marginBottom: 10}}><Icon className="main-color" type="prompt" s="m" mr="5"></Icon>列表仅展示7天内的下载任务，过期任务将自动清理</div>
    <QueryList
      ref={query}
      columns={columns}
      toolSearch
      initSearch
      formatSearchParams={(req) => {
        // req.data.warehouseId = getWid()
        req.data.startTime = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
      }}
      searchBtnText="刷新数据"
      tableOptions={{
        url: Api.downloadCenterList,
        method: 'post',
        attrs: {
          rowProps: (record,index) => {
            if (record.fileStatus === 'DUMP') {
              return {
                style: {color: '#999'}
              }
            }
          }
        }
      }}
    >
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          
          if (['SUCC', 'DOWNLOAD'].includes(record.fileStatus)) {
            return <Button text type="primary" onClick={async() => {
              try {
                query.current.setState({loading: true})
                const downBox = window.downloadFile(Api.downloadCenterFile + '?' + qs.stringify({exportTaskId: record.exportTaskId}))
                watchClose()
                function watchClose() {
                  const timer = setTimeout(() => {
                    clearTimeout(timer)
                    if (downBox.closed) {
                      // refresh()
                      Bus.$emit('downLoadRefresh')
                      console.log('下载窗口关闭了')
                    } else {
                      watchClose()
                    }
                  }, 100)
                }
              } catch (e) {
                Message.error(e.message)
              } finally {
                query.current.setState({loading: false})
              }
            }}>下载</Button>
          }
          return '--'
        }}
      </div>
    </QueryList>
  </div>
}