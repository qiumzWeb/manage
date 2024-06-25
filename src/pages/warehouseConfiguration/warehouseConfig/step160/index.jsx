import React from "react";
import {Table, Form, Input, LocaleProvider, Select, Field, Button, Grid, Nav, Dialog, Pagination, NumberPicker, FormCollapse} from '@/component';
import CommonUtil from 'commonPath/common.js';
import API from 'commonPath/api';
import { getStepBaseData, setStepBaseData, saveStepNode, stepJump } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config';
// import "./packageMergeWeightConfig.scss";

//包材配置

const classNames = require('classnames');

const {Row, Col} = Grid;

const FormItem = Form.Item;

const formItemLayout = {
    wrapperCol: {fixedSpan: 9}
};
const add = "add";
const modify = "modify";
const lookup = "lookup";

// 枚举值初始化
let warehouseShortNameList = [];
let operation = "";
let currentOrg = {};
let modifyDialogTitle = "";
let weightTypeList = [];


class ConfirmDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            title: props.title,
            content: props.content
        }
    }

    onDialogClose() {
        this.setState({
            visible: false
        });
    }

    onDialogShow() {
        this.setState({
            visible: true
        });
    }

    onOK() {
        this.onDialogClose();
        this.props.onOkCallback();
    }

    render() {
        return (
            <Dialog visible={this.state.visible}
                    onClose={this.onDialogClose.bind(this)}
                    onCancel={this.onDialogClose.bind(this)}
                    onOk={this.onOK.bind(this)}
                    title={this.state.title}>
                <div>{this.state.content}</div>
            </Dialog>
        );
    }
}

class OrgsDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            title: props.title,
            warehouseShortNameDisabled: false,
            warehouseShortNameValue: "",
            volumeCode: "",
            volumeDescribe: "",
            volumeWeight: "",
            widthOfVolume: '',
            lengthOfVolume:"",
            heightOfVolume: "",
        }
        this.field = new Field(this, {scrollToFirstError: true});
    }


    onWarehouseShortNameChange(value) {
        this.field.setValue("warehouseId", value);
        this.setState({warehouseShortNameValue: value});
    }

    onVolumeDescribeChange(value) {
        this.field.setValue("volumeDescribe", value);
        this.setState({volumeDescribe: value});
    }

    onVolumeCodeChange(value) {
        this.field.setValue("volumeCode", value);
        this.setState({volumeCode: value});
    }

    onVolumeWeightChange(value) {
        this.field.setValue("volumeWeight", value);
        this.setState({volumeWeight: value});
    }

    onWidthOfVolumeChange(value) {
        this.field.setValue("widthOfVolume", value);
        this.setState({widthOfVolume: value});
    }

    onHeightOfVolumeChange(value) {
        this.field.setValue('heightOfVolume', value);
        this.setState({ heightOfVolume: value });
    }


    handleLengthOfVolumeChange(value) {
        this.field.setValue("lengthOfVolume", value);
        this.setState({lengthOfVolume: value});
    }

 

    onDialogClose() {
        this.setState({
            visible: false
        });
    }

    onDialogShow() {
        this.field.reset();
        this.setState({
            title: modifyDialogTitle,
            visible: true
        });
        if (operation === add) {
            this.setState({
                warehouseShortNameDisabled: false,
                warehouseShortNameValue: this.getWid(),
                volumeCode: "",
                volumeDescribe: "",
                volumeWeight: "",
                widthOfVolume: "",
                lengthOfVolume:"",
                heightOfVolume: ""
            });
            this.field.setValue("warehouseId", this.getWid());
            this.field.setValue("volumeCode", "");
            this.field.setValue("volumeDescribe", "");
            this.field.setValue("volumeWeight", "");
            this.field.setValue("lengthOfVolume", "");
            this.field.setValue("widthOfVolume", "");
            this.field.setValue("heightOfVolume", "");
        } else if (operation === modify) {
            let org = currentOrg;
            this.setState({
                warehouseShortNameDisabled: false,
                warehouseShortNameValue: org.warehouseId,
                volumeCode: org.volumeCode,
                volumeDescribe: org.volumeDescribe,
                volumeWeight: org.volumeWeight,
                widthOfVolume: org.widthOfVolume,
                lengthOfVolume:org.lengthOfVolume,
                heightOfVolume: org.heightOfVolume
            });

            console.log(JSON.stringify(this.state));

            this.field.setValue("warehouseId", org.warehouseId);
            this.field.setValue("volumeCode", org.volumeCode);
            this.field.setValue("volumeDescribe", org.volumeDescribe);
            this.field.setValue("volumeWeight", org.volumeWeight);
            this.field.setValue("widthOfVolume", org.widthOfVolume);
            this.field.setValue("heightOfVolume", org.heightOfVolume);
            this.field.setValue("lengthOfVolume", org.lengthOfVolume);
        }
    }

    onSubmit() {
        let self = this;
        if (operation === add) {
            self.field.validate((errors, values) => {
                if (errors != null) {
                    return;
                }

                let data = this.field.getValues();
                CommonUtil.ajax({
                    url: API.addPackageMergeVolumeConfig,
                    type: 'POST',
                    data: {
                      ...data,
                      warehouseId: getStepBaseData().warehouseId
                    }
                }).then((data) => {
                    if (data) {
                      saveStepNode(170)
                        CommonUtil.alert(data, "提示信息", () => {
                            setTimeout(() => {
                                this.onDialogClose();
                                this.props.onOkCallback();
                            }, 10)
                        });
                    }
                }, (error) => {
                    // CommonUtil.alert(error.errMsg);
                })
            })
        } else if (operation === modify) {
            self.field.validate((errors, values) => {
                if (errors != null) {
                    return;
                }

                let updateData = this.field.getValues();
                //组装提交数据
                let data = Object.assign(updateData, {
                    id: currentOrg.id
                });
                CommonUtil.ajax({
                    url: API.modifyPackageMergeVolumeConfig,
                    type: 'POST',
                    data: data
                }).then((data) => {
                    if (data) {
                        CommonUtil.alert(data, "提示信息", () => {
                            setTimeout(() => {
                                this.onDialogClose();
                                this.props.onOkCallback();
                            }, 10)
                        });
                    }
                }, (error) => {
                    // CommonUtil.alert(error.message);
                })
            })
        }
    }

    render() {
        const init = this.field.init;
        const {warehouseValue, volumeCode, volumeDescribe, volumeWeight,lengthOfVolume, widthOfVolume,heightOfVolume} = this.state;
        return (
            <Dialog visible={this.state.visible}
                    onClose={this.onDialogClose.bind(this)}
                    onCancel={this.onDialogClose.bind(this)}
                    onOk={this.onSubmit.bind(this)}
                    title={this.state.title} v2>
                <Form field={this.field} className="search-con">
                    <Row>
                        <Col fixedSpan="15">
                            <FormItem label="仓库名称"
                                      labelTextAlign="right"
                                      {...formItemLayout}>
                                <Input name="warehouseName"  disabled={true}
                                         value={getStepBaseData().warehouseName}
                                         style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="包材编码"
                                      labelTextAlign="right"
                                      {...formItemLayout}>
                                <Input
                                    {...init('volumeCode', {
                                        rules: [
                                            {required: true,message: '包材编码不能为空',trigger: 'onBlur'}
                                        ],
                                        props: {
                                            onChange: this.onVolumeCodeChange.bind(this)
                                        }
                                    })} trim hasClear maxLength={32}
                                    value={this.state.volumeCode}
                                    placeholder="包材编码"
                                    style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="包材描述"
                                      labelTextAlign="right"
                                      {...formItemLayout}>
                                <Input
                                    {...init('volumeDescribe', {
                                        rules: [
                                            { trigger: 'onBlur'}
                                        ],
                                        props: {
                                            onChange: this.onVolumeDescribeChange.bind(this)
                                        }
                                    })} trim hasClear maxLength={32}
                                    value={this.state.volumeDescribe}
                                    placeholder="包材描述"
                                    style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col fixedSpan="15">
                            <FormItem label="包材重量(g)"
                                      labelTextAlign="right"
                                      {...formItemLayout}>
                                <NumberPicker
                                    {...init('volumeWeight', {
                                        rules: [
                                            {format: 'number', message: "只能输入数字", trigger: 'onBlur'}
                                        ],
                                        props: {
                                            onChange: this.onVolumeWeightChange.bind(this)
                                        }
                                    })} trim hasClear precision={2} min={0} max={99999.99}
                                    value={this.state.volumeWeight}
                                    placeholder="包材重量"
                                    style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="包材长(cm)" labelTextAlign="right" {...formItemLayout}>
                                <NumberPicker
                                    {...init('lengthOfVolume', {
                                        rules: [
                                            {format: 'number', message: "只能输入数字", trigger: 'onBlur'}
                                        ],
                                        props: {
                                            onChange: this.handleLengthOfVolumeChange.bind(this)
                                        }
                                    })} trim hasClear precision={2} min={0} max={99999.99}
                                    value={this.state.lengthOfVolume}
                                    placeholder="包材长"
                                    style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="包材宽(cm)"
                                      labelTextAlign="right"
                                      {...formItemLayout}>
                                <NumberPicker
                                    {...init('widthOfVolume', {
                                        rules: [
                                            {format: 'number', message: "只能输入数字", trigger: 'onBlur'}
                                        ],
                                        props: {
                                            onChange: this.onWidthOfVolumeChange.bind(this)
                                        }
                                    })} trim hasClear precision={2} min={0} max={99999.99}
                                    value={this.state.widthOfVolume}
                                    placeholder="包材宽"
                                    style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col fixedSpan="15">
                            <FormItem label="包材高(cm)" labelTextAlign="right" {...formItemLayout}>
                            <NumberPicker
                                    {...init('heightOfVolume', {
                                        rules: [
                                            {format: 'number', message: "只能输入数字", trigger: 'onBlur'}
                                        ],
                                        props: {
                                            onChange: this.onHeightOfVolumeChange.bind(this)
                                        }
                                    })} trim hasClear precision={2} min={0} max={99999.99}
                                    value={this.state.heightOfVolume}
                                    placeholder="包材高"
                                    style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Dialog>
        );
    }
}

export default class OrgsQuery extends React.Component {

    // 数据字段初始化
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            tableColumn: [],
            paging: {
                pageSize: window._pageSize_,
                currentPage: 1,
                totalItems: 0
            },
            collapsed: false, //控制菜单的折叠
            disabled: true,
            dialogTitle: "规则列表",
            deleteDataId: "",
            loading: false,
        }
        this.field = new Field(this);
    }

    // 渲染前触发一次
    componentDidMount() {
        let self = this;
        this.field.setValue("warehouseId", this.getWid());
        self._searchSelectData();
        let tableColumn = [
            { enable: true, key: "warehouseName",        name: "仓库名称", width: 100 },
            { enable: true, key: "volumeCode",           name: "包材编码", width: 100 },
            { enable: true, key: "volumeDescribe",       name: "包材描述", width: 100 },
            { enable: true, key: "volumeWeight",         name: "包材重量(g)", width: 60  },
            { enable: true, key: "lengthOfVolume",       name: "包材长(cm)", width: 60  },
            { enable: true, key: "widthOfVolume",        name: "包材宽(cm)", width: 60  },
            { enable: true, key: "heightOfVolume",       name: "包材高(cm)", width: 60  },
            { enable: true, key: "operation",            name: "操作", width: 80  }
        ];
        tableColumn = self._initTableColumn(tableColumn);
        self.setState({tableColumn: tableColumn});

        CommonUtil.ajax({
            url: API.getPackageMergeWeighingType,
            type: 'GET'
        }).then((data) => {
            if (data) {
                weightTypeList = [];
                data.forEach((item) => {
                    weightTypeList.push({
                        "label": item.description,
                        "value": item.code
                    });
                })
            }
        });
        // 根据默认条件查询
        // if (typeof gWarehouseName != "undefined") {
        //     this.field.setValue("warehouseId", gWarehouseName);
        // }

        // this._doSearch();
    }
    _searchSelectData() {
        CommonUtil.ajax({
            url: API.getWarehouseNameList,
            type: 'GET',
        }).then((data) => {
            if (data && data.data) {
                let warehouseNameList = [];
                data.data.forEach((item) => {
                    warehouseNameList.push({
                        "label": item.warehouseName,
                        "value": item.warehouseId
                    });
                })
                warehouseNameList.unshift({
                    "label": "全部",
                    "value": ""
                });
                warehouseShortNameList = warehouseNameList;
            }
        })
    }

    
    // 初始化列表
    _initTableColumn(tableColumn) {
        let self = this;
        tableColumn.forEach((item) => {
            switch (item.key) {
                case 'operation':
                    item.cellRender = self._operationRender.bind(self);
                    break;
                // case 'heightOfVolume':
                    // item.cellRender = self._weightVerifyTypeRender.bind(self);
                // case 'isNeedBox':
                //     item.cellRender = self._isNeedBoxRender.bind(self);
                //     break;
                // case 'aloneTailPackageMerge':
                //     item.cellRender = self._isNeedBoxRender.bind(self);
                //     break;
                // case 'isMarkMoreException':
                //     item.cellRender=self._isNeedBoxRender.bind(self) ;
                //     break;
                default:
                    item.cellRender = self._commonRender.bind(self);
                    break;
            }
        });
        return tableColumn;
    }



    // _isNeedBoxRender(value) {
    //     if (value === true) {
    //         return <span>是</span>;
    //     } else{
    //         return <span>否</span>;
    //     }
    // }



    _operationRender(value, index, record, context) {
        return <div className="operation-div">
            <a  onClick={this.handleModify.bind(this, record.id)}>修改</a>
            <a  onClick={this.handleDelete.bind(this, record.id)}>删除</a></div>;
    }

    _commonRender(value, index, record) {
        if (value || value === 0) {
            return <span>{value}</span>;
        } else {
            return <span>-</span>;
        }
    }

    _getSearchParams() {
        let searchData = this.field.getValues();
        let paging = this.state.paging;

        //组装提交数据
        let data = Object.assign(searchData, {
            pageNum: paging.currentPage,
            pageSize: paging.pageSize,
        });
        return data;
    }

    _doSearch() {
        let self = this;
        let data = self._getSearchParams();
        this.setState({ loading: true });
        CommonUtil.ajax({
            url: API.getPackageMergeVolumeConfigList,
            type: 'POST',
            data: {
              ...data,
              warehouseId: getStepBaseData().warehouseId
            }
        }).then((data) => {
            let paging = self.state.paging;
            paging.totalItems = data.totalRowCount;
            self.setState({
                loading: false,
                dataSource: data.data,
                paging: paging
            })
        })
    }

    // 触发查询
    handleSearch() {
        let paging = this.state.paging;
        paging.currentPage = 1;
        paging.pageSize = window._pageSize_;
        this.setState(paging, () => {
            this._doSearch();
        });
        // this._doSearch();
    }

    handleAdd() {
        operation = add;
        currentOrg = {};
        modifyDialogTitle = "新增配置";
        this.refs.orgsDialog.onDialogShow();
    }


    handleModify = (id) => {
        if (id == null) {
            return;
        }

        CommonUtil.ajax({
            url: API.getPackageMergeVolumeConfig,
            type: 'POST',
            data: {id: "" + id}
        }).then((data) => {
            if (data) {
                currentOrg = data;
                console.log(currentOrg);
                operation = modify;
                // currentOrg = this.state.dataSource[index];
                modifyDialogTitle = "修改配置";
                this.refs.orgsDialog.onDialogShow();
            }
        }, (error) => {
            CommonUtil.alert(error.errMsg);
        })

    }

    handleDelete = (id) => {
        this.setState({deleteDataId: "" + id});
        this.refs.confirmDialog.onDialogShow();
    }

    doDelete = () => {
        let self = this;
        CommonUtil.ajax({
            url: API.deletePackageMergeVolumeConfig,
            type: 'POST',
            data: {id: this.state.deleteDataId}
        }).then((data) => {
            if (data) {
                CommonUtil.alert("删除成功");
                self._doSearch();
            }
        }, (error) => {
            CommonUtil.alert(error.errMsg);
        })
    }

    // 翻页
    onPageChange(currentPage) {
        let paging = this.state.paging;
        paging.currentPage = currentPage;
        this.setState(paging, () => {
            this._doSearch();
        });
    }

    // 修改本页大小
    onPageSizeChange(pageSize) {
        let paging = this.state.paging;
        paging.pageSize = pageSize;
        paging.currentPage = 1;
        this.setState(paging, () => {
            this._doSearch();
        });
    }

    //  菜单折叠
    onCollapsed(collapsed) {
        this.setState({collapsed: collapsed});
    }

    //监听菜单的折叠
    onMenuCollapsed(collapsed) {
        this.setState({
            collapsed: collapsed
        })
    }

    // 页面渲染
    render() {
        const init = this.field.init;
        const {tableColumn, dataSource, paging, collapsed} = this.state;
        const {pageSize, totalItems, currentPage} = paging;


        return (
            <div className="page-content pam-wrap">
                    <div>
                    <FormCollapse>
                        <Form field={this.field} className="search-con">
                            <Row>
                                <Col fixedSpan="12">
                                    <FormItem label="仓库名称"
                                              labelTextAlign="right"
                                              {...formItemLayout}>
                                        <Input name="warehouseName" disabled value={getStepBaseData().warehouseName} style={{width: '100%'}}/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Button className="action-btn" onClick={this.handleAdd.bind(this)} type="normal">新增包材主数据</Button>
                                <Button className="action-btn" onClick={this.handleSearch.bind(this)} type="primary">查 询</Button>
                            </Row>
                        </Form>
                      </FormCollapse>
                        <OrgsDialog ref="orgsDialog" title={modifyDialogTitle}
                                    onOkCallback={this.handleSearch.bind(this)}/>
                        <ConfirmDialog ref="confirmDialog" title="删除确认" content="确认要删除吗?"
                                       onOkCallback={this.doDelete.bind(this)}/>
                        <Table dataSource={dataSource} inset
                               className="data-table"
                               loading={this.state.loading}>
                            {
                                tableColumn.map((item, index) => {
                                    if (item.key == 'operation') {
                                        return <Table.Column title={item.name} dataIndex={item.key} key={index}
                                                             cell={item.cellRender} width={item.width} lock="right"/>
                                    } else {
                                        return <Table.Column title={item.name} dataIndex={item.key} key={index}
                                                             cell={item.cellRender} width={item.width}/>
                                    }
                                })
                            }
                        </Table>
                        <Pagination className="custom-pagination"
                            inset
                            pageSize={pageSize}
                            current={currentPage}
                            total={totalItems}
                            onChange={this.onPageChange.bind(this)}
                            onPageSizeChange={this.onPageSizeChange.bind(this)}/>
                    </div>
            </div>
        )
    }
}

// ReactDOM.render(<OrgsQuery/>, document.querySelector('.cgdpl-body'));
