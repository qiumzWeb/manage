import React from 'react';
import { Icon } from '@alifd/next'
import { AssignProps, getMarginStyle } from 'assets/js/proxy-utils'
const cot = require.context('assets/imgs', true, /\.svg|png|jpg$/)
const defineIcon = {}
cot.keys().forEach(entry => {
  const name = entry.replace('./', '').split(/\.svg|png|jpg/)[0]
  defineIcon[name] = cot(entry).default || cot(entry)
})

const Component =  React.forwardRef(function (props, ref) {
  const {maxTagCount, tagInline, style, defineType, s, iconType, mt, mr, mb, ml, ...attrs} = props
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
    size: iconSize['s']
  }
  if (s && iconSize[s]) {
    sizeAttr = {
      size: iconSize[s]
    }
  }
  if (defineType) {
    return <img
      {...attrs}
      style={getMarginStyle({style, mt, mr, mb, ml})}
      src={defineIcon[defineType]}
    ></img>
  }
  return <Icon
    ref={ref}
    {...sizeAttr}
    {...attrs}
    style={getMarginStyle({style, mt, mr, mb, ml})}
  ></Icon>
})
AssignProps(Component, Icon)
export default Component