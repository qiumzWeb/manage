import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import CollapseBtn from '@/layout/CollapseBtn';
import CainiaoLogo from 'assets/imgs/logo.js';
import { Button, Message } from '@/component';
import { WarehouseConfigModel, SetWarehouseModel } from 'assets/js';
import Bus from 'assets/js/bus';
import SearchMenu from '@/layout/searchMenu'
export default function Branding(props) {
  const history = useHistory()
  const [visible, setVisible] = useState(false)
  const logo = <span style={{margin: '0 0px 0 7px', cursor: 'pointer'}} onClick={() => {
    history.push('/')
  }}>
    <CainiaoLogo></CainiaoLogo>
  </span>
  useEffect(() => {
    // 一键开仓配置菜单
    const unWarehouseConfigBus = Bus.$on(WarehouseConfigModel, (status) => {
      setVisible(status)
    })
    return () => {
      unWarehouseConfigBus()
    }
  }, [])
  return <div className="pcs-header-logo">
    {logo }
    <CollapseBtn></CollapseBtn>
    {visible && <Button ml="20" warning onClick={() => {
      Message.success('已退出开仓配置模式')
      SetWarehouseModel(false)
    }}>退出开仓配置模式</Button> || null}
    {/* <CnIntelliAssistant></CnIntelliAssistant> */}
    <SearchMenu style={{marginLeft: 100}}></SearchMenu>
  </div>
}