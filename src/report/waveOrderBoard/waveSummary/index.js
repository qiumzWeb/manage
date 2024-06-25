import React, { useRef, useState, useEffect } from 'react';
import Page from '@/atemplate/queryTable';
import { qSearch, getSearchData } from './config'
import { getWid, isEmpty } from 'assets/js'
import { Message, Button, Icon, AForm, ATab } from '@/component'
import { isEmptyTime } from '@/report/utils';
import BoardCard from './board'
import Bus from 'assets/js/bus'

export default function App(props) {
  const { setTab, items } = props
  const searchRef = useRef()
  const [waveList, setWaveList] = useState([])

  useEffect(() => {
    // 初始化查询
    onSearch()
    Bus.$on('getJumpDetail', (params) => {
      setTab('detail');
      setTimeout(() => {
        const detailRef = items.find(it => it.key === 'detail').ref
        detailRef.current.getSearch(params)
      }, 500)
    })
  }, [])

  // 查询
  async function onSearch() {
    const params = searchRef.current.getData()
    console.log(params, '999999999')
    try {
      setWaveList([])
      const res = await getSearchData(params)
      if(res && Array.isArray(res.bigWaveNoList) && !isEmpty(res.bigWaveNoList)) {
        setWaveList(res.bigWaveNoList.map(r => {
          return {title: r, item: BoardCard}
        }))
      } else {
        Message.warning('未查询到波次信息')
      }
    } catch(e) {
      Message.error(e.message)
    }
  }

  return <div className='class_wave_search_lise_summay'>
      <div style={{display: 'flex'}}>
        <AForm formModel={qSearch} ref={searchRef}></AForm>
        <Button p mt='32' ml="10" onClick={onSearch}>查询</Button>
      </div>
      {!isEmpty(waveList) && <ATab value={waveList} unmountInactiveTabs></ATab>}

  </div>
}