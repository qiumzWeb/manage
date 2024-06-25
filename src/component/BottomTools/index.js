import React from 'react';

export default function BottomTools(props) {
  const { className, ...attrs } = props
  return <div
    {...attrs}
    className={`table-scroll-mark flex-center ${className}`}
  ></div>
}