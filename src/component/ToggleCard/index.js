import React, { useState, useRef } from 'react';
import { Icon } from '@/component';

require('./index.scss')


export default function ToggleCard(props) {
  const {children, title, titleExtra, btnExtra, isGroup, showCollapse} = props
  const [collapseToggle, setCollapseToggle] = useState(false);

  function setVisible() {
    setCollapseToggle((visible) => !visible)
  }

  return <div className={`pcs-toggle-card ${collapseToggle && 'closed' || ''}`} style={{
    marginBottom: isGroup ? 0 : 16,
    boxShadow: isGroup ? 'none' :"0 4px 10px 0 rgba(32, 60, 153, .1)",
  }}>
    <div className='pcs-toggle-card-title flex-center'>
      <div className='pcs-toggle-card-title-left flex-center'>
        <div className='main-back flex-center' style={{
          width: 24, height: 24, justifyContent: 'center', borderRadius: 4, color: '#fff',
          marginRight: 5,
        }}>
          <Icon s="m" type="form"></Icon>
        </div>
        <div style={{fontSize: 16, color: '#333'}}>{title}</div>
        {titleExtra}
      </div>
      <div className='pcs-toggle-card-title-right flex-center'>
        {btnExtra}
        {(isGroup !== true && showCollapse !== false) && <div onClick={setVisible} className={`flex-center ${collapseToggle && 'main-color' || ''}`} style={{cursor: 'pointer'}}>
          {collapseToggle ? '展开' : '收起'}
          <Icon s="m" type={collapseToggle ? "arrow-d" : 'arrow-u'}></Icon>
        </div> || null}
      </div>
    </div>
    <div style={{display: collapseToggle ? 'none': 'block'}}>{children}</div>
  </div>
}