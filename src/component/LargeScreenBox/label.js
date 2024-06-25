import React, { useEffect, useState, useRef } from 'react';
require('./px2rem.scss');
export default function ScreenLabelItem(props) {
  const { children, className, ...attrs } = props;
  return <div {...attrs} className={`pcs-large-screen-label-item ${className}`}>
    {children}
  </div>
}