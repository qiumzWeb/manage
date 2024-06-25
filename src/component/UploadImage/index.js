import React, {useState, useEffect, useImperativeHandle, useRef } from 'react';
import { Upload, ImagePreview, Icon, Dialog, Message } from '@/component'
import { _uid, getObjType } from 'assets/js'
import $http from 'assets/js/ajax'
import API from 'assets/api'
require('./index.scss')
export default React.forwardRef(function UploadImage(props, ref) {
  const {
    value,
    uploadParams,
    action = API.ossUploadWorkOrderImg,
    onChange,
    showDeleteConfirm,
    field,
    ...attrs
  } = props
  const [files, setFiles] = useState(getValue(value))
  const realFiles = useRef(getValue(value))
  const preViewBox = useRef({})
  realFiles.current = files
  useImperativeHandle(ref, () => ({
    getData: () => files
  }))
  // 监听外部传入值变动
  useEffect(() => {
    const newValue = getValue(value)
    setFiles(newValue)
  }, [value])
  // 获取外部传入的value
  function getValue(value) {
    return Array.isArray(value) && value.map(v => ({
      ...v,
      url: v.url || v.imgURL,
      imgURL: v.url || v.imgURL,
      uid: v.uid || _uid()
    })) || []
  }
  // 向外抛出数据
  function setOpenData(fileList, data) {
    if (typeof onChange === 'function') {
      onChange(fileList, data)
    }
  }
  // 选择图片
  async function onSelect(imageList) {
    console.log(imageList, '选择文件')
    const newfiles = [...files, ...imageList]
    setFiles(newfiles)
    // 图片上传获取url
    if (Array.isArray(imageList)) {
      for(let img of imageList) {
        await uploadFile(img)
      }
    }
    setOpenData(newfiles, {state: 'select', files: imageList})
  }
  // 图片删除
  async function onRemove(file) {
    const newfiles = files.filter(p => p.uid !== file.uid)
    setFiles(newfiles)
    setOpenData(newfiles, {state: 'removed', files: [file]})
  }
  // 预览图片
  async function onPreview(file) {
    preViewBox.current(files.findIndex(f => f.uid == file.uid) || 0, files.map(f => f.imgURL))
  }

  // 上传图片获取URL
  async function uploadFile(file) {
    if (!file || (file && !file.originFileObj)) return
    const formData = new FormData()
    formData.append('file', file.originFileObj)
    const params = {}
    if (getObjType(uploadParams) === 'Object') {
      Object.assign(params, uploadParams)
    } else if (typeof uploadParams === 'function') {
      const formValues = field && field.getValues && field.getValues();
      Object.assign(params, uploadParams(formValues) || {})
    }
    Object.entries(params).forEach(([key, val]) => {
      formData.append(key, val)
    })
    // 异步操作，不阻碍用户选择图片预览的行为
    // 由于需求要求用户选择的图片必须存入oss, 固需要偷偷的把图片上传至oss生成URL, 不能告诉用户
    // 危险操作，请勿模仿
    try {
      const res = await $http({
        url: action,
        method: 'post',
        data: formData,
        headers: {
          "Content-Type": 'multipart/form-data;'
        },
      })
      if (res) {
        file.url = res.url
      }
    } catch(e) {
      console.log(e)
    }
  }


  return <div class="pcs-image-upload-box">
    <Upload.Card
      {...attrs}
      accept="image/*"
      className="upload-image-card"
      action=""
      value={files}
      dragable={false}
      autoUpload={false}
      listType="card"
      onSelect={onSelect}
      onRemove={(...args) => {
        if (showDeleteConfirm) {
          Dialog.confirm({
            title: typeof showDeleteConfirm === 'string' ?  showDeleteConfirm : '确定删除该图片？',
            onOk: () => onRemove(...args)
          })
        } else {
          onRemove(...args)
        }
      }}
      beforeUpload={ () => false}
      useDataURL={true}
      itemRender={(file, {remove}) => {
        return <div className="pcs-card-view-box">
            <img src={file.imgURL} style={{ width: "100%", height: "auto" }} />
            <div className='pcs-view-eye-cover'>
              <Icon type="eye" s="l" style={{cursor: 'pointer'}} onClick={() => onPreview(file)}/>
            </div>
            <div className='pcs-img-close' title="删除" onClick={remove}>
              <Icon type="ashbin" s="s" />
            </div>
        </div>
      }}
    ></Upload.Card>
    <ImagePreview>{(_, openPreview) => {
      preViewBox.current = openPreview
    }}</ImagePreview>
  </div>
})