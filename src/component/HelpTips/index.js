import React from 'react'
import {CnIcon} from '@/component'
import OverTips from '@/component/overTips/index'

export default function HelpTips(props) {
  const { iconProps, maxWidth, isRem, large, ...attrs } = props
  return <OverTips
  showTips
  popupStyle={{
    maxWidth: maxWidth ? maxWidth : large ? 500 : 300
  }}
  trigger={
    isRem ? <CnIcon type="help-color" style={{cursor: 'pointer', fontWeight: 'bold'}} {...iconProps}></CnIcon> :
    <CnIcon type="help-color" style={{cursor: 'pointer', fontWeight: 'bold'}} {...iconProps}></CnIcon>
  }
  {...attrs}
  ></OverTips>
}