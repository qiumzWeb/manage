import React from 'react';
import { Upload, Icon, Button } from '@/component';
import { getResult, getObjType } from 'assets/js';

// 补全导入组件模板
export function getMergeImportConfig(config) {
  if (getObjType(config) === 'Object') {
    Object.values(config).forEach(item => {
      if (item.componentType === 'import' && !item.component) {
        Object.assign(item, getImportModel(item))
      }
    })
  }
}

// 导入模板
export function getImportModel(props) {
  const { fileName, label, onDownload } = props
  const path = /^\/|https?/.test(fileName) ? fileName : `/files/${fileName}`
  let baseLabel = <span>
    上传文件之前，请先点击此处<Button text type="link" onClick={async () => {
      if (typeof onDownload === 'function') {
        await onDownload();
      } else {
        window.downloadFile(path);
      }
    }}>下载模板</Button>
  </span>
  return {
    label: <span>
      {label}
      {label ? <>
        ({baseLabel})
      </> : baseLabel}
    </span>,
    component: Upload.Dragger,
    required: true,
    span: 24,
    attrs: {
      action:"",
      dragable: true,
      accept: ".xls,.xlsx",
      limit: 1,
      autoUpload: false,
      listType: "text",
      beforeUpload: () => false,
      fileNameRender: file => (
        <span>
          <Icon type="attachment" size="large" style={{ marginRight: 8 }} />
          {file.name}
        </span>
      ),
      useDataURL: false
    }
  }

}