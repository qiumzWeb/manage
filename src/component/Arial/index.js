import React from 'react';
import { getMarginStyle } from 'assets/js/proxy-utils';
export default function Arial(props) {
  const { style, children, ...attrs }  = props;
  return <span {...attrs} style={getMarginStyle({
    ...attrs,
    style: {
      ...(style || {}),
      fontFamily: 'Arial, sans-serif'
    }
  })}>{children}</span>
}