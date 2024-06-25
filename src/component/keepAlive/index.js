import React, {useEffect} from 'react'
import KeepAlive, {useAliveController} from 'react-activation'
import excludeConfig from './config'
export default function _KeepAlive(props) {
  const isExclude = excludeConfig.some(ex => {
    return props.keepKey === ex.key || props.match.path ===  ex.key
  })
  return isExclude? props.children : <KeepAlive
    id={props.keepKey}
    name={props.keepKey}
  >
    {props.children}
  </KeepAlive>
}