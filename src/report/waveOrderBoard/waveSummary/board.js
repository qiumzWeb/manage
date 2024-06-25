import React, { useRef, useState, useEffect } from 'react';
import Page from '@/atemplate/queryTable';
import { 
  waveInfo, tColumns,  searchApiUrl, confirmModel,
  getWaveBatchCompleteInfo, getWaveBatchCompleteSubmit,
  getCheckCompletePassword
} from './config'
import { getWid, isEmpty } from 'assets/js'
import { Message, Button, Card, Grid, Loading } from '@/component'
import PabeDialogButton from '@/atemplate/queryTable/config/dialogButton'
import { isEmptyTime } from '@/report/utils';
export default function App(props) {
  const pageRef = useRef();
  const [baseData, setBaseData] = useState({})
  const beforeSearch = (req, action) => {
    return {
      ...req,
      data: {
        warehouseId: getWid(),
        bigWaveNo: props.name
      }
    }
  }
  const formatData = (res, params, formatData, action) => {
    setBaseData(Object.assign({}, res.bigBagMessage, res.bigWaveNoMessage))
    return formatData(res.consoBatchMessageList || [])
  }
  // 获取queryList
  function getQueryList() {
    return pageRef.current.getQueryList()
  }
  // 初始化
  function afterMounted() {
  }

  return <div className='class_wave_summay_board'>
    <Card title={`波次号：${props.name}`} hasBorder={false}>
      <Card.Content>
        <Page
          ref={pageRef}
          // 自定义查询 自定表头 code
          code="class_wave_summay_board"
        // 查询配置
          searchOptions={{
            url: searchApiUrl,
            method: 'post',
            beforeSearch
          }}
          // 表格配置
          tableOptions={{
            model: tColumns,
            formatData,
            tableProps: {
              inset: true
            }
          }}
          // 其它配置
          queryListOptions={{
            initSearch: true,
            afterMounted,
            pagination: false,
            toolSearch: false
          }}
          // 工具栏配置
          tools={[]}
          // 表格操作栏配置
          operationsWidth={130}
          operations={[
            {
              type: 'formDialog', config: confirmModel,  title: '完结集货批次', DialogWidth: 400, refresh: true,
              show: (val, index, record) => record.batchStatus < 20,
              footer: {
                ok: ({props, onClose, form}) => {
                  const { data, refresh } = props
                  const closeAll = onClose
                  return <PabeDialogButton
                    title="确认"
                    data={data}
                    refresh={true}
                    btnProps={{p: true, mr: 10}}
                    queryListRefresh={refresh}
                    dialogTitle="完结集货批次"
                    beforeShow={async() => {
                      try {
                        let result = await form.current.validate()
                        console.log(result, '9999999999')
                        if (result) {
                          let formData = form.current.getData()
                          await getCheckCompletePassword(formData)
                        } else {
                          return '请输入正确的密码'
                        }
                      } catch(e) {
                        return e.message
                      }
                    }}
                    getData={async(data) => {
                      try {
                        const res = await getWaveBatchCompleteInfo(data)
                        return Object.assign({}, data,  res || data,) 
                      } catch(e) {
                        return data
                      }
                    }}
                    headerSlot={({data, loading}) => {
                      return <Loading visible={loading}>
                        <div style={{marginBottom: 10}}>集货批次号： <b>{data.batchNo}</b></div>
                        <div style={{marginBottom: 10}}>集货批次未集齐包裹数： <b>{data.notGatheredPackageNum}</b></div>
                        <div style={{marginBottom: 10}}>未集齐订单数： <b>{data.notGatheredOrderNum}</b></div>
                        <div className='warn-color' style={{marginTop: 20}}>请确认此部分包裹是否需要重新操作“集货批次分拣”</div>
                      </Loading>
                    }}
                    footer={{
                      ok: ({props, onClose}) => {
                        const { data, refresh } = props
                        return <>
                          <Button mr="10" p onClick={async() => {
                            try {
                              await getWaveBatchCompleteSubmit(data, "none")
                              onClose()
                              refresh()
                              closeAll()
                              Message.success('操作成功')
                            } catch(e) {
                              Message.error(e.message)
                            }
                          }}>已集齐</Button>
                          <Button mr="10" p onClick={async() => {
                            try {
                              await getWaveBatchCompleteSubmit(data)
                              onClose()
                              refresh()
                              closeAll()
                              Message.success('上架成功')
                            } catch(e) {
                              Message.error(e.message)
                            }
                          }}>异常上架</Button>
                          <Button mr="10" p onClick={async() => {
                            try {
                              await getWaveBatchCompleteSubmit(data, "CDD")
                              onClose()
                              refresh()
                              closeAll()
                              Message.success('操作成功')
                            } catch(e) {
                              Message.error(e.message)
                            }
                          }}>重堆垛</Button>
                        </>
                      },
                    }}
                  ></PabeDialogButton>
                },
              },
            },
          ]}
        >
          <div slot="tools">
            <Grid.Row gutter="12">
              {
                Object.entries(waveInfo).map(([key, item]) => {
                  return <Grid.Col key={key} fixedSpan={9}>
                    <div style={{
                      borderRadius: 8,
                      border: '1px solid #d4d4d4',
                      padding: 16,
                      marginBottom: 12
                    }}>
                      <div>{item.title}</div>
                      <div style={{marginTop: 12, fontWeight: 'bold'}}>{baseData[key] || '-'}</div>
                    </div>
                  </Grid.Col>
                })
              }
            </Grid.Row>
          </div>
        </Page>
      </Card.Content>
    </Card>

  </div>
}