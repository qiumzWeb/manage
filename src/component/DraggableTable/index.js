import React, {useState, useEffect, useImperativeHandle} from 'react'
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import { Table } from '@/component'
import { getNewRow } from '@/component/Draggable/index'

export default React.forwardRef(function App (props, ref) {
  const {onChange, type, ...attrs} = props
  return (
    <DndProvider backend={HTML5Backend}>
        <Table
          ref={ref}
          {...attrs}
          rowProps={(_, index) => ({index})}
          components={{
            Row: getNewRow({
              type,
              dataSource: props.dataSource,
              onDrop: (data) => {
                data.forEach((d, index) => {d.index = index + 1})
                typeof onChange === 'function' && onChange(data)
              },
              Row: Table.SelectionRow
            })
          }}
        ></Table>
    </DndProvider>
  )
})
