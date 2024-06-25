import React from 'react'
import { Dialog, Upload, Form, Grid, Icon, Button, Message } from '@/component'
import Cookie from 'assets/js/cookie';
const Row = Grid.Row
const Col = Grid.Col
export default class UploadFile extends React.Component {
  constructor(props) {
    super(props)
    const {getDownloadTemplate, getUpload} = props
    this.getDownloadTemplate = getDownloadTemplate
    this.getUpload = getUpload
    this.state = {
      files: [],
      loading: false
    }
  }
  // 上传
  onOk = async () => {
    if (this.state.loading) return
    this.setState({
      loading: true
    })
    try {
      if (!this.state.files.length) {
        Message.error('请选择上传文件')
        return
      }
      await this.getUpload(this.state.files)
      this.onClose()
    } catch(e) {
      Message.error(e.message)
    }
    this.setState({
      loading: false
    })
  }
  // 下载模板
  downLoadTemplate = () => {
    const warehouseId = this.props.data && this.props.data.warehouseId || Cookie.get('warehouseId')
    this.getDownloadTemplate(warehouseId)
  }
  onClose = () => {
    this.setState({
      files: []
    })
    this.props.onClose()
  }
  render() {
    return <Dialog
      visible={this.props.visible}
      style={{width: '500px'}}
      onClose={() => this.onClose()}
      footer={
        <div>
          <Button type="primary" onClick={() => this.onOk()}> {this.state.loading && <Icon type="loading"/>} {'上传'}</Button>
          <Button style={{marginLeft: '10px'}} onClick={() => this.onClose()}>{'取消'}</Button>
        </div>
      }
      title={this.props.title || '导入生产计划'}
    >
      <Form>
      <Row>
        <Col>
          <Form.Item label={
            <div>
              <span>上传文件</span>
              <span style={{color: "#999"}}>（上传文件之前 ，请先点击此处 <Button
                onClick={() => this.downLoadTemplate()}
                text
                type="primary"
                style={{fontWeight: 'bold'}}
              >
                下载模板
              </Button> ）</span>
            </div>
          }>
          <Upload.Dragger
            className="upload-dragger"
            style={{width: '446px'}}
            action=""
            value={this.state.files}
            dragable={true}
            accept=".xls"
            autoUpload={false}
            listType="text"
            onSelect={(file) => {
              console.log(file, 7777)
              this.setState({
                files: file
              })
            }}
            onRemove={(file) => {
              this.setState({
                files: []
              })
              console.log(file, 8989)
            }}
            beforeUpload={ () => false}
            fileNameRender={file => (
              <span>
                <Icon type="attachment" size="xs" style={{ marginRight: 8 }} />
                {file.name}
              </span>
            )}
            useDataURL={false}
          ></Upload.Dragger>
          </Form.Item>
        </Col>
      </Row>
      </Form>
    </Dialog>
  }
}
