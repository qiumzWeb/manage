import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { Button, SetPageFull } from '@/component';
import { useActivate, useUnactivate } from 'react-activation'
import { useHistory, useLocation } from 'react-router-dom';
import { getStepBaseData } from './config';
import { createPaginationMountContainer, getPaginationContainer, getPaginationComponent } from '@/component/Pagination/utils';

export default function WarehouseConfigBottomTools(props) {
  const {leftTool, rightTool, centerTool} = props
  const location = useLocation();
  useEffect(mountedTools, []);
  useEffect(mountedTools)
  function mountedTools() {
    if (location.pathname !== window.location.pathname) {
      return
    }
    const BottomToolDomNode = document.getElementById('pcs-warehouse-config-bottom-tools')
    const paginationContainer = getPaginationContainer(location.pathname)
    if (BottomToolDomNode) {
      const baseData = getStepBaseData();
      ReactDOM.unmountComponentAtNode(BottomToolDomNode);
      if (paginationContainer) {
        // ReactDOM.unmountComponentAtNode(paginationContainer);
        paginationContainer.innerHTML = ''
      }
      const Pagination = createPaginationMountContainer(window.location.pathname)
      ReactDOM.render(<>
        <div className='flex-center'>
          <div className='button-border' style={{
            display: 'inline-block', padding: 5,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: 4
          }}>
            <SetPageFull s="l"></SetPageFull>
          </div>
          <Button size="large" ml="10" mr="10" onClick={() => {
            window.Router.push('/warehouseConfigList')
          }}>返回列表</Button>
          {!baseData.readOnly && leftTool}
          <Pagination>{getPaginationComponent(window.location.pathname)}</Pagination>
        </div>
        <div className='flex-center'>
          {centerTool}
        </div>
        <div className='flex-center'>
          {baseData.readOnly ? null : rightTool}
        </div>
      </>, BottomToolDomNode)
    }
  }
  return null
}