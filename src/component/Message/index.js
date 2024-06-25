import React, {useState} from 'react'
import {Message} from '@alifd/next'
import {Notification} from '@/component'
import { AssignProps } from 'assets/js/proxy-utils'
import {getFullscreenElement, addWatchFullScreen} from '@/component/FullSreen/api'
export default function App(props) {
  return <Message {...props}></Message>
}
AssignProps(App, Message)
addWatchFullScreen(() => {
  const node = getFullscreenElement()
  if (node) {
    AssignProps(App, Notification, (key, to, from) => {
      to[key] = function(msg) {
        if(typeof msg === 'string') {
          from[key]({
            title: msg
          })
        } else {
          from[key](msg)
        }
      }
    })
  } else {
    AssignProps(App, Message)
  }
})



