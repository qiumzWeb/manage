import React, {useEffect, useState } from 'react'
import Bus from 'assets/js/bus'
import MenuTree from './menu'
import './index.scss'
export default function Menus(props) {
  const [collapse, setCollapse] = useState(Bus.getState('collapse'))
  useEffect(() => {
    const unBus = Bus.watch('collapse', (state) => {
        setCollapse(state.collapse)
    })
    return () => {
      unBus()
    }
  }, [])
  return <div className={`pcs-left-nav ${collapse && 'closed' || 'opened'}`} style={{padding: collapse && '20px 0' || '20px 6px'}}>
    <div className='pcs-menu'>
      <MenuTree
        mode={collapse ? 'popup' : 'inline'}
        openMode="single"
        iconOnly={collapse}
        hasTooltip={collapse}
        hasArrow={!collapse}
        triggerType={collapse && 'hover' || 'click'}
        popupAlign="follow"
        collapse={collapse}
        activeDirection={null}
        popupClassName="menuPopBox"
      >
      </MenuTree>
    </div>

  </div>
}
