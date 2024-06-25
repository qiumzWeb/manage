import React from 'react';
import { getMarginStyle } from 'assets/js/proxy-utils';
export default function ClampEllipsis(props) {
  const { children, maxLine, className, ...attrs }  = props;
  return <div {...attrs} className={`box-clamp-${maxLine || 1}  ${className}`} style={getMarginStyle(attrs)}>{children}</div>
}