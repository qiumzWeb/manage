import React, {useRef, useState, useImperativeHandle} from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, getCompleteWave } from './config'
import {getWid, isEmpty } from 'assets/js'
import { Message, Button, Icon, ExportFile, Dialog } from '@/component'
import $http from 'assets/js/ajax';
import { isEmptyTime } from '@/report/utils';

export default React.forwardRef(function App(props, ref) {
  const { setTab, items } = props;
  const pageRef = useRef()
  useImperativeHandle(ref, () => {
    return {
      getSearch(params) {
        const queryList = getQueryList()
        queryList.field.reset();
        queryList.field.setValues(params)
        setTimeout(() => {
          queryList.refresh()
        }, 1000)
      }
    }
  })
  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.batchNo) return '请输入批次号';
    return {
      ...req,
      data: {
        ...data,
        warehouseId: getWid()
      }
    }
  }
  const formatData = (res, params, formatData, action) => {
    return {
      ...res,
      data: res.data?.map(d => ({...d, batchNo: params.data.batchNo}))
    }
  }

  // 获取queryList
  function getQueryList() {
    return pageRef.current.getQueryList()
  }


  return <div className='class_sowing_wave_Detail'>
    <Page
      ref={pageRef}
      // 自定义查询 自定表头 code
      code="class_sowing_wave_Detail"
    // 查询配置
      searchOptions={{
        url: searchApiUrl,
        method: 'post',
        model: qSearch,
        beforeSearch
      }}
      // 表格配置
      tableOptions={{
        model: tColumns,
        formatData,
        showRowSelection: true,
        tableProps: {
          rowSelection: {
            getProps: (record) => {
              return record.isCompletedWave == 1 ? {disabled: false} : {disabled: true}
            }
          }
        }
      }}
      // 其它配置
      queryListOptions={{
        // initSearch: true
      }}
      // 工具栏配置
      tools={[
        {type: 'formDialog', title: '批量完结波次',
          confirmMsg: '确定完结选中的波次？',
          beforeShow: ({selectRows}) => {
            if (isEmpty(selectRows)) return '请选择需要完结的波次'
          },
          refresh: true,
          onSubmit: async(data, {selectRows}) => {
            try {
              const res = await getCompleteWave({
                batchNo: selectRows[0].batchNo,
                waveNoList: selectRows.map(s => s.waveNo)
              })
              // Message.success('批量完结成功')
              const completeWaveResult = res.completeWaveResult || {}
              const succK = completeWaveResult.successAreaList || []
              const failK = completeWaveResult.failAreaList || []
              const succG = completeWaveResult.successSlotList || []
              const failG = completeWaveResult.failSlotList || []
              Dialog.confirm({
                title: '批量完结完结成功',
                content: <div>
                  <div>成功的库区</div>
                  <b>{Array.isArray(succK) && succK.map((s, i) => s) + "" || "-"}</b>
                  <div style={{marginTop: 10}}>成功的格口</div>
                  <b>{Array.isArray(succG) && succG.map((s, i) => s.slotCode) + "" || "-"}</b>
                  <div style={{marginTop: 10}}>失败的库区</div>
                  <b>{Array.isArray(failK) && failK.map((s, i) => s) + "" || "-"}</b>
                  <div style={{marginTop: 10}}>失败的格口</div>
                  <b>{Array.isArray(failG) && failG.map((s, i) => s.slotCode) + "" || "-"}</b>
                </div>
              })
            } catch(e) {
              return e.message
            }
          }
        }
      ]}
      // 表格操作栏配置
      operationsWidth={100}
      operations={[
        {type: 'formDialog', confirmMsg: (data) => {
          return `确认完结波次：${data.waveNo}?`
        }, title: '完结波次', refresh: true,
        show: (val, index, record) => record.isCompletedWave == 1,
          async onSubmit(data){
            try {
              const res = await getCompleteWave({
                batchNo: data.batchNo,
                waveNoList: [data.waveNo]
              })
              // Message.success('完结成功')
              const completeWaveResult = res.completeWaveResult || {}
              const succK = completeWaveResult.successAreaList || []
              const failK = completeWaveResult.failAreaList || []
              const succG = completeWaveResult.successSlotList || []
              const failG = completeWaveResult.failSlotList || []
              Dialog.confirm({
                title: '完结成功',
                content: <div>
                  <div>成功的库区</div>
                  <b>{Array.isArray(succK) && succK.map((s, i) => s) + "" || "-"}</b>
                  <div style={{marginTop: 10}}>成功的格口</div>
                  <b>{Array.isArray(succG) && succG.map((s, i) => s.slotCode) + "" || "-"}</b>
                  <div style={{marginTop: 10}}>失败的库区</div>
                  <b>{Array.isArray(failK) && failK.map((s, i) => s) + "" || "-"}</b>
                  <div style={{marginTop: 10}}>失败的格口</div>
                  <b>{Array.isArray(failG) && failG.map((s, i) => s.slotCode) + "" || "-"}</b>
                </div>
              })
            } catch(e) {
              return e.message
            }
          }
        },
      ]}
    >
      <div slot="tableCell" prop="waveNo">
        {(val, index, record) => {
          return <a onClick={() => {
              setTab('bigBag');
              setTimeout(() => {
                const detailRef = items.find(it => it.key === 'bigBag').ref
                detailRef.current.getSearch({
                  waveNo: val
                })
              }, 500)
          }}>{val}</a>
        }}
      </div>
    </Page>
  </div>
})