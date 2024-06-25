import React, {useState, useEffect} from 'react';
import { CnIcon } from '@/component'
import { getDevice } from 'assets/js'
import Bus from 'assets/js/bus'
import './index.scss'
export default function CollapseBtn(props) {
  const isPhone = getDevice().isPhone
  const [collapse, setCollapse] = useState(isPhone)
  const setStatus = (collapse) => {
    setCollapse(collapse)
    Bus.setState({collapse})
  }
  const watchDeviceSize = () => {
    if (
      !getDevice().isPhone &&
      window.innerWidth < 1000 &&
      !collapse
    ) {
      setStatus(true)
    }
  }
  useEffect(() => {
    Bus.setState({collapse: isPhone})
    window.addEventListener('resize', watchDeviceSize, false)
    return () => {
      window.removeEventListener('resize', watchDeviceSize, false)
    }
  }, [])

  return <div className="collapse-bar" style={props.style} onClick={() => {setStatus(!collapse)}}>
    <CnIcon
      style={{marginRight: collapse && '5px' || 0, color: '#333'}}
      s="m"
      // type={collapse ? 'toggle-right' : 'toggle-left'}
      type={collapse ? 'collapse-left' : 'collapse-right'}
    ></CnIcon>
  </div>
}
