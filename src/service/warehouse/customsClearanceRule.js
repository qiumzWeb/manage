import React from "react";
import {Table, Form, Input, LocaleProvider, Select, Field, Button, Grid, Nav, Dialog, Pagination} from '@/component';
import CommonUtil from 'commonPath/common.js';
import API from 'commonPath/api';
// import "./customsClearanceRule.scss";


const classNames = require('classnames');

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
let warehouseShortNameList = [];
let countryList = [{label: 'AU (澳大利亚)', value: 'AU'}, {label: 'JP (日本)', value: 'JP'}, {
    label: 'TW (台湾)',
    value: 'TW'
}, {label: 'HK (香港)', value: 'HK'}];
let currencyCodeList = [{label: 'CNY (人民币)', value: 'CNY'}, {label: 'AUD (澳大利亚元)', value: 'AUD'}, {
    label: 'JPY (日元)',
    value: 'JPY'
}, {label: 'TWD (台湾)', value: 'TWD'}, {label: 'HKD (港币)', value: 'HKD'}];
let operation = "";
let currentOrg = {};
let modifyDialogTitle = "新增规则";

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
            warehouseShortnameDisabled: false,
            warehouseShortnameValue: "",
            countryDisabled: false,
            countryValue: "",
            areaDisabled: false,
            areaValue: "",
            currencyCodeDisabled: false,
            currencyCodeValue: "",
            totalValueDisabled: false,
            totalValueValue: "",
            areaList: [],
        }
        this.field = new Field(this, {scrollToFirstError: true});
    }

    onWarehouseShortNameChange(value) {
        this.field.setValue("warehouseId", value);
        this.setState({warehouseShortnameValue: value});
    }


    onCountryChange(value) {
        this.field.setValue("country", value);
        this.setState({countryValue: value});
        // 根据选中的仓库Id获取对应的巷道
        CommonUtil.ajax({
            url: API.getDistrictByShortCode,
            type: 'GET',
            data: {shortCode: value}
        }).then((data) => {
            if (data) {
                let self = this;
                self.setState({
                    areaList: data,
                    areaDisable: false
                })
            }
        });
    }

    onAreaChange(value) {
        this.field.setValue("area", value);
        this.setState({areaValue: value});
    }

    onCurrencyCodeChange(value) {
        this.field.setValue("currencyCode", value);
        this.setState({currencyCodeValue: value});
    }


    onTotalValueChanage(value) {
        this.field.setValue("totalValue", value);
        this.setState({totalValueValue: value});
    }


    onDialogClose() {
        this.setState({
            visible: false
        });
    }

    // onDialogShow() {
    //     let self = this;
    //     self.field.reset();
    //     self.setState({
    //         visible: true
    //     });
    // }

    onDialogShow() {
        this.field.reset();
        this.setState({
            visible: true
        });
        if (operation === add) {
            this.setState({
                warehouseShortnameDisabled: false,
                areaList: [],
                warehouseShortnameValue: "",
                countryDisabled: false,
                countryValue: "",
                areaDisabled: false,
                areaValue: "",
                currencyCodeDisabled: false,
                currencyCodeValue: "",
                totalValueDisabled: false,
                totalValueValue: "",
                areaList: []
            });
        } else if (operation === modify) {
            let org = currentOrg;
            this.setState({
                warehouseShortnameDisabled: false,
                warehouseShortnameValue: org.warehouseId,
                countryDisabled: false,
                countryValue: org.country,
                areaDisabled: false,
                areaValue: org.area,
                currencyCodeDisabled: false,
                currencyCodeValue: org.currencyCode,
                totalValueDisabled: false,
                totalValueValue: org.totalValue

            });
            this.field.setValue("warehouseId", org.warehouseId);
            this.field.setValue("country", org.country);
            this.field.setValue("area", org.area);
            this.field.setValue("currencyCode", org.currencyCode);
            this.field.setValue("totalValue", org.totalValue);

            // 根据选中的仓库Id获取对应的巷道
            CommonUtil.ajax({
                url: API.getDistrictByShortCode,
                type: 'GET',
                data: {shortCode: org.country}
            }).then((data) => {
                if (data) {
                    let self = this;
                    self.setState({
                        areaList: data
                    })
                }
            });
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
                    url: API.saveCustomslLiquidationValue,
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
                    url: API.saveCustomslLiquidationValue,
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
        const {warehouseValue} = this.state;
        return (
            <Dialog visible={this.state.visible}
                    onClose={this.onDialogClose.bind(this)}
                    onCancel={this.onDialogClose.bind(this)}
                    onOk={this.onSubmit.bind(this)}
                    title={this.state.title}>
                <Form field={this.field} className="search-con">
                    <Row>
                        <Col fixedSpan="15">
                            <FormItem label="仓库简称"
                                      labelTextAlign="right"
                                      {...formItemLayout}>
                                <Select  {...init('warehouseId', {
                                    /* rules: {
                                        required: true,
                                        message: '仓库简称不能为空',
                                        trigger: ['onBlur','onChange']
                                    },*/
                                    props: {
                                        onChange: this.onWarehouseShortNameChange.bind(this)
                                    }
                                })} showSearch hasClear disabled={this.state.warehouseShortnameDisabled}
                                         value={this.state.warehouseShortnameValue} dataSource={warehouseShortNameList}
                                         style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="国家" labelTextAlign="right" {...formItemLayout}>
                                <Select
                                    {...init('country', {
                                        rules: {
                                            required: true,
                                            message: '国家不能为空',
                                            trigger: ['onBlur', 'onChange']
                                        },
                                        props: {
                                            onChange: this.onCountryChange.bind(this)
                                        }
                                    })} trim hasClear disabled={this.state.countryDisabled}
                                    value={this.state.countryValue} dataSource={countryList} style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="区域" labelTextAlign="right" {...formItemLayout}>
                                <Select
                                    {...init('area', {
                                        rules: {
                                            required: true,
                                            message: '区域不能为空',
                                            trigger: ['onBlur', 'onChange']
                                        },
                                        props: {
                                            onChange: this.onAreaChange.bind(this)
                                        }
                                    })} trim hasClear disabled={this.state.areaDisabled} value={this.state.areaValue}
                                    dataSource={this.state.areaList} style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col fixedSpan="15">
                            <FormItem label="币种" labelTextAlign="right" {...formItemLayout}>
                                <Select
                                    {...init('currencyCode', {
                                        rules: {
                                            required: true,
                                            message: '币种不能为空',
                                            trigger: ['onBlur', 'onChange']
                                        },
                                        props: {
                                            onChange: this.onCurrencyCodeChange.bind(this)
                                        }
                                    })} trim hasClear disabled={this.state.currencyCodeDisabled}
                                    value={this.state.currencyCodeValue} dataSource={currencyCodeList}
                                    style={{width: '100%'}}/>
                            </FormItem>
                        </Col>
                        <Col fixedSpan="15">
                            <FormItem label="清关价值上限" labelTextAlign="right" {...formItemLayout}>
                                <Input
                                    {...init('totalValue', {
                                        rules: [],
                                        props: {
                                            onChange: this.onTotalValueChanage.bind(this)
                                        }
                                    })} trim hasClear disabled={this.state.totalValueDisabled}
                                    value={this.state.totalValueValue} placeholder="" style={{width: '100%'}}/>
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
            dialogTitle: "巷道列表",
            deleteDataId: "",
        }
        this.field = new Field(this);
    }

    // 渲染前触发一次
    componentDidMount() {
        let self = this;
        this.field.setValue("warehouseId", this.getWid());
        self._searchSelectData();
        let tableColumn = [{"enable": true, "key": "warehouseShortname", "name": "仓库简称"},
            {"enable": true, "key": "countryName", "name": "国家"},
            {"enable": true, "key": "area", "name": "区域"},
            {"enable": true, "key": "currencyCode", "name": "币种"},
            {"enable": true, "key": "totalValue", "name": "清关价值上限"},
            {"enable": true, "key": "operation", "name": "操作"}
        ];
        tableColumn = self._initTableColumn(tableColumn);
        self.setState({tableColumn: tableColumn});
        // 根据默认条件查询
        if (typeof gWarehouseName != "undefined") {
            this.field.setValue("warehouseId", gWarehouseName);
        }

        this._doSearch();
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
        });
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
        return <a  onClick={this.handleModify.bind(this, index)}>修改</a>;
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
            url: API.getCustomsLiquidationRuleList,
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


    handleModify = (index) => {
        if (this.state.dataSource[index] == null) {
            return;
        }

        operation = modify;
        currentOrg = this.state.dataSource[index];
        modifyDialogTitle = "修改库区";
        this.refs.orgsDialog.onDialogShow();
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
                        <Form field={this.field} className="search-con">
                            <Row>
                                <Col fixedSpan="15">
                                    <FormItem label="仓库简称"
                                              labelTextAlign="right"
                                              {...formItemLayout}>
                                        <Select  {...init('warehouseId')} showSearch hasClear
                                                 dataSource={warehouseShortNameList} style={{width: '100%'}}/>
                                    </FormItem>
                                </Col>
                                <Col fixedSpan="15">
                                    <FormItem label="国家"
                                              labelTextAlign="right"
                                              {...formItemLayout}>
                                        <Select  {...init('country')} trim hasClear dataSource={countryList}
                                                 placeholder="" style={{width: '100%'}}/>
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
            </div>
        )
    }
}

