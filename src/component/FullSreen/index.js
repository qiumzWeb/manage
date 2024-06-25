import React, {useState, useEffect} from 'react'
import { CnIcon } from '@/component'
import {addWatchFullScreen, getFullscreenElement, CancelFullScreen, getFullScreen} from './api'
const config = {
    1: {
        type: 'fullscreen',
        text: '全屏'
    },
    2: {
        type: 'exit-fullscreen',
        text: '取消全屏'
    }
};
export default function App(props) {
    const {node, ...attrs} = props
    const [type, setType] = useState(config[1].type)
    const [text, setText] = useState(config[1].text)
    useEffect(() => {
        addWatchFullScreen(function success(...args){
            if (getFullscreenElement()) {
                setText(config[2].text)
                setType(config[2].type)
            } else {
                setText(config[1].text)
                setType(config[1].type)
            }
        }, function error(...args){
            console.log(args, '失败')
        })
    }, [])
    return <span style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}} onClick={() => {
        if (getFullscreenElement()) {
            CancelFullScreen()
        } else {
            getFullScreen(node)
        }
    }}>
        {text}
        <CnIcon type={type} ml="2" s="m" {...attrs}></CnIcon>
    </span>
}