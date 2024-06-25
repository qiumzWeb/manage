import React, {useState, useEffect, useRef} from 'react';
import { Icon } from '@/component';
import { isInDialog } from 'assets/js/proxy-utils';
require('./index.scss');

export default function FormCollapse(props) {
  const { children, show = true } = props;
  const [collapseToggle, setCollapseToggle] = useState(false);
  const boxRef = useRef();
  const [collapseToggleVisible, setCollapseToggleVisible] = useState(false);
  // 设置显示和隐藏
  function setVisible() {
    setCollapseToggle((visible) => {
      return !visible
    })
  }
  useEffect(() => {
    setCollapseToggleVisible(!isInDialog(boxRef.current))
  }, [])
  return show ? <div className="pcs-a-form-box" ref={boxRef}>
    <div style={{display: `${collapseToggle ? 'none' : 'block'}`}}>
      {children}
    </div>
    { collapseToggleVisible && <div className='pcs-a-form-collapse'>
      <div className='pcs-a-form-collapse-btn' onClick={() => setVisible()}>
        <Icon mr="5" type={collapseToggle ? "arrow-down" : "arrow-up"}></Icon>
        {collapseToggle ? '展开' : '收起'}
      </div>
    </div> || null}
  </div> : children
}