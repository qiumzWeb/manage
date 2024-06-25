import React from 'react';
import { Message, Icon } from '@/component';
import { getReactNodeTextContent } from 'assets/js/proxy-utils';
import { isTrue, getResult } from 'assets/js'
export default function App(props) {
  const { dataSource, tableTitle } = props
  // 复制表数据
  async function CopyDataToClipboard() {
    Object.values(tableTitle).forEach((val) => {
      val.title = getReactNodeTextContent(val.title)
    })
    let textData = ''
    Object.values(tableTitle).forEach(v => {
      textData += `${v.title}\t`
    })
    textData += '\r'
    if (Array.isArray(dataSource)) {
      let index = 0
      for(let d of dataSource) {
        for(let [key, item] of Object.entries(tableTitle)) {
          let val = d[key]
          if (typeof item.cell === 'function') {
            let str = await getResult(getReactNodeTextContent(item.cell(val, index, d)))  
            if (isTrue(str)) {
              val = str
            }
          }
          textData += `'${val}\t`
        }
        textData += '\r'
        index++
      }
    }
    navigator.clipboard.writeText(textData).then(e=> Message.success('复制成功')).catch(e => Message.error('复制失败，请使用Chrome浏览器进行复制'))
  }
  return <div className="copy-data" onClick={CopyDataToClipboard} title='复制数据'><Icon size="large" type="copy"></Icon></div>
}