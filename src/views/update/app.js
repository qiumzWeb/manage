import React, {useEffect, useState, useRef} from 'react'
import { useHistory } from 'react-router'
import { Icon, Button } from '@/component'
import CainiaoLogo from 'assets/imgs/logo.js'
import SetFastEntry from '@/component/SetFastEntry'
import {defineFastEntry} from 'assets/js'
export default function App(props) {
  const [entryVisible, setEntryVisible] = useState(false)
  const [fastEnterData, setFastEnterData] = useState([])
  const history = useHistory()
  useEffect(() => {
    getFastEntryData()
  }, [])
  async function getFastEntryData() {
    const cachData = await window.dbStore.get(defineFastEntry)
    setFastEnterData(cachData || [])
  }

  return <div style={{
    height: '100%',
    background: '#fff'
  }}><div style={{
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '70%', 
      width: '100%',
      userSelect: 'none',
      
    }}>
    <CainiaoLogo style={{width: '40%',opacity: '0.2'}}></CainiaoLogo>
    <div style={{
        color: "#999",
        fontSize: 30,
        opacity: .2,
        marginTop: 20,
    }}>{props.text}</div>
    <div style={{marginTop: 20, display: 'flex', width: '40%', flexWrap: 'wrap'}}>
      {fastEnterData.map((f,i) => {
        return <Button
          key={i}
          index={i}
          type="secondary"
          mt="10"
          mr='10'
          onClick={() => {
            if (f.routePath) {
              document.title = f.text
              if (/^https?:\/\//.test(f.routePath)) {
                window.open(f.routePath, '_blank')
              } else {
                history.push(f.routePath)
              }
            }
          }}
        >{f.text}</Button>
      })}
      <Button mt="10" onClick={() => setEntryVisible(true)}><Icon type="add" mr='5'></Icon>添加快捷入口</Button>
    </div>

  </div>
  <SetFastEntry
    visible={entryVisible}
    onClose={() => setEntryVisible(false)}
    limit={10}
    onChange={(data) => {
      setFastEnterData(data)
    }}
    data={fastEnterData}
  ></SetFastEntry>
  </div>
}