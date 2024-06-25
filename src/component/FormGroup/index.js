import React, {useState, useEffect, useRef, useImperativeHandle } from 'react'
import { Button, Dialog, Card, Message, Loading } from '@/component'
import AForm from '@/component/AForm'
import { getObjType } from 'assets/js'
import { getChildren } from 'assets/js/proxy-utils'
export default React.forwardRef(function App(props, ref) {
    const {data, group, isDetail, hasBorder, loading, defaultValue, isToggle} = props
    const [formData, setData] = useState(data)
    const [expandData, setExpandData] = useState({})
    const form = {}
    function hasData(g) {
        return getObjType(g) == 'Object'
    }
    if (hasData(group)) {
        Object.keys(group).forEach(key => {
            form[key] = useRef()
        })
    }
    function getShow(show) {
      return typeof show === 'function' ? show({...formData, ...expandData}) : (show !== false)
    }
    function getTitle(title) {
      return typeof title === 'function' ? title({...formData, ...expandData}) : title
    }
    // 公共数据设置
    function setOpenData(data) {
        hasData(data) && setExpandData((preData) => {
          return {
            ...preData,
            ...data
          }
        })
    }

    useEffect(() => {
      setData(data)
      setExpandData({})
    }, [data])

    // 表单校验
    async function getValidate(callback, hasValidate) {
      for(let key in form) {
        const formRef = form[key]
        const f = formRef && formRef.current
        if (hasValidate !== false) {
          const r = await f.validate()
          if (!r) {
            typeof callback == 'function' && callback(false)
            return false
          }
        }
        typeof callback == 'function' && callback(f.getData(), key)
      }
      return true
    }
    useImperativeHandle(ref, () => ({
      // 获取数据集合
        getData: (hasValidate = true) => {
          return new Promise(async(resolve) => {
            const formData = {}
            const result = await getValidate((data) => {
              if (!data) return resolve(data)
              Object.assign(formData, data)
            }, hasValidate)
            if (result) {
              resolve(formData)
            }
          })
        },
        // 获取数据列表
        getDataList: (hasValidate = true) => {
          return new Promise(async(resolve) => {
            const formData = {}
            const result = await getValidate((data, key) => {
              if (!data) return resolve(data)
              formData[key] = data
            }, hasValidate)
            if (result) {
              resolve(formData)
            }
          })
        }
    }))

    return <div style={{position: 'relative'}}>
        <Loading visible={!!loading} style={{left: '45%', top: '30%', position: 'absolute'}}></Loading>
        {hasData(group) && Object.entries(group).map(([key, g]) => {
            if (!getShow(g.show)) {
              delete form[key]
              return null
            }
            const TopExtend = getChildren(props.children).filter(c => c && c.props && c.props.slot === `${key}Extend`)
            const BottomTools = getChildren(props.children).filter(c => c && c.props && c.props.slot === `${key}Tools`)
            return <Card
              hasBorder={hasBorder !== false}
              isToggle={isToggle}
              isGroup={g.isGroup}
              title={getTitle(g.title)}
              key={key} subTitle={g.subTitle}
              showCollapse={g.showCollapse}
              toggleExtra={g.toggleExtra}
            >
                <Card.Content>
                {TopExtend}
                <AForm data={formData} expandData={expandData} isDetail={isDetail} defaultValue={defaultValue} setOpenData={setOpenData} formModel={g.model} ref={form[key]}></AForm>
                {BottomTools}
                </Card.Content>
            </Card>
        }).filter(c => c)}
    </div>
})