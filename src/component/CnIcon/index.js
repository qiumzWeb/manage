import React from 'react';
import { getMarginStyle } from 'assets/js/proxy-utils'
require('./index.scss')

const Component =  React.forwardRef(function (props, ref) {
  const {type, style, s, mt, mr, mb, ml, size, className, ...attrs} = props
  const iconSize = {
    xxs: 'xxs',
    xs: 'xs',
    s: 'small',
    m: 'medium',
    l: 'large',
    xl: 'xl',
    xxl: 'xxl',
    xxxl: 'xxxl',
    i: 'inherit'
  }
  let sizeAttr = {
    size: iconSize['i']
  }
  if (s && iconSize[s]) {
    sizeAttr = {
      size: iconSize[s]
    }
  }
  return <i style={getMarginStyle({style, mt, mr, mb, ml})}
      dataicon={type}
      className={`cn-next-icon cn-ui-icon cn-next-${size || sizeAttr.size} ${className}`}
      {...attrs}
    >
    <svg className="cn-next-icon-remote" width="1em" height="1em" focusable="false">
      <use href={`#icon-${type}`}></use>
    </svg>
  </i>
})
export default Component