import React, {useEffect, useState, useRef} from 'react'
import {AForm, Button, Message, Notification, Tab, Loading, Collapse, Table, Dialog, Card, AnchorPosition } from '@/component'
import { isEmpty, isTrue } from 'assets/js'
import { searchModel } from '../config/dataquery'
import { getQueryData } from '../api'
import { getTipsLabel } from '@/report/utils'
require('../scss/index.scss')
let dataList = []
let cacheDataParams = {}
export default function App(props) {
  const [loading, setLoading] = useState(false)
  /**
   * 列表群
   * @params {Array} columns 
   * @params {Array} dataSource
   */
  const [tableList, setTableList] = useState([])
  const formRef = useRef()
  const contentRef = useRef()
  // 查询包裹
  async function onSearch(key) {
    dataList = []
    cacheDataParams = {}
    const data = formRef.current.getData()
    if (isEmpty(data.searchCode)) return Message.warning('请输入单号')
    const option = JSON.parse(data.type)
    setTimeout(() => {
      Promise.all(option.map(d => {
        if (isEmpty(d)) return Promise.resolve()
        return getPackageInfo({
          tableSchema: d.tableSchema,
          tableName: d.tableName,
          conditions: {
            [d.searchColumn]: data.searchCode
          }
        }, data.searchCode)
      })).finally(() => {
        setLoading(false)
      })
    }, 0)
  }
  // 获取包裹信息
  async function getPackageInfo(params, searchCode) {
    try {
      if (cacheDataParams[JSON.stringify(params)]) return // 中断重复请求
      setLoading(true);
      const res = await getQueryData(params)
      cacheDataParams[JSON.stringify(params)] = true
      res.queryParams = JSON.stringify(params.conditions)
      res.title = `${res.displayName}【${res.tableName}】`
      if (res) {
        dataList = [
          ...dataList,
          res,
        ]
        setTableList(dataList)
        if (Array.isArray(res.relations) && Array.isArray(res.dataList)) {
          if (typeof searchCode === 'object') {
            res.relations.forEach(r => r.action = 'link')
          } else {
            res.relations.forEach(r => r.action = 'load')
          }
          res.dataList.forEach(d => {
            getConditions(res.relations.filter(r => r.action == 'load'), d)
          })
        }
      }
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 关联条件查询
  function getConditions(relations, searchCode) {
    if (Array.isArray(relations) && !isEmpty(relations)) {
      setTimeout(() => {
        Promise.all(relations.map(r => {
          const conditions = {}
          if (!isEmpty(r.conditions)) {
            Object.entries(r.conditions).forEach(([key, val]) => {
              conditions[key] = typeof searchCode === 'object' ? searchCode[val] : searchCode
            })
          }
          return getPackageInfo({
            tableSchema: r.tableSchema,
            tableName: r.tableName,
            conditions
          }, searchCode)
        })).finally(() => {
          setLoading(false)
        })
      }, 60)
    }
  }
  // 表格link 加载
  function getLinkSearch(data, key) {
    return (val, index, record) => {
      if (Array.isArray(data.relations) && data.relations.some(r => r.action == 'link')) {
        const relations = data.relations[0]
        const conditions = Object.values(relations.conditions)[0]
        return key == conditions ? <a onClick={() => {
          getConditions(data.relations, record)
        }}>{val}</a> : val
      } else {
        return val
      }
    }
  }
  return <div className='pcs-packageTracking-360-detail' style={{position: 'relative'}}>
    <div className='next-table-one-line' style={{overflow: 'auto', height: 'calc(100vh - 246px)', postiion: 'relative'}}>
    <AnchorPosition
      data={tableList}
      ref={contentRef}
      loading={loading}
    >
    <AForm ref={formRef} formModel={searchModel}>
      <div slot="formCell" prop="btn">
        {
          () => {
            return <div>
            <Button type="primary" mb="10" onClick={() => onSearch()}>查询</Button>
            </div>
          }
        }
      </div>
    </AForm>
    <div slot="listCell">
      {(t, index) => {
        const columns = t.columns || []
        const columnsWidth = 190
        return <Card definedStyle={{width: (columns.length + 1) * columnsWidth}}
          key={index} title={<div>
            {t.displayName}
            <span style={{fontSize: 14, marginLeft: 20, color: '#666'}}>
            数据库名：{t.tableSchema}，   
            关联表：<span style={{fontWeight: 'bold'}}>{t.tableName}</span>，
            查询参数： {t.queryParams}
            </span>
            
          </div>}
          >
          <Card.Content>
            <div>
              <Table inset fixedHeader={false} dataSource={t.dataList || []}>
                {(columns).map((item, key) => {
                  const relations = Array.isArray(t.relations) && t.relations[0]
                  const conditions = relations && relations.conditions && Object.values(relations.conditions)[0]
                  const isLock = (Array.isArray(t.relations) && t.relations.some(r => r.action == 'link') && item.name == conditions)
                  return <Table.Column
                    {...item}
                    key={key}
                    dataIndex={item.name}
                    width={columnsWidth}
                    cell={getLinkSearch(t, item.name)}
                    lock={isLock ? 'left' : false}
                    title={item.options ? getTipsLabel(item.label, item.options.map(o => `${o.value}: ${o.text}`).join('\n')) : item.label}
                  ></Table.Column>
                })}
              </Table>
            </div>
          </Card.Content>
        </Card>
      }}
    </div>

    </AnchorPosition>
    </div>

  </div>
}