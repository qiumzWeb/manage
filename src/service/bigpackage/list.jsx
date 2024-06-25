import React from "react";
import {
  Table, DatePicker, Card, Message, Range, Radio, Loading,
  Form, Input, LocaleProvider, Select, Field, Button,
  Grid, Nav, Dialog, Pagination, FormCollapse
} from '@/component';
import CommonUtil from 'commonPath/common.js';
import CUSTOMER_API from 'commonPath/api/customer-api';
import moment from 'moment';
import {getWid} from 'assets/js';
import ExportFile from '@/component/ExportFile'
import AForm from "@/component/AForm/index";
// //import 'commonPath/common.scss';
// import "./list.scss";

const formItemLayout = {
    labelCol: { fixedSpan: 4 },
    wrapperCol: { fixedSpan: 10 }
};

const colItemLayout = { fixedSpan: 12 }
const RadioGroup = Radio.Group;
const { Row, Col } = Grid;
const maxCount = 250;
const FormItem = Form.Item;
let currentSelectedRowKeys = [];
let _currentBigPackageId = "";
let _currentWarehouseId = getWid() && +getWid() || "";
const queryString = require("querystring");
const BIG_PACKAGE_STATUS = {
    "rejected": -10,
    "signed": 5,
    "finished": 10,
}

class ListQuery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defineSearchComponent: null,
            tableDataSource: [],
            warehouseSource: [],
            cpResourceSource: [],
            bigPackageStatusSource: [],
            signTimeDisabled: true,
            rejectTimeDisabled: true,
            tableColumn: [],
            rowSelection: {
                onChange: this.onRowSelectionChange.bind(this),
                onSelect: function (selected, record, records) {
                    console.log('onSelect------', selected, record, records);
                },
                onSelectAll: function (selected, records) {
                    console.log('onSelectAll------', selected, records);
                },
                selectedRowKeys: [],
            },
            paging: {
                pageSize: window._pageSize_,
                currentPage: 1,
                totalCount: 0
            },
            loadingVisible: false,
        };
        // 直接可传递到后台的field
        let endTime = moment();
        let startTime = moment().startOf('day');
        this.field = new Field(this, {values: {
            createTimeStart: startTime,
            createTimeEnd: endTime,
            warehouseId: this.getWid()
        }});
    }

    //装载后立即被调用
    componentDidMount() {
        this._init();
        this._initTableColumn();
        this._initCpResourceSource();
    }

    _init() {
        this._getWarehouseNames();
        this._getBigPackageStatus();
    }

    /**
     * 将来可能会用接口获取，这里暂时先写死，因为基本不变
     * * 全部
     * * LZD-TBC分拨中心
     * * 菜鸟东莞分拨中心-分拨
     * * 燕文东莞仓-分拨
     */
    _initCpResourceSource() {
        this.setState({
            cpResourceSource: [
                {
                    label: "递四方深圳机场仓-分拨",
                    value: "Tran_Store_13423770"
                },
                {
                    label: "菜鸟东莞分拨中心-分拨",
                    value: "Tran_Store_13424631"
                },
                {
                    label: "燕文杭州仓-分拨",
                    value: "Tran_Store_13423966"
                },
                {
                    label: "LZD-TBC分拨中心",
                    value: "Tran_Store_13474141"
                },
                {
                    label: "入库分拣机",
                    value: "in_stock_sorting"
                },
                {
                    label: "递四方深东仓-分拨",
                    value: "TRAN_STORE_30299685"
                },
                {
                    label: "递四方深西仓-分拨",
                    value: "TRAN_STORE_30299953"
                },
                {
                    label: "递四方东莞定制仓-分拨",
                    value: "TRAN_STORE_30320880"
                },
                {
                    label: "燕文北京仓-分拨",
                    value: "Tran_Store_13423965"
                },
                {
                    label: "燕文昆山仓-分拨",
                    value: "Tran_Store_13423967"
                },
                {
                    label: "燕文深圳仓-分拨",
                    value: "Tran_Store_13423968"
                },
                {
                    label: "燕文义乌仓-分拨",
                    value: "Tran_Store_13423969"
                },
                {
                    label: "燕文东莞仓-分拨",
                    value: "Tran_Store_13452137"
                },
                {
                    label: "递四方东莞仓-分拨",
                    value: "Tran_Store_13452496"
                },
                {
                    label: "递四方厦门仓-分拨",
                    value: "Tran_Store_13452714"
                },
                {
                    label: "递四方深圳龙华仓-分拨",
                    value: "Tran_Store_13452722"
                },
                {
                    label: "菜鸟华东分拨中心",
                    value: "Tran_Store_13476456"
                },
                {
                    label: "4PX",
                    value: "TRUNK_13474032"
                },
                {
                    label: "华东心怡仓入库分拣机",
                    value: "AE-hdjy-xbrk"
                },
                {
                    label: "调拨出库大包",
                    value: "allocateOut"
                },
                {
                    label: "调拨入库大包",
                    value: "allocateIn"
                },

            ]
        });
    }

    // 仓库列表
    _getWarehouseNames() {
        let self = this;
        // self.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: CUSTOMER_API.getWarehouseNames,
            type: 'GET',
        }).then((data) => {
            if (data.data) {
                let warehouseNameList = [];
                data.data.forEach((item) => {
                    warehouseNameList.push({
                        "label": item.warehouseName,
                        "value": item.warehouseId
                    });
                })
                self.setState({
                    warehouseSource: warehouseNameList
                });
            }
            // self.setState({ loadingVisible: false });
        }, (error) => {
            // this.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取仓库列表失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取仓库列表失败。");
            }
        });
    }

    // 大包状态
    _getBigPackageStatus() {
        let self = this;
        // self.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: CUSTOMER_API.getBigPackageNames,
            type: 'GET',
        }).then((data) => {
            let bigPackageStatus = [];
            console.log("bigPackageStatus:" + JSON.stringify(data));
            for (let k in data) {
                bigPackageStatus.push({
                    "label": data[k],
                    "value": k
                });
            }
            self.setState({
                bigPackageStatusSource: bigPackageStatus
            });
            // self.setState({ loadingVisible: false });
        }, (error) => {
            // this.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                console.log(JSON.stringify(error));
                CommonUtil.alert("获取大包状态失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取大包状态失败。");
            }
        });
    }

    onRowSelectionChange(ids, records) {
        const { rowSelection } = this.state;
        rowSelection.selectedRowKeys = ids;
        currentSelectedRowKeys = ids;
        console.log("onRowSelectionChange:" + currentSelectedRowKeys);
        this.setState({ rowSelection });
    }

    handleExport() {
        if (!_currentWarehouseId) {
            CommonUtil.alert("请选择仓");
            return;
        }
        let self = this;
        let confirmDialogTitle = "数据导出";
        let confirmDialogContent = "当前最多支持导出" + maxCount + "个大包数据";
        Dialog.confirm({
            title: confirmDialogTitle,
            content: confirmDialogContent,
            onOk: () => {
                self.doExcel(maxCount);
            }
        });
    }

    doExcel(size) {
        let param = {};
        if (currentSelectedRowKeys && currentSelectedRowKeys.length > 0) {
            param = {
                warehouseId: _currentWarehouseId,
                bigBagId: currentSelectedRowKeys,
                pageSize: size
            }
        } else {
            let searchParam = this._getSearchParams();
            param = Object.assign(searchParam, {
                pageSize: size
            });
        }

        let jsonStr = JSON.stringify(param);
        param = JSON.parse(jsonStr);
        window.downloadFile(CUSTOMER_API.bigPackageExport + "?" + queryString.stringify(param));
    }

    handleSearch() {
        // 初始化列表
        this.state.paging.currentPage = 1
        this._queryBigPackageList();
    }

    _getSearchParams() {
        let self = this;
        let params = self.field.getValues();
        console.log("createTimeStart:" + self.field.getValue("createTimeStart"));
        if (self.field.getValue("createTimeStart")) {
            params.createTimeStart = self.field.getValue("createTimeStart").format('YYYY-MM-DD HH:mm:ss');
            console.log(self.field.getValue("createTimeStart").format('YYYY-MM-DD HH:mm:ss'));
        }
        if (self.field.getValue("createTimeEnd")) {
            params.createTimeEnd = self.field.getValue("createTimeEnd").format('YYYY-MM-DD HH:mm:ss');
        }
        if (self.field.getValue("modifyTimeStart")) {
            params.modifyTimeStart = self.field.getValue("modifyTimeStart").format('YYYY-MM-DD HH:mm:ss');
        }
        if (self.field.getValue("modifyTimeEnd")) {
            params.modifyTimeEnd = self.field.getValue("modifyTimeEnd").format('YYYY-MM-DD HH:mm:ss');
        }
        if (self.field.getValue("moveTimeStart")) {
            params.moveTimeStart = self.field.getValue("moveTimeStart").format('YYYY-MM-DD HH:mm:ss');
        }
        if (self.field.getValue("moveTimeEnd")) {
            params.moveTimeEnd = self.field.getValue("moveTimeEnd").format('YYYY-MM-DD HH:mm:ss');
        }
        if (self.field.getValue("handOverTimeStart")) {
            params.handOverTimeStart = self.field.getValue("handOverTimeStart").format('YYYY-MM-DD HH:mm:ss');
        }
        if (self.field.getValue("handOverTimeEnd")) {
            params.handOverTimeEnd = self.field.getValue("handOverTimeEnd").format('YYYY-MM-DD HH:mm:ss');
        }
        console.log("ppp" + JSON.stringify(params));
        return params;
    }

    //查询大包列表
    _queryBigPackageList() {
        let self = this;
        if (!self.field.getValue('warehouseId')) {
            CommonUtil.alert("请选择仓");
            return;
        }
        let createTimeStart = self.field.getValue('createTimeStart');
        let createTimeEnd = self.field.getValue('createTimeEnd');
        if (createTimeStart==null ||createTimeStart==''
            ||createTimeEnd==null   || createTimeEnd=='') {
            CommonUtil.alert("请选择生成时间");
            return;
        }
        let params = self._getSearchParams();
        let paging = this.state.paging;
        params = Object.assign(params, {
            pageNum: paging.currentPage,
            pageSize: paging.pageSize,
        });
        params = JSON.parse(JSON.stringify(params));

        this.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: CUSTOMER_API.queryBigPackageList,
            type: 'GET',
            data: params
        }).then((data) => {
            this.setState({ loadingVisible: false });
            currentSelectedRowKeys = [];
            let tableDataSource = data.result ? data.result : [];
            let paging = self.state.paging;
            paging.totalCount = data.total;
            const { rowSelection } = this.state;
            rowSelection.selectedRowKeys = [];
            self.setState({
                rowSelection: rowSelection,
                tableDataSource: tableDataSource,
                paging: paging,
            });
        }, (error) => {
            this.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("查询订单失败, " + error.errMsg);
            } else {
                CommonUtil.alert("查询订单失败");
            }
        });
    }

    _initTableColumn() {
        let self = this;
        let tableColumn = [
            { enable: true, key: "warehouseName", name: "仓库名称", width: 120 },
            { enable: true, key: "batchNo", name: "交接批次号", width: 130 },
            { enable: true, key: "bigBagId", name: "大包号", width: 120 },
            { enable: true, key: "bigBagType", name: "大包类型", width: 120 },
            { enable: true, key: "rfidNo", name: "容器号", width: 120 },
            { enable: true, key: "preCpresDesc", name: "大包来源", width: 100 },
            { enable: true, key: "passNo", name: "格口号", width: 100 },
            { enable: true, key: "grossWeight", name: "大包预报重量", width: 80 },
            { enable: true, key: "standardWeight", name: "大包实际重量", width: 80 },
            { enable: true, key: "gmtCreate", name: "生成时间", width: 110 },
            { enable: true, key: "signTime", name: "签收时间", width: 110 },
            { enable: true, key: "rejectTime", name: "拒收时间", width: 110 },
            { enable: true, key: "inStorageTime", name: "入库暂存-移入时间", width: 110 },
            { enable: true, key: "outStorageTime", name: "入库暂存-交出时间", width: 110 },
            { enable: true, key: "storageCode", name: "暂存库区", width: 110 },
            { enable: true, key: "parcelQty", name: "大包内小包数", width: 80 },
            { enable: true, key: "receivedCount", name: "已签收小包数", width: 80 },
            { enable: true, key: "rejectCount", name: "已拒收小包数", width: 80 },
            { enable: true, key: "unsignedCount", name: "未签收小包数", width: 80 },
            { enable: true, key: "statusDesc", name: "大包状态", width: 80 },
            { enable: true, key: "operation", name: "操作", width: 70, lock: true }
        ];
        tableColumn = self._renderTableColumns(tableColumn);
        self.setState({ tableColumn: tableColumn });
    }

    _renderTableColumns(tableColumns) {
        let self = this;
        tableColumns.forEach((item) => {
            switch (item.key) {
                case "operation":
                    item.cellRender = self._operationRender.bind(self);
                    break;
                case "signTime":
                    item.cellRender = self._signTimeRender.bind(self);
                    break;
                case "rejectTime":
                    item.cellRender = self._rejectTimeRender.bind(self);
                    break;
                case "unsignedCount":
                    item.cellRender = self._unsignedCountRender.bind(self);
                    break;
                case "bigBagType":
                    item.cellRender = self._bigBagTypeRender.bind(self);
                    break;
                default:
                    item.cellRender = self._commonRender.bind(self);
                    break;
            }
        });

        return tableColumns;
    }

    _signTimeRender(value, index, record) {
        if (record.status == BIG_PACKAGE_STATUS.signed) {
            return <span>{record.gmtModified}</span>;
        }else if(record.status == BIG_PACKAGE_STATUS.finished){
            return <span>{record.gmtModified}</span>;
        } else {
            return <span>-</span>;
        }
    }

    _rejectTimeRender(value, index, record) {
        if (record.status == BIG_PACKAGE_STATUS.rejected) {
            return <span>{record.gmtModified}</span>;
        } else {
            return <span>-</span>;
        }
    }

    _unsignedCountRender(value, index, record) {
        let count = record.parcelQty - record.receivedCount - record.rejectCount;
        return <span>{count}</span>;
    }

    _bigBagTypeRender(value, index, record) {
        const options = [
            {label: '签收大包', value: '0'},
            {label: '中转大包', value: '1'},
            {label: '调拨出库大包', value: '2'},
            {label: '调拨入库大包', value: '3'},
            {label: '闪电播分拨大包', value: '4'},
        ]
        return (options.find(o => o.value == record.bigBagType) || {label: '--'}).label
    }

    _operationRender(value, index, record) {
        return <a  onClick={this.handleDetail.bind(this, record.id)}>详情</a>;
    }

    handleDetail(bigPackageId) {
        _currentBigPackageId = bigPackageId;
        this.refs.detailDialog.onDialogShow(bigPackageId);
    }

    _commonRender(value, index, record) {
        if (value || value === 0) {
            return <span>{value}</span>;
        } else {
            return <span>-</span>;
        }
    }

    // 翻页
    onPageChange(currentPage) {
        let paging = this.state.paging;
        paging.currentPage = currentPage;
        this.setState(paging, () => {
            this._queryBigPackageList();
        });
    }

    // 修改本页大小
    onPageSizeChange(pageSize) {
        let paging = this.state.paging;
        paging.pageSize = pageSize;
        paging.currentPage = 1;
        this.setState(paging, () => {
            this._queryBigPackageList();
        });
    }

    _isEmpty(val) {
        if (typeof val === 'undefined'
            || val == null
            || val.length === 0) {
            return true;
        }
        return false
    }

    onTimeChange(name, val) {
        console.log(val);
        if (!val) {
            this.field.remove(name);
        } else {
            this.field.setValue(name, val);
        }
    }

    onWarehouseChange(value) {
        let self = this;
        self.field.setValue("warehouseId", value);
        _currentWarehouseId = value;
    }

    onCpResourceChange(value) {
        console.log(`preCpresCode = ${value}`);
        this.field.setValue("preCpresCode", value);
    }

    onBigPackageStatusChange(value) {
        let self = this;
        let signDisabled = true;
        let rejectDisabled = true;
        self.field.setValue("status", value);
        if (value == BIG_PACKAGE_STATUS.signed) {
            signDisabled = false
        } else if (value == BIG_PACKAGE_STATUS.finished) {
            signDisabled = false
        } else if (value == BIG_PACKAGE_STATUS.rejected) {
            rejectDisabled = false;
        }
        self.setState({
            signTimeDisabled: signDisabled,
            rejectTimeDisabled: rejectDisabled
        });

    }

    markDisableTime(isStartTime, comparedTimeName, currentTime) {
        let self = this;
        let comparedTime = self.field.getValue(comparedTimeName);
        if (!comparedTime || !currentTime) {
            return false;
        }

        // currentTime为开始时间
        if (isStartTime) {
            return comparedTime.valueOf() < currentTime.valueOf();
        } else {
            return currentTime.valueOf() < comparedTime.valueOf();
        }
    }

    // 时间输入是否有效
    _isTimeValidate(startName, endName) {
        let self = this;
        let startTime = self.field.getValue(startName);
        let endTime = self.field.getValue(endName);
        if (!startTime || !endTime) {
            return true;
        }
        return startTime.valueOf() < endTime.valueOf();
    }

    render() {
        const init = this.field.init;
        const { tableColumn, tableDataSource, paging, rowSelection } = this.state;

        return (
            <div className="page-content pam-wrap">
              <FormCollapse>
                        <Form field={this.field} size="small" direction="hoz" className="search-con"
                          defineSearch
                          getDefineComponent={(data) => {
                            this.setState({
                              defineSearchComponent: data
                            })
                          }}
                        >
                            <Row>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="warehouseId" show required>
                                    <FormItem label="仓库简称" labelTextAlign="left" {...formItemLayout}>
                                        <Select {...init('warehouseId')}
                                                dataSource={this.state.warehouseSource}
                                                onChange={this.onWarehouseChange.bind(this)}
                                                showSearch
                                                style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>

                                <Col fixedSpan={colItemLayout.fixedSpan} key="batchNo" show >
                                    <FormItem label="交接批次号" labelTextAlign="left" {...formItemLayout}>
                                        <Input {...init('batchNo')} style={{ width: '100%' }} />
                                    </FormItem>
                                </Col>

                                <Col fixedSpan={colItemLayout.fixedSpan} key="bigBagId" show >
                                    <FormItem label="大包号" labelTextAlign="left" {...formItemLayout}>
                                        <Input {...init('bigBagId')} style={{ width: '100%' }} />
                                    </FormItem>
                                </Col>

                                <Col fixedSpan={colItemLayout.fixedSpan} key="rfidNo" show >
                                    <FormItem label="容器号" labelTextAlign="left" {...formItemLayout}>
                                        <Input {...init('rfidNo')} style={{ width: '100%' }} />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="createTimeStart" show >
                                    <FormItem label="生成时间起" labelTextAlign="left" {...formItemLayout}>
                                        <DatePicker
                                            {...init('createTimeStart')}
                                            disabledDate={this.markDisableTime.bind(this, true, "createTimeEnd")}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            // onChange={this.onTimeChange.bind(this, "createTimeStart")}
                                            style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="createTimeEnd" show >
                                    <FormItem label="生成时间止" labelTextAlign="left" {...formItemLayout}>
                                        <DatePicker
                                            {...init('createTimeEnd')}
                                            disabledDate={this.markDisableTime.bind(this, false, "createTimeStart")}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            // onChange={this.onTimeChange.bind(this, "createTimeEnd")}
                                            style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="modifyTimeStart" show >
                                    <FormItem label="签收时间起" labelTextAlign="left" {...formItemLayout}>
                                        <DatePicker
                                            disabled={this.state.signTimeDisabled}
                                            disabledDate={this.markDisableTime.bind(this, true, "modifyTimeEnd")}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            onChange={this.onTimeChange.bind(this, "modifyTimeStart")}
                                            style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="modifyTimeEnd" show >
                                    <FormItem label="签收时间止" labelTextAlign="left" {...formItemLayout}>
                                        <DatePicker
                                            disabled={this.state.signTimeDisabled}
                                            disabledDate={this.markDisableTime.bind(this, false, "modifyTimeStart")}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            onChange={this.onTimeChange.bind(this, "modifyTimeEnd")}
                                            style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="modifyTimeStart" show >
                                    <FormItem label="拒收时间起" labelTextAlign="left" {...formItemLayout}>
                                        <DatePicker
                                            disabled={this.state.rejectTimeDisabled}
                                            disabledDate={this.markDisableTime.bind(this, true, "modifyTimeEnd")}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            onChange={this.onTimeChange.bind(this, "modifyTimeStart")}
                                            style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="modifyTimeEnd" show >
                                    <FormItem label="拒收时间止" labelTextAlign="left" {...formItemLayout}>
                                        <DatePicker
                                            disabled={this.state.rejectTimeDisabled}
                                            disabledDate={this.markDisableTime.bind(this, false, "modifyTimeStart")}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            onChange={this.onTimeChange.bind(this, "modifyTimeEnd")}
                                            style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>

                                <Col fixedSpan={colItemLayout.fixedSpan} key="status" show >
                                    <FormItem label="大包状态" labelTextAlign="left" {...formItemLayout}>
                                        <Select {...init('status')}
                                                dataSource={this.state.bigPackageStatusSource}
                                                onChange={this.onBigPackageStatusChange.bind(this)}
                                                showSearch
                                                style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>

                                <Col fixedSpan={colItemLayout.fixedSpan} key="preCpresCode" show >
                                    <FormItem label="大包来源" labelTextAlign="left" {...formItemLayout}>
                                        <Select {...init('preCpresCode')}
                                                dataSource={this.state.cpResourceSource}
                                                onChange={this.onCpResourceChange.bind(this)}
                                                showSearch
                                                placeholder="请选择（默认显示全部来源）"
                                                mode="multiple"
                                                hasClear
                                                style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="moveTimeStart" show >
                                    <FormItem label="移入时间起" labelTextAlign="left" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this, true, "moveTimeEnd")}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            onChange={this.onTimeChange.bind(this, "moveTimeStart")}
                                            style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="moveTimeEnd" show >
                                    <FormItem label="移入时间止" labelTextAlign="left" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this, false, "moveTimeStart")}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            onChange={this.onTimeChange.bind(this, "moveTimeEnd")}
                                            style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>

                                <Col fixedSpan={colItemLayout.fixedSpan} key="handOverTimeStart" show >
                                    <FormItem label="交出时间起" labelTextAlign="left" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this, true, "handOverTimeEnd")}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            onChange={this.onTimeChange.bind(this, "handOverTimeStart")}
                                            style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>
                                <Col fixedSpan={colItemLayout.fixedSpan} key="handOverTimeEnd" show >
                                    <FormItem label="交出时间止" labelTextAlign="left" {...formItemLayout}>
                                        <DatePicker
                                            disabledDate={this.markDisableTime.bind(this, false, "handOverTimeStart")}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            onChange={this.onTimeChange.bind(this, "handOverTimeEnd")}
                                            style={{ width: '100%' }}
                                        />
                                    </FormItem>
                                </Col>
                            </Row>

                        </Form>
                        <Row>
                                <Col>
                                <ExportFile params={() => this._getSearchParams()} beforeExport={() => {
                                    let self = this;
                                    if (!self.field.getValue('warehouseId')) {
                                        return '请选择仓'
                                    }
                                    let createTimeStart = self.field.getValue('createTimeStart');
                                    let createTimeEnd = self.field.getValue('createTimeEnd');
                                    if (!createTimeStart || !createTimeEnd) {
                                        return '请选择生成时间'
                                    }
                                }}>导出大包明细</ExportFile>
                                <ExportFile
                                message="当前最多支持导出300个大包的小包明细数据！"
                                params={() => this._getSearchParams()} commandKey="BIG_PACKAGE_DETAIL" beforeExport={() => {
                                    let self = this;
                                    if (!self.field.getValue('warehouseId')) {
                                        return '请选择仓'
                                    }
                                    let createTimeStart = self.field.getValue('createTimeStart');
                                    let createTimeEnd = self.field.getValue('createTimeEnd');
                                    if (!createTimeStart || !createTimeEnd) {
                                        return '请选择生成时间'
                                    }
                                }}>导出小包明细</ExportFile>
                                <Button mr="10" onClick={this.handleSearch.bind(this)} type="primary">查 询</Button>
                                {this.state.defineSearchComponent}
                                </Col>
                                {/* <Button onClick={this.handleExport.bind(this)} className="action-btn">导 出</Button> */}
                            </Row>
                    </FormCollapse>
                        <DetailDialog ref="detailDialog" />
                    <Table dataSource={tableDataSource}
                           useVirtual fixedHeader
                           rowSelection={rowSelection}
                           className="data-table"
                           loading={this.state.loadingVisible}
                           scroll={{x:true}}
                           primaryKey="bigBagId">

                        {
                            tableColumn.map((item, index) => {
                                if (!!item.lock) {
                                    return <Table.Column title={item.name} key={index}
                                                         dataIndex={item.key}
                                                         lock="right"
                                                         cell={item.cellRender}
                                                         width={item.width} />
                                } else {
                                    return <Table.Column title={item.name} key={index}
                                                         dataIndex={item.key}
                                                         cell={item.cellRender}
                                                         width={item.width} />
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
                            pageSize={paging.pageSize}
                            current={paging.currentPage}
                            total={paging.totalCount}
                            totalRender={total => `总记录条数: ${paging.totalCount}`}
                            onChange={this.onPageChange.bind(this)}
                            onPageSizeChange={this.onPageSizeChange.bind(this)} />
            </div>
        );
    }
}

class DetailDialog extends React.Component {
    constructor(props) {
        super(props);
        this.bigPackageField = new Field(this);
        this.logsField = new Field(this);
        this.buyerUserInfo = new Field(this);
        this.remarkInfoField = new Field(this);
        this.sellerUserInfo = new Field(this);
        this.state = {
            loadingVisible: false,
            visible: false,
            logTableColumn: [],
            logTableDataSource: [],
            remarkTableColumn: [],
            remarkTableDataSource: [],
            packageTableColumn: [],
            packageTableDataSource: []
        }
        this.remarkForm = React.createRef()
    }

    componentDidMount() {
        this._initTableColumn();
    }
    _clear() {
        let self = this;
        self.setState(
            {
                loadingVisible: false,
                visible: false,
                logTableDataSource: [],
                remarkTableDataSource: [],
                packageTableDataSource: []
            }
        );
        self.bigPackageField.reset();
        self.logsField.reset();
        self.remarkInfoField.reset();
        _currentBigPackageId = '';
    }

    onDialogClose() {
        setTimeout(() => {
            this.setState({
                visible: false
            });
        }, 10);
        this._clear();
    }

    _initTableColumn() {
        let self = this;
        let logTableColumn = [
            { "enable": true, "key": "action", "name": "动作", "width": 200 },
            { "enable": true, "key": "content", "name": "备注内容", "width": 450 },
            { "enable": true, "key": "createUser", "name": "操作人", "width": 160 },
            { "enable": true, "key": "createTime", "name": "备注时间", "width": 170 }
        ];
        let remarkTableColumn = [
            { "enable": true, "key": "action", "name": "动作", "width": 200 },
            { "enable": true, "key": "content", "name": "备注内容", "width": 450 },
            { "enable": true, "key": "createUser", "name": "操作人", "width": 160 },
            { "enable": true, "key": "createTime", "name": "备注时间", "width": 170 }
        ];
        let packageTableColumn = [
            { "enable": true, "key": "trackingNumber", "name": "包裹运单号", "width": 200 },
            { "enable": true, "key": "logisticsOrderCode", "name": "平台跟踪号", "width": 150 },
            { "enable": true, "key": "status", "name": "包裹状态", "width": 100 },
            { "enable": true, "key": "recommendStoreCode", "name": "推荐库区", "width": 100 },
            { "enable": true, "key": "storeCode", "name": "上架库位", "width": 150 }
        ];
        logTableColumn = self._renderTableColumns(logTableColumn);
        remarkTableColumn = self._renderTableColumns(remarkTableColumn);
        packageTableColumn = self._renderTableColumns(packageTableColumn);
        self.setState({
            logTableColumn: logTableColumn,
            remarkTableColumn: remarkTableColumn,
            packageTableColumn: packageTableColumn
        });
    }

    _renderTableColumns(tableColumns) {
        let self = this;
        tableColumns.forEach((item) => {
            switch (item.key) {
                default:
                    item.cellRender = self._commonRender.bind(self);
                    break;
            }
        });

        return tableColumns;
    }

    _commonRender(value, index, record) {
        if (value || value === 0) {
            return <span>{value}</span>;
        } else {
            return <span>-</span>;
        }
    }

    _getBigPackageDetail(bigPackageId) {
        if (!_currentWarehouseId) {
            CommonUtil.alert("请选择仓");
            return;
        }
        let self = this;
        self.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: CUSTOMER_API.queryBigPackageDetail,
            type: 'GET',
            data: {
                id: bigPackageId,
                warehouseId: _currentWarehouseId
            }
        }).then((data) => {
            if (data) {
                console.log(data);
                self._buildData(self.bigPackageField, data.packageInfo);
                self.setState({
                    logTableDataSource: data.actionLogs == null ? [] : data.actionLogs,
                    remarkTableDataSource: data.csmRemarkList == null ? [] : data.csmRemarkList,
                    packageTableDataSource: data.itemList == null ? [] : data.itemList
                });
                self.setState({
                    visible: true
                });
            }
            self.setState({ loadingVisible: false });
        }, (error) => {
            this.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("查询大包详情失败, " + error.errMsg);
            } else {
                CommonUtil.alert("查询大包详情失败");
            }
        });
    }

    handleBigBagDetailExport() {
        let self = this;
        let warehouseId = _currentWarehouseId;
        let bigBagId = self.bigPackageField.getValue("bigBagId");
        window.downloadFile(CUSTOMER_API.bigPackageExportBigBagDetailList + "?warehouseId=" + warehouseId+"&bigbagId="+bigBagId);
    }

    handleBigBagOver() {
        let self = this;
        let warehouseId = _currentWarehouseId;
        let id = _currentBigPackageId;
        let bigBagId = self.bigPackageField.getValue("bigBagId");
        CommonUtil.ajax({
            url: CUSTOMER_API.bigPackageOver,
            type: 'GET',
            data: {id: id, warehouseId: warehouseId, bigBagId: bigBagId}
        }).then((data) => {
            if (data) {
                CommonUtil.alert("完结大包成功");
                this.onDialogClose();
            }
        }, (error) => {
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("完结大包失败, " + error.errMsg);
            } else {
                CommonUtil.alert("完结大包失败");
            }
        })
    }

    _buildData(field, data) {
        if (data) {
            for (let d in data) {
                field.setValue(d, data[d]);
            }
        }
    }

    onDialogShow(bigPackageId) {
        let self = this;
        self._getBigPackageDetail(bigPackageId);
        _currentBigPackageId= bigPackageId;
    }

    _saveRemark(bigPackageId) {
        let self = this;
        // let param = self.remarkInfoField.getValues();
        let param = this.remarkForm && this.remarkForm.getData()
        param = Object.assign(param, {
            id: bigPackageId,
            warehouseId: _currentWarehouseId
        });
        param = JSON.parse(JSON.stringify(param));
        self.setState({ loadingVisible: true });
        CommonUtil.ajax({
            url: CUSTOMER_API.saveBigPackageRemark + '?' + queryString.stringify(param),
            type: 'POST'
        }).then((data) => {
            CommonUtil.alert("保存成功");
            self.remarkInfoField.reset();
            self._getBigPackageDetail(bigPackageId);
            self.setState({ loadingVisible: false });
        }, (error) => {
            this.setState({ loadingVisible: false });
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("保存备注失败, " + error.errMsg);
            } else {
                CommonUtil.alert("保存备注失败");
            }
        });
    }

    render() {
        const bigPackageInit = this.bigPackageField.init;
        const logsInit = this.logsField.init;
        const buyerUserInfo = this.buyerUserInfo.init;
        const remarkInfo = this.remarkInfoField.init;
        const sellerUserInfo = this.sellerUserInfo.init;
        const { logTableColumn, logTableDataSource, remarkTableColumn, remarkTableDataSource, packageTableColumn, packageTableDataSource } = this.state;
        return (
            <Dialog title="大包详情" align="cc cc" visible={this.state.visible} isFullScreen="true" onClose={this.onDialogClose.bind(this)} footer={false}>
                <Loading visible={this.state.loadingVisible} size="large" fullScreen="true"></Loading>
                <div className="page-content pam-wrap">
                            <Card title="大包信息" style={{ height: '200px', overflow: 'auto' }}>
                                <Row>
                                    <Form field={this.bigPackageField} size="small" direction="hoz">
                                        <Row className="condition-main">
                                            <Col fixedSpan={16}>
                                                <FormItem label="交接批次号" labelTextAlign="left"
                                                          {...{
                                                              labelCol: { fixedSpan: 6 },
                                                              wrapperCol: { fixedSpan: 8 }
                                                          }}>
                                                    <Input {...bigPackageInit('batchNo')} detail disabled={true} style={{ width: '100%' }} />
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="大包号" labelTextAlign="left"
                                                          {...{
                                                              labelCol: { fixedSpan: 6 },
                                                              wrapperCol: { fixedSpan: 8 }
                                                          }}>
                                                    <Input {...bigPackageInit('bigBagId')} detail disabled={true} style={{ width: '100%' }} />
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="大包状态" labelTextAlign="left"
                                                          {...{
                                                              labelCol: { fixedSpan: 6 },
                                                              wrapperCol: { fixedSpan: 8 }
                                                          }}>
                                                    <Input {...bigPackageInit('statusDesc')} detail disabled={true} style={{ width: '100%' }} />
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="预报重量" labelTextAlign="left"
                                                          {...{
                                                              labelCol: { fixedSpan: 6 },
                                                              wrapperCol: { fixedSpan: 8 }
                                                          }}>
                                                    <Input {...bigPackageInit('grossWeight')} detail disabled={true} style={{ width: '100%' }} />
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="大包实际重量" labelTextAlign="left"
                                                          {...{
                                                              labelCol: { fixedSpan: 6 },
                                                              wrapperCol: { fixedSpan: 8 }
                                                          }}>
                                                    <Input {...bigPackageInit('standardWeight')} detail disabled={true} style={{ width: '100%' }} />
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan="16">
                                                <FormItem label="大包来源" labelTextAlign="left"
                                                          {...{
                                                              labelCol: { fixedSpan: 6 },
                                                              wrapperCol: { fixedSpan: 8 }
                                                          }}>
                                                    <Input {...bigPackageInit('preCpresDesc')} detail disabled={true} style={{ width: '100%' }} />
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="格口号" labelTextAlign="left"
                                                          {...{
                                                              labelCol: { fixedSpan: 6 },
                                                              wrapperCol: { fixedSpan: 8 }
                                                          }}>
                                                    <Input {...bigPackageInit('passNo')} detail disabled={true} style={{ width: '100%' }} />
                                                </FormItem>
                                            </Col>
                                            <Col fixedSpan={16}>
                                                <FormItem label="容器号" labelTextAlign="left"
                                                          {...{
                                                              labelCol: { fixedSpan: 6 },
                                                              wrapperCol: { fixedSpan: 8 }
                                                          }}>
                                                    <Input {...bigPackageInit('rfidNo')} detail disabled={true} style={{ width: '100%' }} />
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Row>
                            </Card>

                            <Card title="大包内小包明细">
                                {/* <Button onClick={this.handleBigBagDetailExport.bind(this)} className="action-btn">导 出</Button> */}
                                <Button onClick={this.handleBigBagOver.bind(this)} mt="10" type="primary">完结大包</Button>
                                <Table dataSource={packageTableDataSource} fixedHeader={false}>
                                    {
                                        packageTableColumn.map((item, index) => {
                                            return <Table.Column title={item.name} key={index} dataIndex={item.key} cell={item.cellRender} width={item.width} />
                                        })
                                    }
                                </Table>
                            </Card>

                            <Card title="大包状态日志">
                                    <Table dataSource={logTableDataSource} fixedHeader={false}>
                                        {
                                            logTableColumn.map((item, index) => {
                                                return <Table.Column title={item.name} key={index} dataIndex={item.key} cell={item.cellRender} width={item.width} />
                                            })
                                        }
                                    </Table>
                            </Card>

                            <Card title="系统日志信息" >
                                    <Table dataSource={remarkTableDataSource} fixedHeader={false} sort={this.state.sorts}>
                                        {
                                            remarkTableColumn.map((item, index) => {
                                                return <Table.Column title={item.name} key={index} dataIndex={item.key} cell={item.cellRender} width={item.width} />
                                            })
                                        }
                                    </Table>
                            </Card>

                            <Card title="备注" contentHeight='400px'>
                                <Card.Content>
                                <AForm ref={ref => (this.remarkForm = ref)} formModel={{
                                    remark: {
                                        label: '',
                                        span: 12,
                                        component: Input.TextArea,
                                        attrs: {
                                            autoHeight: {minRows: 6, maxRows: 20},
                                            maxLength: 400,
                                            showLimitHint: true,
                                        }
                                    }
                                }}></AForm>
                                <Button mt="10" mb="10" onClick={this._saveRemark.bind(this, _currentBigPackageId)} type="primary">保存备注</Button>
                                </Card.Content>
                            </Card>
                </div>
            </Dialog>
        );
    }
}
ListQuery.title ="大包查询"
export default  ListQuery 
