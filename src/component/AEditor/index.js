// import '@wangeditor/editor/dist/css/style.css' // 引入 css
import React, { useState, useEffect, useImperativeHandle, useRef } from 'react'
import { editorConfig, modulesConfig } from './config'
import Editor,  { Quill }  from 'react-quill';
import "react-quill/dist/quill.snow.css";
// 注册行高配置
import "./index.scss";
const Parchment = Quill.import('parchment');
class lineHeightAttributor extends Parchment.Attributor.Class {};
const lineHeightStyle = new lineHeightAttributor(
  "lineheight",
  "ql-lineheight",
  {
    scope: Parchment.Scope.INLINE,
    whitelist: ["", '1', '1-5', '1-75', '2', '3', '4', '5'],
  }
)
Quill.register({"formats/lineHeight": lineHeightStyle}, true);


function AEditor(props, ref) {
  const {value, onChange, field, name, style, ...attrs} = props
  const handleEditorChange = (content, delta, source, editor) => {
    typeof onChange === 'function' && onChange(content)
  }
  return <Editor
    {...attrs}
    style={{
      minHeight: 600,
      ...(style || {})
    }}
    value={value}
    onChange={handleEditorChange}
    modules={modulesConfig}
    {...editorConfig}
  ></Editor>;
  }

export default React.forwardRef(AEditor)