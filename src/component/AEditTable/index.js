
import React, {useImperativeHandle, useState, useMemo, useEffect, useRef} from 'react'
import { Table, Input, Field, Message } from '@/component'
import {getUuid, isEmpty, getObjType as isType, isTrue, getShortStrToTimeLongStr } from 'assets/js'
import { getTipsLabel, getRangTime } from '@/report/utils';
import {getChildren} from 'assets/js/proxy-utils'
import dayjs from 'dayjs'
export default React.forwardRef((props, ref) => {
  const { children, data = [], columns, dataChange, excludeKeys, getOpenFields, onlyNeedShowKey, ...attrs } = props;
  const editLock = useRef(false)
  const timeCodelike = useRef({})
  const dataFormats = useRef({});
  // 缓存实时数据
  const realData = useRef(data)
  // 表格数据
  const tableData = getFields(data)
  const requiredKeys = useRef({});
  // 字段状态机
  const columnsMap = useRef({});
  function setColumnsMap(key, updateValue) {
    if (!columnsMap.current[key]) {
      columnsMap.current[key] = {}
    }
    Object.assign(columnsMap.current[key], updateValue)
  }
  useEffect(() => {
    Object.keys(tableData).forEach(k => tableData[k].remove())
    const newData = Array.isArray(data) ?  [...data] : [];
    newData.forEach((d, i) => {
      Object.entries(d).forEach(([ki, v]) => {
        if (timeCodelike.current[ki] || dataFormats.current[ki]) {
          d[ki] = (dataFormats.current[ki])(d, 'inset');
        }
      })
      if (!isEmpty(timeCodelike.current)) {
        Object.keys(timeCodelike.current).forEach((exKey) => {
          d[exKey] = (dataFormats.current[exKey])(d, 'inset');
        })
      }
      tableData[i].setValues(d)
    })
    realData.current = data
    // 向外更新fields
    setOpenFields({hasUpdate: true});
  }, [data])
  // 向外暴露 fields 
  function setOpenFields({fields, hasUpdate}) {
    fields = fields || Object.values(tableData).filter(_ => !isEmpty(_.getValues()))
    if (typeof getOpenFields === 'function') {
      getOpenFields({fields, hasUpdate})
    }
  }
  // 生成实例
  useImperativeHandle(ref, () => ({
    getEditStatus: () => editLock.current,
    getColumnsMap: () => columnsMap.current,
    getData: (flag) => {
      const tData = getTData()
      if (flag) return tData
      if (Object.entries(requiredKeys.current).some(([key, item]) => {
        if (item.value && tData.some(t => {
          return isEmpty(t[key])
        })) {
          Message.warning({title: <span>{item.name}必填</span>})
          return true
        }
        // 子组件校验
        if (typeof item.expandValidate === 'function') {
          const result = item.expandValidate()
          if (result === false) {
            return true
          }
        }
        // 当前组件校验
        if (Array.isArray(item.validate) && tData.some(t => {
          return item.validate.some(v => {
            if (v.key) {
              // 优先 自定义校验 cb(value, record, tableData)
              if (typeof v.cb === 'function') {
                const result = v.cb(t[v.key], t, tData)
                if (typeof result === 'string') {
                  Message.warning(result)
                  return true
                }
                if (result === false) {
                  return true
                }
              } // 校验值是否为空
              else if (isEmpty(t[v.key])) {
                Message.warning(v.msg)
                return true
              }
            }
            return false
          })
        })) {
          return true
        }
        return false
      })) {
        return false
      }
      return tData
    }
  }))

  // 获取数据
  function getTData() {
    const newData = Array.isArray(realData.current) && realData.current.map((_, i) => {
      const d = { ...tableData[i].getValues() }
      // 格式化数据
      Object.entries(d).forEach(([ki, v]) => {
        if (timeCodelike.current[ki]) {
            const result = dataFormats.current[ki](d, 'output')
            Object.assign(d, result)
        } else {
          if (dataFormats.current[ki]) {
            Object.entries(d).forEach(([ki, v]) => {
              let value = v
              if (dataFormats.current[ki]) {
                value = (dataFormats.current[ki])(d, 'output');
              }
              if (isType(value) === 'Object' && columns[ki].useDetailValue) {
                Object.assign(d, value);
              }
            })
          }
        }


      })
      // 如果只需要获取显示的字段， 则删除不显示的字段
      if (onlyNeedShowKey) {
        const hideKey = Object.entries(columnsMap.current).filter(([k, v]) => !v.show).map(([k, v]) => k);
        hideKey.forEach(k => {delete d[k]});
      }
      Array.isArray(excludeKeys) && excludeKeys.forEach(k => {delete d[k]})
      return d
    }) || []
    return newData
  }
  // 只支持 100条数据处理，
  function getFields(data) {
    const tArr = new Array(100).fill({})
    Array.isArray(data) && data.forEach((d, i) => tArr[i] = d)
    const tdata = {}
    tArr.forEach((d, index) => {
      tdata[index] = Field.useField({values: d})
    });
    return tdata
  }

  // 获取自定义插槽组件
  const slotColumns = useMemo(() => {
    const slotColumnsModel = {}
    const slotScope = getChildren(children).filter((c) => c && c.props && c.props.slot === 'tableCell');
    slotScope.forEach((s) => {
      const prop = s?.props?.prop;
      if (!(prop in columns)) {
        slotColumnsModel[prop] = {};
      } else {
        slotColumnsModel[prop] = columns[prop]
      }
      slotColumnsModel[prop].cell = (...args) => {
        const child = s.props.children;
        return typeof child === 'function' ? child(...args) : child;
      };
    });
    return slotColumnsModel;
  }, [children, columns])


  // 生成 tableColumns
  const getColumns = (columns) => {
    const tc = {};
    if (props.showIndex) {
      Object.assign(
        tc,
        {
          index: { title: '序号', width: 80 },
        },
        columns,
        slotColumns
      );
    } else {
      Object.assign(tc, columns, slotColumns);
    }

    return Object.entries(tc).map(([key, item], index) => {
      const { title, tips, cell, component, attrs, required, edit, show, columnWidth, format, transTimeCode, ...prop } = item
      // 添加默认width
      if(isEmpty(prop.width) && isTrue(columnWidth)) {
        prop.width = columnWidth
      }
      // 是否显示
      const cShow = typeof show === 'function' ? show(props.data, key, item, index) : (show !== false)
      setColumnsMap(key, {show: cShow})
      if (!cShow) return null
      // 格式title
      const t = (...a) => typeof title === 'function' ? title(...a) : title
      const titleStr = t(props.data, key, item, index)
      let cTitle = titleStr
      // 获取必填属性
      const cRequired = typeof required === 'function' ? required(props.data, key, item, index) : (required || false)
      if (cRequired) {
        cTitle = (<div>
            <span style={{color: 'red'}}>*</span>
            <span>{titleStr}</span>
          </div>)
      }
      // 全局添加tips
      if (tips && cTitle) {
        cTitle = getTipsLabel(cTitle, tips)
      }
      if (!requiredKeys.current[key]) {
        requiredKeys.current[key] = {}
      }
      requiredKeys.current[key] = {
        ...requiredKeys.current[key],
        name: titleStr,
        value: cRequired,
        validate: item.validate
      }
      
      // 列表渲染
      const cellRender = () => {
        // child 渲染
        let child = cell || ((value, rowIndex) => tableData[rowIndex].getValue(key))
        // 获取可编辑项
        const isEdit = typeof edit === 'function' ? edit(props.data, key, item, index) : edit
        // 可编辑属性
        if (isEdit) {
          if (typeof format === 'function') {
            // action : inset: 设置 field value, output: 输出 formData 数据
            dataFormats.current[key] = (cellData, action) => {
              return format(cellData[key], {cellData, form: ref.current, action})
            }
          }
          // 处理时间组件数据
          if (Array.isArray(transTimeCode)) {
            const [start, end] = transTimeCode;
            timeCodelike.current[key] = transTimeCode;
            dataFormats.current[key] = (cellData, action) => {
              const result = {
                inset: ((cellData[start] || cellData[end])
                      ? [
                        dayjs(getShortStrToTimeLongStr(cellData[start])),
                        dayjs(getShortStrToTimeLongStr(cellData[end]))
                      ]
                      : cellData[key]) || [],
                output: getRangTime(cellData, {
                  time: key,
                  start,
                  end,
                  fmt: format,
                  isSaveOldKey: true
                })
              }
              return result[action]
            }
          }
          const Com = component || cell || Input
          const { onChange, disabled, ...aProps } = attrs || {}
          const fields =  Object.values(tableData).filter(_ => !isEmpty(_.getValues()))
          // 向外暴露fields
          setOpenFields({fields})
          child = (value, rowIndex, record, context) => {
            const cellData = tableData[rowIndex].getValues()
            const cDisabled = props.disabled === true ? true : (typeof disabled === 'function' ? disabled(cellData, rowIndex, fields) : (disabled || false))
            return <Com
              style={{width: '100%'}}
              {...aProps}
              record={record}
              rowindex={rowIndex}
              fields={fields}
              field={tableData[rowIndex]}
              value={tableData[rowIndex].getValue(key)}
              disabled={cDisabled}
              validate={(cb) => {
                // 子组件校验规则
                requiredKeys.current[key].expandValidate = cb
              }}
              onChange={(val, ...args) => {
                editLock.current = true
                tableData[rowIndex].setValue(key, val)
                typeof onChange === 'function' && onChange(val, rowIndex, tableData[rowIndex], fields, ...args)
                typeof dataChange === 'function' && dataChange(getTData())
              }}
            ></Com>
          }
        }
        // 更新字段状态
        setColumnsMap(key, {
          name: titleStr,
          required: cRequired,
          validate: item.validate,
          show: cShow,
          editable: isEdit,
          tips: tips,
        })
        return <Table.Column title={cTitle} dataIndex={key} {...prop} cell={child} key={getUuid()} />
      }

      // 群组列表渲染
      const GroupCellRender = (childColumns) => {
        return <Table.ColumnGroup title={cTitle} dataIndex={key} key={getUuid()}>
          {getColumns(childColumns)}
        </Table.ColumnGroup>
      }

      return isType(item.children) === 'Object' ? GroupCellRender(item.children) : cellRender();
    }).filter(c => c);
  };
  return <Table dataSource={data} copyHide inset {...attrs}>
    {getColumns(columns)}
  </Table>
})