import React from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, tColumns, searchApiUrl, detailModel, getConfirmSplitOrder } from './config'
import {getWid, isEmpty} from 'assets/js'
import { Message, ExportFile } from '@/component'

App.title = "手工拆单"
export default function App(props) {

  const beforeSearch = (req, action) => {
    const data = req && req.data || {}
    if (!data.warehouseId) return '请选择仓库';
  }
  const formatData = (res, params, formatData, action) => {

  }

  // 确认拆单
  async function onSplitOrder(data, {selectRows}) {
    try {
      await getConfirmSplitOrder({
        warehouseId: selectRows[0].warehouseId,
        orderCodes: selectRows.map(s => s.orderLpCode)
      })
      Message.success('操作成功')
    } catch(e) {
      return e.message
    }
  }


  return <div className='handler_split_order_search'>
    <Page
      // 自定义查询 自定表头 code
      code="handler_split_order_search"
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
        tableProps: {},
        showRowSelection: true
      }}
      // 其它配置
      queryListOptions={{
        // initSearch: true
      }}
      // 工具栏配置
      tools={[
        {type: 'formDialog', title: '确认拆单',
          confirmMsg: '确认拆单后把勾选的订单，针对尚未签收的一段包裹解除二段关联关系，二段订单支持手动汇播。',
          beforeShow: ({selectRows}) => {
            if (isEmpty(selectRows)) return '请选择订单！'
          },
          refresh: true,
          onSubmit: onSplitOrder
        }
      ]}
      // 表格操作栏配置
      operationsWidth={130}
      operations={[
        {type: 'formDialog', config: detailModel, title: '包裹明细', DialogWidth: '100%',
          footer: false,
        }
      ]}
    >
      <div slot="tools">
        {(queryList) => {
          return <ExportFile
            params={() => queryList.getSearchParams().data}
            beforeExport={() => queryList.getSearchParams()}
            btnProps={{mr: 0, ml: 10}}
          ></ExportFile>
        }}
      </div>
    </Page>
  </div>
}