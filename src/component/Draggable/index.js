
import React, {useEffect, useState, useImperativeHandle} from 'react';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import classnames from 'classnames';
import { getChildren } from 'assets/js/proxy-utils'
import { deepAssign } from 'assets/js'

export default React.forwardRef(function App (props, ref) {
  const {dataSource, onChange, ...attrs } = props
  const children = getChildren(props.children)
  return (
    <DndProvider backend={HTML5Backend}>
      <div {...attrs} ref={ref}>
        {children.map((c, index) => {
          const Row = getNewRow({
            dataSource,
            onDrop: (data) => {
              typeof onChange === 'function' && onChange(data)
            },
            Row: function(rowProps) {
              const {wrapper, ...others} = rowProps
              const {children, ...ats} = c.props
              const npr = deepAssign({}, others, ats)
              return wrapper(<div {...npr}>{children}</div>)
            }
          })
          return <Row key={index} {...c.props}></Row>
        })}
      </div>
    </DndProvider>
  )
})

export function getNewRow({type='row', onDrop, dataSource, Row = null}) {
  Row = Row || null
  function MyRow (props) {
    const {
      isDragging,
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      className,
      ...others
    } = props;
    const opacity = isDragging ? 0 : 1;
    const style = { ...others.style, cursor: "move" };
  
    const cls = classnames({
      [className]: className,
    });
    return (
      <Row
        {...others}
        style={{ ...style, ...{ opacity } }}
        className={cls}
        wrapper={row => connectDragSource(connectDropTarget(row))}
      />
    );
  }
  return DropTarget(
    type,
    {
      drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) {
          return;
        }
        const dragRow = dataSource[dragIndex];
        const data = [...dataSource];
        data.splice(dragIndex, 1);
        data.splice(hoverIndex, 0, dragRow);
        typeof onDrop === 'function' && onDrop(data)
        monitor.getItem().index = hoverIndex;
      }
    },
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver()
    })
  )(
    DragSource(
      type,
      {
        beginDrag: (dragProps) => {
          return {
            id: dragProps.index,
            index: dragProps.index
          }
        }
      },
      (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
      })
    )(MyRow)
  )
}