import React, { useState, useRef, useEffect } from 'react';
import { AForm, FormGroup, Button, HelpTips, BottomTools, Message } from '@/component';
import { getWid, isEmpty } from 'assets/js';
import { TotalModel, base2Model, base3Model, base4Model, base5Model } from './config';
import { getUPPHConfig, getOtherPlanConfig, savePlanOtherConfig, saveUPPHConfig } from '../api';



ConfiguarationList.title = '生产计划配置项'
export default function ConfiguarationList(props) {
  const form1 = useRef()
  const form2 = useRef()
  const [baseData, setBaseData] = useState({})
  const [otherData, setOtherData] = useState({})

  useEffect(() => {
    getUPPHConfig().then(res => {
      setBaseData(res || {})
    })
    getOtherPlanConfig().then(res => {
      setOtherData(res || {})
    })
  }, [])
  // 保存 UPPH
  async function saveBaseData() {
    try {
      const UPPHData = await form1.current.getData();
      const warehouseId = getWid()
      const res = await saveUPPHConfig({warehouseId, ...(UPPHData || {})})
      Message.success('保存成功')
      setBaseData(res || {})
    } catch(e) {
      Message.error(e.message)
    }
  }
  // 其它计划配置保存
  async function saveOtherData() {
    try {
      const planData = await form2.current.getData();
      const warehouseId = getWid()
      const res = await savePlanOtherConfig({warehouseId, ...(planData || {})})
      Message.success('保存成功')
      setOtherData(res || {})
    } catch(e) {
      Message.error(e.message)
    }
  }


  return <div className='prod-plan-configuaration-list'>
    <FormGroup
      ref={form1}
      isToggle
      data={baseData}
      group={{
        base1: {
          title: '总计划-动态计划调整',
          subTitle: <HelpTips iconProps={{s: 'm', ml: 5}}>用于调整UPPH报表中的动态计划量</HelpTips>, 
          model: TotalModel,
          showCollapse: false,
          toggleExtra: <Button p ml="8" onClick={saveBaseData}>保存</Button>
        },
      }}
    ></FormGroup>
    <FormGroup
      ref={form2}
      isToggle
      data={otherData}
      group={{
        base1: {
          title: '子计划动态计划各环节权重配置',
          subTitle: <HelpTips iconProps={{s: 'm', ml: 5}}>用于调整UPPH报表中的子计划动态计划量</HelpTips>, 
          model: base2Model,
          isGroup: true
        },
        base2: {
          title: '批次发运预测-分拨仓发货时间',
          subTitle: <HelpTips iconProps={{s: 'm', ml: 5}}>用于区分T0/T+1的批次发运预测单量，此时间前的包裹视为T0批次发运单量，此时间后视为T+1批次发运单量</HelpTips>,
          model: base3Model,
          isGroup: true
        },
        base3: {
          title: '异常预警-单量流速产能配置',
          subTitle: <HelpTips iconProps={{s: 'm', ml: 5}}>用于配置异常预警指标【单量流速】计算公式中的产能。单量流速：实际单量/产能</HelpTips>,
          model: base4Model,
          isGroup: true
        },
        base4: {
          title: '仓库工作时间',
          // subTitle: <HelpTips iconProps={{s: 'm', ml: 5}}>用于控制UPPH报表中实际量的计算时间范围</HelpTips>,
          model: base5Model,
          isGroup: true
        },
      }}
    ></FormGroup>
    <BottomTools>
      <Button p ml="20" onClick={saveOtherData}>保存</Button>
    </BottomTools>
  </div>
}
