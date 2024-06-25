import React from 'react'
import  Action  from './action'
import  Branding  from './branding'
import './index.scss'
export default function Header(props) {
  return (<div className='pcs-header' {...props}>
    <Branding></Branding>
    <Action></Action>
  </div>)
}
