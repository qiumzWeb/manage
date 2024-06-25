import React, {useRef, useState, useEffect} from "react"
import AForm from '@/component/AForm'
import ASelect from '@/component/ASelect'
import { Button, Input, Message, Grid, Loading, ExportFile } from '@/component'
import $http from 'assets/js/ajax'
import localStore from 'assets/js/localStore'
import Cookie from 'assets/js/cookie'
import { formModel, exportFormModel } from './config'
import { downloadExcel } from '@/assets/js/utils';
import dayjs from 'dayjs'

const urlHistoryName = 'apiUrlHistory'
const apiHistoryName = 'apiData'
const exportCommandKeyName = 'exportCommandKeys'
App.title = '接口调式'
let apiHistoryData = {}
export default function App(props) {
    const formRef = useRef()
    const exportFormRef = useRef()
    const [result, setResult] = useState({result: ''})
    const [dataHistory, setDataHistory] = useState({})
    const [loading, setLoading] = useState(false)
    const [commandKeyHistoryData, setCommandKeyHistoryData] = useState([])
    const [currentCommandKey, setCurrentCommandKey] = useState()
    // 获取接口请求参数
    function getApiParams(paramsString) {
      let params = {}
      try {
        paramsString && (params = JSON.parse(paramsString))
      } catch(e) {
        Message.error('请求参数JSON格式不正确')
        params = false
      }
      return params
    }
    // 接口请求
    const ApiTest = async(data, type) => {
       const formData = data || formRef.current.getData()
       let { apiPre, apiType, apiUrl, apiParams, apiHeaders, requestType } = formData
       type = type || requestType || "json";
       if (!data) {
        const r = await formRef.current.validate()
        if (!r) return
       }
       if(/https?:|\/\/|\.com|\.cainiao\.com|:\d{4}/.test(apiUrl)) {
        return Message.error('接口地址格式不正确，接口地址不可包含域名或IP地址')
      }
       let params = getApiParams(apiParams)
       if (!params) return
       let headersParams = getApiParams(apiHeaders)
       if (!headersParams) return
       if(!/^\//.test(apiUrl)) {
        apiUrl = '/' + apiUrl
      }
      let headers = {
        "Content-Type": 'application/json; charset=utf-8',
        ...headersParams
      }
      if (apiPre == '/pcsapiwt') {
        Object.assign(headers, {
          session: params.session,
          warehouseId: params.warehouseId || Cookie.get('warehouseId'),
          ...headersParams
        })
      }
       try {
        const urlHistory = JSON.parse(localStore.get(urlHistoryName) || 'null') || []
        const apiData = JSON.parse(localStore.get(apiHistoryName) || 'null') || {}
        Array.isArray(urlHistory) && urlHistory.push(apiUrl)
        apiData[apiUrl] = {
          apiPre,
          apiUrl,
          apiType,
          apiParams,
          apiHeaders,
          requestType: type
        }
        const newUrlHistory = [...new Set(urlHistory)].slice(-10)
        const newApiHistoryData = {}
        newUrlHistory.forEach(url => {
          newApiHistoryData[url] = apiData[url]
        })
        localStore.set(urlHistoryName, JSON.stringify(newUrlHistory))
        localStore.set(apiHistoryName, JSON.stringify(newApiHistoryData))
        updateUrl()
        setLoading(true)
        const res = await $http({
            url: apiPre + apiUrl,
            method: apiType,
            data: params,
            headers,
            responseType: type
        })
        if (type == 'blob') {
          downloadExcel(res, '测试模板' + dayjs().format("YYYYMMDDHHmmss"))
          setResult({
            result: JSON.stringify({
              success: true,
              data: "模板下载成功",
              message: '接口测试成功'
            }, null, 2)
          })
        } else {
          setResult({
            result: JSON.stringify(res, null, 2)
          })
        }

       } catch(e) {
        Message.error(e.message)
        setResult({
            result: JSON.stringify(e, null, 2)
        })
       } finally {
        setLoading(false)
      }

    }
    function updateUrl() {
        const urlHistory = JSON.parse(localStore.get(urlHistoryName) || 'null') || []
        apiHistoryData = JSON.parse(localStore.get(apiHistoryName) || 'null') || {}
        setDataHistory({
            apiHistory: urlHistory
        })
    }
    // 更新导出key
    function updateCommandKey() {
      setCommandKeyHistoryData(JSON.parse(localStore.get(exportCommandKeyName) || 'null') || [])
    }
    useEffect(() => {
        updateUrl();
        updateCommandKey()
    }, [])
    return <div style={{position: 'relative'}}>
        <Loading visible={!!loading} style={{left: '45%', top: '30%', position: 'absolute'}}></Loading>
        <Grid.Row gutter="12">
          <Grid.Col span={14}>
            <AForm
              ref={formRef}
              formModel={formModel}
              data={dataHistory}
            ></AForm>
          </Grid.Col>
          <Grid.Col span={10}>
            <AForm
                formModel={{
                  apiHistory: {
                    label: '历史请求接口记录(显示最近10条记录，点击接口地址可测试接口)',
                    span: 24,
                    component: React.forwardRef(function apiHistoryBox(props, ref) {
                      const {value} = props
                      return <div ref={ref} style={{border: '1px solid #ccc',padding: 8, borderRadius: '4px', minHeight: 340}}>
                          {Array.isArray(value) && value.map(v => {
                            return <div key={v} title={v}>
                              {apiHistoryData[v] && <Button text type="link" onClick={() => {
                                // formRef.current.reset()
                                setTimeout(() => {
                                  setDataHistory({
                                  apiParams: '{}',
                                  ...apiHistoryData[v]
                                })
                                }, 100)
                                ApiTest(apiHistoryData[v])
                              }}>{v}</Button> || v}
                            </div>
                          })}
                      </div>
                    }),
                  },
                }}
                data={dataHistory}
              ></AForm>
          </Grid.Col>
        </Grid.Row>
        <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>
        <Button type="primary" onClick={() => ApiTest(null,'json')}>测试接口(JSON)</Button>
        <Button type="primary" ml="10" mr="10" onClick={() => ApiTest(null,'blob')}>测试接口(文件流下载)</Button>
        <AForm
            formModel={{
                result: {
                    label: '请求结果',
                    span: 24,
                    component: Input.TextArea,
                    attrs: {
                        rows: 30
                    }
                }
            }}
            data={result}
        ></AForm>
        </div>
        <div style={{flex: 1, marginLeft: 20}}>
          <ExportFile
            getCommandKey={() => exportFormRef.current.getData().commandKey}
            limit={100}
            beforeExport={(exportParams) => {
              const {command, exportRecordLimit, ...searchParams} = exportParams
              const hist = JSON.parse(localStore.get(exportCommandKeyName) || 'null') || [];
              hist.push({
                commandKey: command,
                apiParams: JSON.stringify(searchParams, null, 2)
              });
              const newData = {}
              hist.forEach(h => {
                newData[h.commandKey] = h
              })
              localStore.set(exportCommandKeyName, JSON.stringify(Object.values(newData).slice(-10)));
              updateCommandKey();
            }}
            params={() => {
              const { apiParams } = exportFormRef.current.getData();
              const p = getApiParams(apiParams)
              if (p) return p
            }}
          >测试导出Excel</ExportFile>
          <AForm
            ref={exportFormRef}
            formModel={exportFormModel}
            data={commandKeyHistoryData.find(f => f.commandKey == currentCommandKey) || {}}
          ></AForm>
          <div>
            <div>历史导出commandKey(最多记录最近10个， 点击后仅回填历史参数，需要手动再次点击测试导出Excel)：</div>
            {Array.isArray(commandKeyHistoryData) && commandKeyHistoryData.map(item => {
              return <div key={item.commandKey} style={{fontWeight: 'bold'}}>
                <Button type="link" text onClick={() => {
                    setCurrentCommandKey(item.commandKey)
                }}>{item.commandKey}</Button>
              </div>
            })}
          </div>
        </div>
        </div>

    </div>
}