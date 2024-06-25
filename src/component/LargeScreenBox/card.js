import React, { useEffect, useState, useRef } from 'react';
require('./px2rem.scss');
export default function ScreenCardItem(props) {
  const { title, children, className, ...attrs } = props;
  return <div {...attrs} className={`pcs-large-screen-card-item ${className}`}>
    <div className='card-item-title'>{title}</div>
    <div>{children}</div>
  </div>
}