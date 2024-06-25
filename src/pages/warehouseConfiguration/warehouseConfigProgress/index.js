import React, {useEffect, useState, useRef} from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import { ProcessSteps, Card, Button, ASelect } from '@/component';
import { getCompanyList } from '@/pages/warehouseConfiguration/warehouseConfig/step10/config';
import { stepConfig, isWarehouseConfigRoute, stepJump, stepSubmit, watchStepBaseData, getStepBaseData } from './config';
import { isEmpty } from 'assets/js';
// 开仓配置白名单，白名单内的路由将会显示步骤导航栏，此配置项用于配置非默认路由以外的页面
const warehouseConfigWhite = [
  
]

export default function WarehouseConfigProgress(props) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [stepsData, setStepsData] = useState(getStepBaseData() || {})
  useEffect(() => {
    const unBus = watchStepBaseData((state) => {
      setStepsData(state.currentWarehouseInfo || {})
    })
    const unJump = window.setCall(stepJump, 'jump')
    return () => {
      unBus();
      unJump();
    }
  }, [])
  useEffect(() => {
    const hasVisible = warehouseConfigWhite.includes(location.pathname) || isWarehouseConfigRoute(location.pathname);
    const baseData = getStepBaseData()
    // 查看详情不弹窗确认离开框
    window.hasSavePreventLeave = hasVisible && baseData && !baseData.readOnly;
    // 丢失流程信息后将回到列表页面
    if (hasVisible && !stepsData.openWarehouseCode) {
      window.location.href = '/warehouseConfigList';
      return;
    }
    setVisible(hasVisible)
  }, [location.pathname])
  // 渲染子步骤
  function RenderStep(steps, type="circle") {
    return Array.isArray(steps) && <ProcessSteps shape={type}>
      {steps.map(item => {
        const {title, detailTitle, path, children, childrenStepType, ...itemAttr} = item
        const paths = Array.isArray(children) && children.map(c => c.path) || [path]
        return <div name={stepsData.readOnly && detailTitle || title} paths={paths} steps={stepsData} {...itemAttr}>
          {RenderStep(children, childrenStepType)}
      </div>
      })}
    </ProcessSteps> || null
  }
  return visible && <div style={{height: '100%'}}>
    <div style={{marginBottom: 20}}>
      <span className='font-bold' style={{fontSize: 16, marginRight: 10}}>开仓流程</span>
      {
        stepsData.warehouseName && <>
        <span className='light-back' style={{
        fontSize: 12, marginRight: 10,  display: 'inline-block', padding: '4px 10px'
        }}>所属公司： <span className='main-color'>
          <ASelect value={stepsData.companyId} isDetail getOptions={async() => await getCompanyList }></ASelect>
        </span></span>
        <span className='light-back' style={{
          fontSize: 12, marginRight: 10,  display: 'inline-block', padding: '4px 10px'
          }}>仓库名称： <span className='main-color'>{stepsData.warehouseName}</span></span>
      </>
      }
      <span className='light-back' style={{
        fontSize: 12, marginRight: 10,  display: 'inline-block', padding: '4px 10px'
        }}>仓库类型： <span className='main-color'>{stepsData.warehouseTypeName}</span></span>
      <span className='light-back' style={{
        fontSize: 12, marginRight: 10, display: 'inline-block', padding: '4px 10px'
        }}>开仓编码： <span className='main-color'>{stepsData.openWarehouseCode}</span></span>


    </div>
    {RenderStep(Object.values(stepConfig))}
    <div style={{minHeight: 'calc(100vh - 378px)', overFlow: 'auto'}}>
      {props.children}
    </div>
    <div id="pcs-warehouse-config-bottom-tools" style={{
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      display: 'flex',
      height: 60,
      padding: '0 20px',
      alignItems: 'center',
      justifyContent: "space-between"
    }}></div>
  </div> || props.children
}