import React, {useState, useEffect} from 'react'
import { DialogButton } from '@/component'
import { getResult } from 'assets/js'

export default function DialogButtonModel(option) {
  const { data = {}, getData, refresh, queryListRefresh, beforeShow, ...attrs } = option;
  const [formData, setFormData] = useState(data)
  const [loading, setLoading] = useState(false)
  async function beforeModeShow(...args) {
    setLoading(true)
    getResult(getData, {...data, ...attrs}).then(res => {
      setFormData({...data, ...res})
    }).catch(e => {console.log(e)}).finally(() => {
      setLoading(false)
    })
    return getResult(beforeShow, ...args)
  }
  return <DialogButton
    {...attrs}
    loading={loading}
    data={formData}
    beforeShow={beforeModeShow}
    refresh={refresh ? queryListRefresh : null}
  >{option.button}</DialogButton>
}