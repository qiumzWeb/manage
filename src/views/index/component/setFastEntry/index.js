import React, {useEffect, useState, useRef} from 'react'
import { useHistory } from 'react-router'
import { Icon } from '@/component'
import { defineFastEntry, _indexMenuCode } from 'assets/js'
require('./px2rem.scss')
import suIcon from 'assets/imgs/fast-enter.svg'
// 快捷入口
import SetFastEntry from '@/component/SetFastEntry'
export default function App(props) {
  const [entryVisible, setEntryVisible] = useState(false)
  const history = useHistory()
  const [fastEnterData, setFastEnterData] = useState([])
  const [fActive, setFActive] = useState('')

  useEffect(() => {
    // 获取快捷入口
    getFastEntryData()
  }, [])
  async function getFastEntryData() {
    const cachData = await window.dbStore.get(defineFastEntry)
    setFastEnterData(cachData || [])
  }
  return <div className="t-r-p bbox setfastentry" style={{background: `url(${suIcon}) no-repeat #fff`}}>
        <div className="rp-top">
          快捷入口
          <Icon style={{cursor: 'pointer'}} defineType="setting" className="isRemXl" onClick={() => setEntryVisible(true)}></Icon>
        </div>
        <div
          className={`rp-button ${-1 === fActive && 'active' || ''}`}
          onClick={() => {
            setFActive(-1)
          }}
        >一键开仓</div>
      {fastEnterData.map((f,i) => {
        return <div
          key={i}
          index={i}
          className={`rp-button ${i === fActive && 'active' || ''}`}
          onClick={() => {
            setFActive(i)
            if (f.routePath) {
              document.title = f.text
              if (/^https?:\/\//.test(f.routePath)) {
                window.open(f.routePath, '_blank')
              } else {
                history.push(f.routePath)
              }
            }
          }}
        >{f.text}</div>
      })}
      <SetFastEntry
      visible={entryVisible}
      onClose={() => setEntryVisible(false)}
      limit={4}
      onChange={(data) => {
        setFastEnterData(data)
        setFActive('')
      }}
      data={fastEnterData}
    >
      <div className={`set-cell-row disabled`} style={{marginTop: 20}}>一键开仓</div>
    </SetFastEntry>
    </div>
}