import React from "react";
import {Table, Form, Input, LocaleProvider, Select, Field, Button, Grid, Nav, Dialog, Pagination, FormCollapse} from '@/component';

import CommonUtil from 'commonPath/common.js';
import API from 'commonPath/api';
//import 'commonPath/common.scss';
// import "./manage.scss";

const {Row, Col} = Grid;
const formItemLayout = {
    labelCol: {fixedSpan: 5},
    wrapperCol: {fixedSpan: 9}
};
const FormItem = Form.Item;

const add = "add";
const modify = "modify";
let operation = "";
let modifyId = "";
let dialogTitle = "";

// 删除确认框
class ConfirmDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            title: props.title,
            content: props.content
        };
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

// 新增/修改弹出框
class OperationDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            title: props.title,
            warehouseList: [],
            dutyGroupList: [],
            serviceIdList: [],
            dutyGroupId: "",
            warehouseId: "",
            serviceId: ""
        };
        this.field = new Field(this, {scrollToFirstError: true});
    }

    onDialogShow() {
        let self = this;
        self.field.reset();
        if (operation === add) {
            this.setState({
                visible: true,
                warehouseList: [],
                dutyGroupList: [],
                serviceIdList: [],
                dutyGroupId: "",
                warehouseId: "",
                serviceId: "",
                title: dialogTitle
            });

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
                    let self = this;
                    self.setState({
                        warehouseList: warehouseNameList
                    })
                }
            });

            // 获取仓库责任组
            CommonUtil.ajax({
                url: API.getCustomerDistributionGroupList,
                type: 'POST',
            }).then((data) => {
                if (data) {
                    let self = this;
                    self.setState({
                        dutyGroupList: data
                    })
                }
            });
            // 获取客服责任组异常类型列表
            CommonUtil.ajax({
                url: API.getCustomerServiceIdListByServiceType,
                type: 'POST'
            }).then((data) => {
                if (data) {
                    let self = this;
                    self.setState({
                        serviceIdList: data
                    })
                }
            });
        } else if (operation === modify) {
            // 获取要修改的实体
            CommonUtil.ajax({
                url: API.getCustomerSysDutygroupRefById,
                type: 'POST',
                data: modifyId
            }).then((data) => {
                if (data) {
                    let self = this;
                    this.field.setValue("serviceId", data.serviceId);
                    this.field.setValue("dutyGroupId", data.dutyGroupId);
                    this.field.setValue("warehouseId", data.warehouseId);
                    self.setState({
                        serviceId: data.serviceId,
                        dutyGroupId: data.dutyGroupId,
                        warehouseId: data.warehouseId,
                        visible: true,
                        title: dialogTitle
                    });

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
                            let self = this;
                            self.setState({
                                warehouseList: warehouseNameList
                            })
                        }
                    });

                    // 获取仓库责任组
                    CommonUtil.ajax({
                        url: API.getCustomerDistributionGroupList,
                        type: 'POST',
                    }).then((data) => {
                        if (data) {
                            let self = this;
                            self.setState({
                                dutyGroupList: data
                            })
                        }
                    });
                    // 获取客服责任组异常类型列表
                    CommonUtil.ajax({
                        url: API.getCustomerServiceIdListByServiceType,
                        type: 'POST'
                    }).then((data) => {
                        if (data) {
                            let self = this;
                            self.setState({
                                serviceIdList: data
                            })
                        }
                    });
                }
            });
        }
    }

    onDialogClose() {
        this.setState({
            visible: false
        });
    }

    handleWareHouseChange(value) {
        let self = this;
        this.field.setValue("warehouseId", value);
        self.setState({
            warehouseId: value
        });
    }

    handleDutyGroupChange(value) {
        let self = this;
        self.state.dutyGroupList.forEach((item) => {
            if (item.value === value) {
                this.field.setValue("dutyGroupName", item.label);
            }
        });
        this.field.setValue("dutyGroupId", value);
        self.setState({
            dutyGroupId: value
        });
    }

    handleServiceIdChange(value) {
        let self = this;
        this.field.setValue("serviceId", value);
        self.setState({
            serviceId: value
        });
    }

    onSubmit() {
        if (operation === add) {
            let self = this;
            self.field.validate((errors, values) => {
                if (errors != null) {
                    return;
                }
                let data = self.field.getValues();
                CommonUtil.ajax({
                    url: API.addCustomerDistributionGroup,
                    type: 'POST',
                    data: data
                }).then((data) => {
                    CommonUtil.alert("新增成功", "提示信息", () => {
                        setTimeout(() => {
                            this.onDialogClose();
                            this.props.onOkCallback();
                        }, 10)
                    });
                }, (error) => {
                    CommonUtil.alert(error.errMsg);
                })
            })
        } else if (operation === modify) {
            let self = this;
            self.field.validate((errors, values) => {
                if (errors != null) {
                    return;
                }
                let updateData = self.field.getValues();
                let data = Object.assign(updateData, {
                    id: modifyId
                });
                CommonUtil.ajax({
                    url: API.updateCustomerDistributionGroup,
                    type: 'POST',
                    data: data
                }).then((data) => {
                    CommonUtil.alert("修改成功", "提示信息", () => {
                        setTimeout(() => {
                            this.onDialogClose();
                            this.props.onOkCallback();
                        }, 10)
                    });
                }, (error) => {
                    CommonUtil.alert(error.errMsg);
                })
            })
        }
    }

    render() {
        const init = this.field.init;
        return (
            <Dialog visible={this.state.visible}
                    onClose={this.onDialogClose.bind(this)}
                    onCancel={this.onDialogClose.bind(this)}
                    onOk={this.onSubmit.bind(this)}
                    title={this.state.title}>
                <Form field={this.field} size="small" direction="hoz" className="search-con">
                    <Row>
                        <Col fixedSpan="15">
                            <FormItem label="仓库简称" labelTextAlign="right" {...formItemLayout}>
                                <Select  {...init('warehouseId', {
                                    rules: {
                                        required: true,
                                        message: '仓库简称不能为空',
                                        trigger: ['onChange']
                                    }
                                })} showSearch hasClear dataSource={this.state.warehouseList}
                                         onChange={this.handleWareHouseChange.bind(this)}
                                         value={this.state.warehouseId}
                                         style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="客服责任组" labelTextAlign="right" {...formItemLayout}>
                                <Select  {...init('dutyGroupId', {
                                    rules: {
                                        required: true,
                                        message: '客服责任组不能为空',
                                        trigger: ['onChange']
                                    }
                                })} showSearch hasClear dataSource={this.state.dutyGroupList}
                                         onChange={this.handleDutyGroupChange.bind(this)}
                                         value={this.state.dutyGroupId}
                                         style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="责任组异常类型" labelTextAlign="right" {...formItemLayout}>
                                <Select  {...init('serviceId', {
                                    rules: {
                                        required: true,
                                        message: '责任组异常类型不能为空',
                                        trigger: ['onChange']
                                    }
                                })} showSearch hasClear dataSource={this.state.serviceIdList}
                                         onChange={this.handleServiceIdChange.bind(this)}
                                         value={this.state.serviceId}
                                         disabled={this.state.serviceIdDisable}
                                         style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Dialog>
        );
    }
}


// 客服责任组业务分配列表页面
class ListQuery extends React.Component {
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
            deleteDataId: "",
            warehouseList: [],
            loading: false
        };
        this.field = new Field(this, {values: {warehouseId: this.getWid()}});
    }

    componentWillMount() {
        let self = this;
        let tableColumn = this.state.tableColumn;
        // 列表内容
        tableColumn = [{"enable": true, "key": "warehouseShort", "name": "仓库简称"},
            {"enable": true, "key": "dutyGroupName", "name": "客服责任组"},
            {"enable": true, "key": "serviceName", "name": "责任组异常类型"},
            {"enable": true, "key": "lastModifiedBy", "name": "最后修改人"},
            {"enable": true, "key": "gmtModified", "name": "修改时间"},
            {"enable": true, "key": "operation", "name": "操作"}
        ];
        tableColumn = self._initTableColumn(tableColumn);
        self.setState({tableColumn: tableColumn});

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
                let self = this;
                self.setState({
                    warehouseList: warehouseNameList
                })
            }
        });
    }

    //装载后立即被调用
    componentDidMount() {
        // this._doSearch();
    }

    handleDelete = (id) => {
        this.setState({deleteDataId: "" + id});
        this.refs.confirmDialog.onDialogShow();
    }

    doDelete = () => {
        let self = this;
        CommonUtil.ajax({
            url: API.deleteCustomerDistributionGroup,
            type: 'POST',
            data: this.state.deleteDataId
        }).then((data) => {
            if (data) {
                CommonUtil.alert("删除成功");
                self._doSearch();
            }
        }, (error) => {
            CommonUtil.alert(error.errMsg);
        })
    };

    handleAdd() {
        operation = add;
        dialogTitle = "新增";
        this.refs.orgsDialog.onDialogShow();
    }

    handleModify = (id) => {
        operation = modify;
        modifyId = id;
        dialogTitle = "编辑";
        this.refs.orgsDialog.onDialogShow();
    };

    // 初始化列表
    _initTableColumn(tableColumn) {
        let self = this;
        tableColumn.forEach((item) => {
            switch (item.key) {
                case "operation":
                    item.width = 100;
                    item.cellRender = self._operationRender.bind(self);
                    break;
                case "lastModifiedBy":
                    item.width = 100;
                    item.cellRender = self._isLastModifiedByRender.bind(self);
                    break;
                case "gmtModified":
                    item.width = 200;
                    item.cellRender = self._isGmtModifiedRender.bind(self);
                    break;
                default:
                    item.width = 200;
                    item.cellRender = self._commonRender.bind(self);
                    break;
            }
        });
        return tableColumn;
    }

    _operationRender(value, index, record, context) {
        return <div className="operation-div"><a 
                                                 onClick={this.handleModify.bind(this, record.id)}>编辑</a>&nbsp;&nbsp;&nbsp;
            <a  onClick={this.handleDelete.bind(this, record.id)}>删除</a></div>;
    }

    _commonRender(value, index, record) {
        if (value || value === 0) {
            return <span>{value}</span>;
        } else {
            return <span>-</span>;
        }
    }

    _isLastModifiedByRender(value, index, record) {
        if (value === "" || value == null) {
            return "";
        }
        let arrValue = value.split("|");
        if (arrValue.length === 2) {
            return arrValue[1];
        }
        return "";
    }

    _isGmtModifiedRender(value, index, record) {
        return value;
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

    // 触发查询
    handleSearch() {
        // 每次点击查询按钮都会重置当前页码
        let paging = this.state.paging;
        paging.currentPage = 1;
        this.setState(paging, () => {
            this._doSearch();
        });
    }

    _doSearch() {
        let self = this;
        let data = self._getSearchParams();
        this.setState({loading: true})
        CommonUtil.ajax({
            url: API.getCustomerSysDutygroupRefList,
            type: 'POST',
            data: data
        }).then((data) => {
            let paging = self.state.paging;
            paging.totalItems = data.total;
            self.setState({
                dataSource: data.result == null ? [] : data.result,
                paging: paging
            });
        }).finally(() => {
            this.setState({loading: false})
        })
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

    handleWareHouseChange(value) {
        this.field.setValue("warehouseId", value);
    }

    render() {
        const init = this.field.init;
        const {tableColumn, dataSource, paging, collapsed} = this.state;
        const {pageSize, totalItems, currentPage} = paging;
        return (
            <div className="page-content pam-wrap">
                <FormCollapse>
                        <Form field={this.field} size="small" direction="hoz" className="search-con">
                            <Row>
                                <Col fixedSpan="12">
                                    <FormItem label="仓库简称" labelTextAlign="right"
                                              {...formItemLayout}>
                                        <Select  {...init('warehouseId')} showSearch hasClear
                                                 dataSource={this.state.warehouseList}
                                                 onChange={this.handleWareHouseChange.bind(this)}
                                                 style={{width: '100%'}}/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <Row>
                            <Col>
                                <Button mr="10" type="normal" onClick={this.handleAdd.bind(this)}>新增</Button>
                                <Button onClick={this.handleSearch.bind(this)} type="primary">查 询</Button>
                            </Col>
                        </Row>
                  </FormCollapse>
                        <OperationDialog ref="orgsDialog" title={dialogTitle}
                                         onOkCallback={this.handleSearch.bind(this)}/>
                        <ConfirmDialog ref="confirmDialog" title="删除确认" content="确认要删除吗?"
                                       onOkCallback={this.doDelete.bind(this)}/>

                        <Table dataSource={dataSource} className="data-table" loading={this.state.loading}>
                            {
                                tableColumn.map((item, index) => {
                                    if (item.key == 'operation') {
                                        return <Table.Column title={item.name} key={index} dataIndex={item.key}
                                                             cell={item.cellRender} width={item.width} lock="right"/>
                                    } else {
                                        return <Table.Column title={item.name} key={index} dataIndex={item.key}
                                                             cell={item.cellRender} width={item.width}/>
                                    }
                                })
                            }
                        </Table>
                        <Pagination className="custom-pagination"
                                    type="normal"
                                    size="small"
                                    pageSizePosition="start"
                                    shape="arrow-only"
                                    pageSizeSelector="dropdown"
                                    pageSize={pageSize}
                                    current={currentPage}
                                    total={totalItems}
                                    onChange={this.onPageChange.bind(this)}
                                    onPageSizeChange={this.onPageSizeChange.bind(this)}/>
            </div>
        );
    }
}

export default  ListQuery