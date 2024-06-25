import React, {useState, useEffect, useRef} from 'react'
import { Button, Dialog, Message } from '@/component'
import QueryList from '@/component/queryList/index'
import { tColumns, baseModel, rulesModel, searchUrl, getDetailsData, getContsData, baseViewConfig } from './config'
import FormGroup from '@/component/FormGroup/index'
import $http from 'assets/js/ajax'
import { isEmpty, getUuid, filterNotEmptyData } from 'assets/js'
import { defaultConds } from '../config/planConfig'
import Bus from 'assets/js/bus'

export default React.forwardRef(function App(props, ref) {
  console.log(props, '9999999')
  const { value } = props
  const [data, setData] = useState({})
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detailData, setDetailData] = useState({})
  const query = useRef()
  const form = useRef()
  useEffect(() => {
    if(value.isOpenNewRules) {
      toAddNewRules()
    }
  }, [value])
  // 新增规则 
  function toAddNewRules() {
    setVisible(true)
    setData({
      isAdd: true,
      ...value,
      details: [{p: 1, ...getDetailsData({conds: defaultConds})}]
    })
    setDetailData({})
  }
  const beforeSearch = (req) => {
    return {
      ...req,
      url: req.url.replace('${warehouseId}', value.warehouseId).replace('${id}', value.id),
      data: {}
    }
  }
  const formatData = (data) => {
  }
  // 保存
  async function onOk() {
    const formData = await form.current.getData()
    if (!formData) return
    
    Object.keys(baseViewConfig).forEach(k => {
      delete formData[k]
    })
    const paramsData = filterNotEmptyData({
      ...formData,
      details: formData.details.map(d => ({
        conds: getContsData(d),
        name: getUuid(),
        p: d.p
      })),
    })
    if (data.isAdd) {
      save({
        ...paramsData,
        solutionId: value.id,
        sortingType: value.sortingType
      })
    } else {
      save({
        ...paramsData,
        id: detailData.id,
        solutionId: detailData.solutionId,
        sortingType: detailData.sortingType
      })
    }
  }
  // 修改
  async function save(data) {
    setLoading(true)
    try {
      await $http({
        url: `/warehouses/${value.warehouseId}/sorting-solutions/details/createOrUpdate`,
        method: 'post',
        data
      })
      Message.success('保存成功')
      onClose()
      refresh()
    } catch(e) {
      Message.error(e.message)
    } finally {
      setLoading(false)
    }
  }
  // 关闭
  function onClose() {
    setVisible(false)
  }
  // 刷新
  function refresh() {
    query.current.refresh()
    Bus.$emit('ruleDetailRefresh')
  }
  // 删除
  function onDelete(record) {
    Dialog.confirm({
      title: '提示',
      content: '确认删除该条数据？',
      onOk: async () => {
        try {
          await $http({
            url: `/warehouses/${value.warehouseId}/sorting-solution/${record.solutionId}/details/${record.id}/delete`,
            type: 'get',
          })
          Message.success('删除成功')
          refresh()
        } catch (e) {
          Message.error(e.errMsg || e)
        }
      }
    })
  }
  return <div ref={ref}>
  {/* 查询列表 */}
    <QueryList
      ref={query}
      toolSearch={false}
      initSearch={true}
      columns={tColumns}
      columnWidth={150}
      pagination={false}
      defaultValue="-"
      formatSearchParams={beforeSearch}
      formatData={formatData}
      tableOptions={{
        url: searchUrl,
        method: 'post',
        attrs: {
          fixedHeader: false
        }
      }}
    >
      <div slot="tools">
        <Button type="primary" onClick={toAddNewRules}>新增规则</Button>
      </div>
      <div slot="tableCell" prop="make">
        {(val, index, record) => {
          return <div>
            <Button text type='link' mr="10" onClick={() => {
              setVisible(true)
              const rData = {...value, ...record, details: record.details.map(d => ({...d, ...getDetailsData(d)}))}
              setData(rData)
              setDetailData(record)
            }}>修改</Button>
            <Button text type="link" onClick={() => onDelete(record)}>删除</Button>
          </div>
        }}
      </div>
    </QueryList>
    <Dialog
      title={data.isAdd ? '新增规则' : '修改规则'}
      width='100%'
      visible={visible}
      onOk={onOk}
      onClose={onClose}
      onCancel={onClose}
      okProps={{loading}}
    >
    <FormGroup ref={form} data={data} group={{
      base: {
        title: '基本信息',
        model: baseModel,
        subTitle: <span className='warn-color'>（注：一个分拣方案下的格口号请保障唯一性。规则详情之间请保障区域的唯一性，规则详情内的规则-库区请保障相同）</span>
      },
      rules: {title: '配置规则', model: rulesModel }
    }}></FormGroup>
    </Dialog>
  </div>
})