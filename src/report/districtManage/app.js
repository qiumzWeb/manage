import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Message, Radio } from '@/component'
import QueryList from '@/component/queryList/index'
import ExportExcel from '@/component/ExportFile'
import { qSearch, tColumns, formModel,searchUrl, addUrl, modifyUrl, deleteUrl} from './config'
import AForm from '@/component/AForm'
import $http from 'assets/js/ajax'
import { isEmpty, getQuery } from 'assets/js'
import { StrToArray, ArrayToStr } from '@/report/utils'
import API from 'assets/api'
import Fenpei from './fenpei'
import BatchUpdate from './batchUpdate'
import ModifyRecommendType from './modifyRecommendType'
import moment from 'moment'
import dayjs from 'dayjs'
export default function App(props) {
  const [data, setData] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchData, setSearchData] = useState({})
  const [selectRows, setSelectRows] = useState([])
  const query = useRef()
  const form = useRef()
  const fenpeiRef = useRef()
  useEffect(() => {
    const districtId = getQuery('districtId')
    if (!isEmpty(districtId)) {
      query.current.field.setValue('districtIds', [districtId])
      setTimeout(() => {
        refresh()
      }, 100)
    }
  }, [])
  const beforeSearch = (req) => {
    setSearchData(req.data)
    setSelectRows([])
  }
  const formatData = (data) => {
    Object.assign(data, {
      currentPageNum: data.pageNum,
      totalRowCount: data.total,
      data: data.result
    })
  }
  function getParams() {
    return query.current.field.getValues()
  }

  // 保存
  async function onOk() {
    const result = await form.current.validate()
    if (result) {
      const formData = form.current.getData()
      const fd = ArrayToStr(formData, [
        'areaCode',
        'serviceType',
        'administrativeArea',
        'specialParcelSign',
        'zipGroup'
      ])
      setLoading(true)
      if (data.isAdd) {
        await add({
          ...formData,
          ...fd
        })
      } else {
        await modify({
          ...formData,
          ...fd
        })
      }
      setLoading(false)
    }
  }
  // 新增
  async function add(data) {
    try {
      await $http({
        url: addUrl,
        method: 'post',
        data
      })
      Message.success('新增成功')
      onClose()
      refresh()
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 修改
  async function modify(modifyData) {
    try {
      await $http({
        url: modifyUrl,
        method: 'post',
        data: Object.assign({
          id: data.id
        }, modifyData)
      })
      Message.success('修改成功')
      onClose()
      refresh()
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 关闭
  function onClose() {
    setVisible(false)
  }
  // 刷新
  function refresh() {
    query.current.refresh()
  }
  // 删除
  function onDelete(data) {
    Dialog.confirm({
      title: '删除',
      content: '确认删除后数据不可恢复！',
      onOk: async() => {
        try {
          await $http({
            url: deleteUrl,
            method: 'post',
            data: {
              id: data.id
            }
          })
          Message.success('删除成功')
          refresh()
        } catch(e) {
          Message.error(e.message)
        }
      }
    })
  }
  return <div>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch
      initSearch={false}
      searchModel={qSearch}
      columns={tColumns}
      columnWidth={150}
      defaultValue="-"
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: searchUrl,
        method: 'post',
        attrs: {
          rowSelection: {
            onChange: (keys, rows) => {
              setSelectRows(rows)
            },
            selectedRowKeys: selectRows.map(s => s.id)
          }
        }
      }}
    >
      <div slot="tools">
        <Button mr='10' onClick={() => {
          setVisible(true)
          setData({isAdd: true, warehouseId: getParams().warehouseId})
        }}>新增</Button>
        {/* 导出 */}
        <ExportExcel commandKey="/pcsWarehouseDistrict" params={() => getParams()}></ExportExcel>
        {/* 批量修改 */}
        <BatchUpdate data={searchData} refresh={refresh}></BatchUpdate>
        {/* 变更库区推荐类型 */}
        <ModifyRecommendType data={selectRows} refresh={refresh}></ModifyRecommendType>
      </div>
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          return <div>
            <Button mr='10' text type="link" onClick={() => {
              fenpeiRef.current.open(record)
            }}>物理分配</Button>
            <Button text type='link' mr="10" onClick={() => {
              setVisible(true)
              setData(record)
              $http({
                url: API.getWareHouseDistrict,
                method: 'post',
                data: {id: record.id + ''}
              }).then(d => setData({
                ...d,
                ...StrToArray(d, [
                  'areaCode',
                  'serviceType',
                  'administrativeArea',
                  'specialParcelSign',
                  'zipGroup'
                ]),
                receiveTimeE: d.receiveTimeE && dayjs(d.receiveTimeE) || '',
                receiveTimeS: d.receiveTimeS && dayjs(d.receiveTimeS) || '' 
              })).catch(e => Message.error(e.message))
            }}>修改</Button>
            <Button text type="link" onClick={() => onDelete(record)}>删除</Button>
          </div>
        }}
      </div>
    </QueryList>
    <Dialog
      title={data.isAdd ? '新增' : '修改'}
      width={1020}
      visible={visible}
      onOk={onOk}
      onClose={onClose}
      onCancel={onClose}
      okProps={{loading}}
    >
      <AForm data={data} formModel={formModel} ref={form}></AForm>
    </Dialog>
    <Fenpei ref={fenpeiRef} callBack={refresh}></Fenpei>
  </div>
}