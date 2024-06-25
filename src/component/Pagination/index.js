import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import { Pagination } from '@alifd/next'
import { AssignProps, isInDialog } from 'assets/js/proxy-utils'
import {sleepTime} from 'assets/js'
import PageSizeSelect from './pageSize'
import { getPaginationContainer, updatePaginationComponent } from './utils'
import { useHistory, useLocation } from 'react-router-dom';
function APagination(props) {
  const location = useLocation();
  const {
    defaultCurrent, totalRender, type, size, shape, inset,
    pageSizeSelector, hideOnlyOnePage, isOld, total, sizeLocked,
    onPageSizeChange,
    ...attrs
  } = props
  const boxRef = useRef()
  const [bottomStyle, setBottomStyle] = useState({})
  let pageSizeOption = {
    pageSizeSelector: false,
    // pageSizeSelector: 'dropdown',
    pageSizeList: [20, 50, 100]
  }
  if (isOld) {
    pageSizeOption = {
      pageSizeSelector: false,
      pageSizeList: [10, 20, 50, 100]
    }
  }
  useEffect(async() => {
    await sleepTime(0)
    const isAtDialog = isInDialog(boxRef.current)
    if (!isAtDialog && !inset) {
      setBottomStyle({
        position: 'absolute', bottom: '0', right: 15, height: 43, zIndex: 99
      })
    }
  }, [])
  const PaginationComponent = <div  ref={boxRef} style={bottomStyle}>
    <Pagination
      {...attrs}
      pageSizeSelector={false}
      // {...pageSizeOption}
      total={Math.min(total, 20000)}
      popupProps={{
        align: "bl tl"
      }}
      selectProps={{
        followTrigger: true
      }}
      totalRender={(t) => {
        return <>
          <PageSizeSelect
            readOnly={sizeLocked}
            pageSize={props.pageSize}
            onPageSizeChange={onPageSizeChange}
            pageSizeList={pageSizeOption.pageSizeList}
          ></PageSizeSelect>
          <span style={{marginLeft: 20, color: '#666'}}>总数：{total}</span>
        </>
      }}
      // pageShowCount={10}
      hideOnlyOnePage={false}
    ></Pagination>
  </div>
  const PaginationContainer = getPaginationContainer(location.pathname)
  if (PaginationContainer){
    return updatePaginationComponent(PaginationComponent, location.pathname)
  }
  return PaginationComponent
}

AssignProps(APagination, Pagination)

export default APagination