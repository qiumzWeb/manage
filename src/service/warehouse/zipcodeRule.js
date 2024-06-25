import React from "react";
import {Table, Form, Input, LocaleProvider, Select, Field, Button, Grid, Nav, Dialog, Pagination} from '@/component';
import CommonUtil from 'commonPath/common.js';
import API from 'commonPath/api';
// import "./zipcodeRule.scss";

//装袋规则配置页面

const classNames = require('classnames');
``
const {Row, Col} = Grid;

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {fixedSpan: 5},
    wrapperCol: {fixedSpan: 9}
};
const add = "add";
const modify = "modify";
const lookup = "lookup";

// 枚举值初始化
let operation = "";
let currentOrg = {};
let modifyDialogTitle = "新增规则";
let countryCodeList = [{"label": "中国大陆", "value": "CN"}, {"label": "中国香港", "value": "HK"}, {
    "label": "新加坡",
    "value": "SG"
}, {"label": "中国台湾", "value": "TW"}, {"label": "澳大利亚", "value": "AU"}];
let matchLevelList = [{"label": "无", "value": "none"}, {"label": "区", "value": "district"}, {
    "label": "市",
    "value": "city"
}];

function loadWarehouseNameList(ref, dataSourceName) {
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
            ref.setState({[dataSourceName]: warehouseNameList});
        }
    })
}

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
            countryCodeDisabled: false,
            countryCodeValue: "",
            matchLevelDisabled: false,
            matchLevelValue: "",
            warehouseList: [],
        }
        this.field = new Field(this, {scrollToFirstError: true});
    }


    onWarehouseShortNameChange(value) {
        this.field.setValue("warehouseId", value);
        this.setState({warehouseShortNameValue: value});
    }

    onCountryCodeChange(value) {
        this.field.setValue("countryCode", value);
        this.setState({countryCodeValue: value});
    }

    onMatchLevelChange(value) {
        this.field.setValue("matchLevel", value);
        this.setState({matchLevelValue: value});
    }


    onDialogClose() {
        this.setState({
            visible: false
        });
    }

    onDialogShow() {
        this.field.reset();
        this.setState({
            visible: true
        });
        loadWarehouseNameList(this, 'warehouseList');
        if (operation === add) {
            this.setState({
                warehouseShortNameDisabled: false,
                warehouseShortNameValue: "",
                countryCodeDisabled: false,
                countryCodeValue: "",
                matchLevelDisabled: false,
                matchLevelValue: "",
            });
            this.field.setValue("warehouseId", this.getWid());
            this.field.setValue("countryCode", "");
            this.field.setValue("matchLevel", "");
        } else if (operation === modify) {
            let org = currentOrg;
            this.setState({
                warehouseShortNameDisabled: false,
                warehouseShortNameValue: org.warehouseId,
                countryCodeDisabled: false,
                countryCodeValue: org.countryCode,
                matchLevelDisabled: false,
                matchLevelValue: org.matchLevel,
            });


            this.field.setValue("warehouseId", org.warehouseId);
            this.field.setValue("countryCode", org.countryCode);
            this.field.setValue("matchLevel", org.matchLevel);

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
                    url: API.addZipcodeValidateRule,
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
                    CommonUtil.alert(error.errMsg);
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
                    url: API.modifyZipcodeValidateRule,
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
                    CommonUtil.alert(error.errMsg);
                })
            })
        }
    }

    render() {
        const init = this.field.init;
        const {warehouseList} = this.state;
        return (
            <Dialog visible={this.state.visible}
                    onClose={this.onDialogClose.bind(this)}
                    onCancel={this.onDialogClose.bind(this)}
                    onOk={this.onSubmit.bind(this)}
                    title={this.state.title}>
                <Form field={this.field} className="search-con">
                    <Row>
                        <Col fixedSpan="15">
                            <FormItem label="仓库名称"
                                      labelTextAlign="right"
                                      {...formItemLayout}>
                                <Select  {...init('warehouseId', {
                                    rules: {
                                        required: true,
                                        message: '仓库名称不能为空',
                                        trigger: ['onBlur', 'onChange']
                                    },
                                    props: {
                                        onChange: this.onWarehouseShortNameChange.bind(this)
                                    }
                                })} showSearch hasClear disabled={this.state.warehouseShortNameDisabled}
                                         value={this.state.warehouseShortNameValue} dataSource={warehouseList}
                                         style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="国家或地区"
                                      labelTextAlign="right"
                                      {...formItemLayout}>
                                <Select  {...init('countryCode', {
                                    rules: {
                                        required: true,
                                        message: '国家地区不能为空',
                                        trigger: ['onBlur', 'onChange']
                                    },
                                    props: {
                                        onChange: this.onCountryCodeChange.bind(this)
                                    }
                                })} showSearch hasClear disabled={this.state.countryCodeDisabled}
                                         value={this.state.countryCodeValue} dataSource={countryCodeList}
                                         style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="匹配级别"
                                      labelTextAlign="right"
                                      {...formItemLayout}>
                                <Select  {...init('matchLevel', {
                                    rules: {
                                        required: true,
                                        message: '匹配级别不能为空',
                                        trigger: ['onBlur', 'onChange']
                                    },
                                    props: {
                                        onChange: this.onMatchLevelChange.bind(this)
                                    }
                                })} showSearch hasClear disabled={this.state.matchLevelDisabled}
                                         value={this.state.matchLevelValue} dataSource={matchLevelList}
                                         style={{width: '100%'}}/>
                            </FormItem>
                        </Col>

                    </Row>
                </Form>
            </Dialog>
        );
    }
}

class OrgsQuery extends React.Component {

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
            warehouseList: [],
        }
        this.field = new Field(this);
    }

    // 渲染前触发一次
    componentDidMount() {
        let self = this;
        this.field.setValue("warehouseId", this.getWid());
        loadWarehouseNameList(this, 'warehouseList');
        self._countryCodeData();
        let tableColumn = [
            {"enable": true, "key": "warehouseName", "name": "仓库名称"},
            {"enable": true, "key": "countryCode", "name": "国家或地区"},
            {"enable": true, "key": "matchLevelName", "name": "匹配级别"},
            {"enable": true, "key": "operation", "name": "操作"}
        ];
        tableColumn = self._initTableColumn(tableColumn);
        self.setState({tableColumn: tableColumn});
        this._doSearch();
    }

    _countryCodeData() {
        CommonUtil.ajax({
            url: API.getDataDictionaryByType,
            type: 'GET',
            data: {dataType: 'COUNTRY'}
        }).then((data) => {
            if (data) {
                if (data) {
                    countryCodeList = data;
                }
            }
        })
    }


    // 初始化列表
    _initTableColumn(tableColumn) {
        let self = this;
        tableColumn.forEach((item) => {
            switch (item.key) {
                case 'operation':
                    item.width = 100;
                    item.cellRender = self._operationRender.bind(self);
                    break;
                default:
                    item.width = 100;
                    item.cellRender = self._commonRender.bind(self);
                    break;
            }
        });
        return tableColumn;
    }


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
        CommonUtil.ajax({
            url: API.getZipcodeValidateRuleList,
            type: 'POST',
            data: data
        }).then((data) => {
            let paging = self.state.paging;
            paging.totalItems = data.total;
            self.setState({
                dataSource: data.result,
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
        modifyDialogTitle = "新增库区";
        this.refs.orgsDialog.onDialogShow();
    }


    handleModify = (id) => {
        if (id == null) {
            return;
        }

        CommonUtil.ajax({
            url: API.getZipcodeValidateRule,
            type: 'POST',
            data: {id: "" + id}
        }).then((data) => {
            if (data) {
                currentOrg = data;
                operation = modify;
                // currentOrg = this.state.dataSource[index];
                modifyDialogTitle = "修改库区";
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
            url: API.deleteZipcodeValidateRule,
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
        const {tableColumn, dataSource, paging, collapsed, warehouseList} = this.state;
        const {pageSize, totalItems, currentPage} = paging;


        return (
            <div className="page-content pam-wrap">
                        <Form field={this.field} className="search-con">
                            <Row>
                                <Col fixedSpan="15">
                                    <FormItem label="仓库名称"
                                              labelTextAlign="right"
                                              {...formItemLayout}>
                                        <Select  {...init('warehouseId')} showSearch hasClear dataSource={warehouseList}
                                                 style={{width: '100%'}}/>
                                    </FormItem>
                                </Col>
                                <Col fixedSpan="4">
                                    <FormItem>
                                        <Button onClick={this.handleSearch.bind(this)} type="primary">查 询</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>

                        <Row className="cn-opt-bar">
                            <Col fixedSpan="6">
                                <Button type="normal" onClick={this.handleAdd.bind(this)}>新增</Button>
                            </Col>
                        </Row>
                        <OrgsDialog ref="orgsDialog" title={modifyDialogTitle}
                                    onOkCallback={this.handleSearch.bind(this)}/>
                        <ConfirmDialog ref="confirmDialog" title="删除确认" content="确认要删除吗?"
                                       onOkCallback={this.doDelete.bind(this)}/>
                        <Table dataSource={dataSource}
                               className="data-table">
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
                                    pageSize={pageSize}
                                    current={currentPage}
                                    total={totalItems}
                                    onChange={this.onPageChange.bind(this)}
                                    onPageSizeChange={this.onPageSizeChange.bind(this)}/>
            </div>
        )
    }
}
export default OrgsQuery
// ReactDOM.render(<OrgsQuery/>, document.querySelector('.cgdpl-body'));
