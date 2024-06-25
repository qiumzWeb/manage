import React from "react";
import {
    Table,
    Form,
    Input,
    Select,
    Field,
    Button,
    Grid,
    Dialog,
    Pagination,
    DatePicker,
    Radio,
    Loading,
    FormCollapse
} from '@/component';
import CommonUtil from 'commonPath/common.js';
import moment from 'moment';
import API from 'commonPath/api';
import CUSTOMER_API from 'commonPath/api/customer-api';
import ExportFile from "@/component/ExportFile/index";
import ASelect from "@/component/ASelect/index";
import { getCountry } from '@/report/apiOptions'
import { packageSource } from '@/report/options'
import { filterNotEmptyData } from 'assets/js'
//import 'commonPath/common.scss';
// import "./list.scss";


const {Row, Col} = Grid;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const startValue = moment(new Date(), 'YYYY-MM-DD', true);
const endValue = moment(new Date(), 'YYYY-MM-DD', true);

//仓库名称列表
let warehouseShortNameList = [];

const formItemLayout = {
    labelCol: {fixedSpan: 8},
    wrapperCol: {fixedSpan: 7}
};

let goodsFeatureCodeList = [];

let isContrabandAuditSource = [
    {"label": "请选择", "value": ""},
    {"label": "待审核", "value": "0"},
    {"label": "已审核", "value": "1"}];

let isElectricSource = [
    {"label": "请选择", "value": ""},
    {"label": "带电", "value": "Y"},
    {"label": "不带电", "value": "N"}];
let hasNoPreAlertOptions = [
  {label: '是', value: "Y"},
  {label: '否', value: 'N'}
]

let contrabandTypeSource = [
    {"label": "请选择", "value": ""},
    {"label": "易燃易爆品", "value": "100260010001"},
    {"label": "液体", "value": "100260010002"},
    {"label": "粉末", "value": "100260010003"},
    {"label": "药品", "value": "100260010004"},
    {"label": "食品", "value": "100260010005"},
    {"label": "玩具枪", "value": "100260010006"},
    {"label": "品名不详", "value": "100260010007"},
    {"label": "其他", "value": "100260010008"}];


class ListQuery extends React.Component {

    // 数据字段初始化
    constructor(props) {
        super(props);
        let startTimeValue = moment(startValue.format('YYYY-MM-DD 00:00'), 'YYYY-MM-DD HH:mm', true);
        let endTimeValue = moment(startValue.format('YYYY-MM-DD 23:59'), 'YYYY-MM-DD HH:mm', true);
        this.state = {
            defineSearchComponent: null,
            dataSource: [],
            tableColumn: [],
            innerTableColumn: [],
            loadingVisible: false,
            openRowKeys: [,],
            warehouseShortNames: [],
            goodsFeatureCodeDisabled: false,
            warehouseId: this.getWid(),
            serviceTypeSource: [],
            carrierType: "",
            isContrabandAudit: "",
            isElectric: "",
            contrabandType: "",
            auditTimeEnd: "",
            auditTimeStart: "",
            startTimeValue: startTimeValue,
            endTimeValue: endTimeValue,
            rowSelection: {
                onSelect: this.onRowSelect.bind(this),
                onSelectAll: this.onRowSelectAll.bind(this),
                onChange: this.onRowSelectChange.bind(this),
                selectedRowKeys: [],
            },
            selectedRows: [],
            paging: {
                pageSize: window._pageSize_,
                currentPage: 1,
                totalItems: 0
            },
            collapsed: false //控制菜单的折叠
        };
        this.field = new Field(this);
        this.batchUpdateField = new Field(this, {
            onChange: (name, value) => {
                console.log("this.batchUpdateField.getValues before：", this.batchUpdateField.getValues());
                this.batchUpdateField.setValue(name, value);
                console.log("this.batchUpdateField.getValues after：", this.batchUpdateField.getValues());
            }
        });

    }

    // 渲染前触发一次
    componentWillMount() {
        let self = this;
        self._goodsFeatureCodeData();
        this.field.setValue("warehouseId", this.getWid());
        this.field.setValue("gmtCreateEnd", endValue.format('YYYY-MM-DD 23:59'));
        this.field.setValue("gmtCreateStart", startValue.format('YYYY-MM-DD 00:00'));
        let tableColumn = [
            {"enable": true, "key": "mailNo", "name": "一段运单号"},
            {"enable": true, "key": "referLogisticsOrderCode", "name": "一段LP号"},
            {"enable": true, "key": "referOrderId", "name": "一段交易订单号"},
            {"enable": true, "key": "carrierType", "name": "业务类型"},
            {"enable": true, "key": "hasNoPreAlert", "name": "是操作无预报识别", width: 100, cellRender: (value) => {
              return <ASelect value={value} getOptions={async() => hasNoPreAlertOptions} isDetail defaultValue="-"></ASelect>
            }},
            {"enable": true, "key": "gmtCreate", "name": "预报生成时间"},
            {"enable": true, "key": "goodsFeature", "name": "禁限运属性"}
        ];

        let innerTableColumn = [
            {"enable": true, "key": "status", "name": "商品审核状态", align: 'center', flex: 0.5},
            {"enable": true, "key": "orderItemName", "name": "商品描述", flex: 1.5},
            {"enable": true, "key": "contrabandType", "name": "违禁品类型"},
            {"enable": true, "key": "isElectric", "name": "是否带电"},
            {"enable": true, "key": "goodsType", "name": "商品特普属性"},
            {"enable": true, "key": "auditTime", "name": "审核时间"},
            {"enable": true, "key": "operationUser", "name": "审核人"},
            {"enable": true, "key": "operation", "name": "操作"},
        ];


        tableColumn = self._initTableColumn(tableColumn);
        innerTableColumn = self._initInnerTableColumn(innerTableColumn);
        self.setState({tableColumn: tableColumn, innerTableColumn: innerTableColumn});
        self._searchSelectData();
        self._getServiceType();
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
                });
                warehouseNameList.unshift({
                    "label": "全部",
                    "value": ""
                });
                warehouseShortNameList = warehouseNameList;
                this.setState({
                    warehouseShortNames: warehouseShortNameList
                })
            }
        });
    }

    // 初始化列表
    _initTableColumn(tableColumn) {
        let self = this;
        tableColumn.forEach((item) => {
          if (item.cellRender) return;
            switch (item.key) {
                case 'isContrabandAudit':
                    item.width = 100;
                    item.cellRender = self._booleanTypeRender.bind(self);
                    break;
                case "goodsFeature":
                    item.width = 200;
                    item.cellRender = self._goodsFeatureRender.bind(self);
                    break;
                default:
                    item.width = 100;
                    item.cellRender = self._commonRender.bind(self);
                    break;
            }
        });
        return tableColumn;
    }

    _initInnerTableColumn(innerTableColumn) {
        let self = this;
        innerTableColumn.forEach((item) => {
            switch (item.key) {
                case 'operation':
                    item.flex = 1;
                    item.cellRender = self._operationRender.bind(self);
                    break;
                case "isElectric":
                    item.cellRender = self._isElectricRender.bind(self);
                    break;
                case "goodsType":
                    item.flex = 3;
                    item.cellRender = self._goodsTypeRender.bind(self);
                    break;
                case "contrabandType":
                    item.cellRender = self._contrabandTypeRender.bind(self);
                    break;
                case "status":
                    item.flex = 1
                    item.cellRender = self._statusRender.bind(self);
                    break;
                case "orderItemName":
                    item.flex = 3;
                    item.cellRender = self._commonRenderURL.bind(self);
                    break;
                case "operationUser":
                    item.flex = 1;
                    item.cellRender = self._commonRender.bind(self);
                    break;
                default:
                    item.flex = 1;
                    item.cellRender = self._commonRender.bind(self);
                    break;
            }
        });
        return innerTableColumn;
    }

    onIsElectricChange(name, val) {
        this.batchUpdateField.setValue(name, val);
    }

    onGoodsTypeChange(name, val) {
        this.batchUpdateField.setValue(name, val);
    }

    onContrabandTypeChange(name, val) {
        this.batchUpdateField.setValue(name, val);
    }

    _operationRender(value, index, record, context) {
        if (record.status === 1) {
            return <div><a  onClick={this.handleCancelAudit.bind(this, record)}>撤销审核</a></div>
        } else {
            return <div><a 
                           onClick={this.handleSubmitAudit.bind(this, record)}>提交审核</a></div>;
        }
    }

    handleBatchSubmitAudit() {
        if (this.state.rowSelection.selectedRowKeys == null || this.state.rowSelection.selectedRowKeys.length <= 0) {
            CommonUtil.alert("请先勾选审核行");
            return;
        }
        let batchData = [];
        // this.state.rowSelection.selectedRowKeys.forEach((item) => {
            this.state.selectedRows.forEach((dataSourceItem) => {
                // if (item == dataSourceItem.id) {
                    dataSourceItem.children.forEach((orderItem) => {
                        let contrabandTypeKey = this._formatBatchFieldKey("contrabandType", orderItem.orderItemId);
                        let isElectricKey = this._formatBatchFieldKey("isElectric", orderItem.orderItemId);
                        let goodsTypeKey = this._formatBatchFieldKey("goodsType", orderItem.orderItemId);
                        let contrabandTypeValue = this.batchUpdateField.getValue(contrabandTypeKey);
                        let isElectricValue = this.batchUpdateField.getValue(isElectricKey);
                        let goodsTypeValue = this.batchUpdateField.getValue(goodsTypeKey);
                        let data = {
                            mailNo: orderItem.mailNo,
                            packageId: orderItem.packageId,
                            orderItemId: orderItem.orderItemId,
                            contrabandType: contrabandTypeValue,
                            isElectric: isElectricValue ? isElectricValue : "N",
                            goodsType: goodsTypeValue ? goodsTypeValue : "NORMAL_GOODS",
                            status: 1
                        };
                        batchData.push(data);
                    });
                // }
            })
        // });
        CommonUtil.ajax({
            url: API.batchSubmitAudit,
            type: 'POST',
            data: batchData
        }).then((data) => {
            CommonUtil.alert("批量审核成功");
            this.batchUpdateField.reset();
            this._doSearch();
        }, (error) => {
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("批量审核失败, " + error.errMsg);
            } else {
                CommonUtil.alert("批量审核失败");
            }
        });
    }

    handleSubmitAudit(record) {
        let contrabandTypeKey = this._formatBatchFieldKey("contrabandType", record.orderItemId);
        let isElectricKey = this._formatBatchFieldKey("isElectric", record.orderItemId);
        let goodsTypeKey = this._formatBatchFieldKey("goodsType", record.orderItemId);
        let contrabandTypeValue = this.batchUpdateField.getValue(contrabandTypeKey);
        let isElectricValue = this.batchUpdateField.getValue(isElectricKey);
        let goodsTypeValue = this.batchUpdateField.getValue(goodsTypeKey);
        CommonUtil.ajax({
            url: API.submitAudit,
            type: 'POST',
            data: {
                "mailNo": record.mailNo,
                "packageId": record.packageId,
                "orderItemId": record.orderItemId,
                "contrabandType": contrabandTypeValue,
                "isElectric": isElectricValue ? isElectricValue : "N",
                "goodsType": goodsTypeValue ? goodsTypeValue : "NORMAL_GOODS",
                "status": 1
            }
        }).then((data) => {
            CommonUtil.alert("审核成功");
            this.batchUpdateField.setValue(contrabandTypeKey, "");
            this.batchUpdateField.setValue(isElectricKey, "");
            this._doSearch();
        }, (error) => {
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("审核失败, " + error.errMsg);
            } else {
                CommonUtil.alert("审核失败");
            }
        });
    }

    handleCancelAudit(record) {
        Dialog.confirm({
            title: "撤销审核",
            content: "是否重置该条商品记录的审核结果?",
            onOk: () => {
                CommonUtil.ajax({
                    url: API.cancelAudit,
                    type: 'POST',
                    data: {"id": record.id, "packageId": record.packageId}
                }).then((data) => {
                    CommonUtil.alert("撤销审核成功");
                    this._doSearch();
                }, (error) => {
                    if (error && typeof error.errMsg !== 'undefined') {
                        CommonUtil.alert("撤销审核失败, " + error.errMsg);
                    } else {
                        CommonUtil.alert("撤销审核失败");
                    }
                });
            }
        });
    }

    _goodsFeatureCodeData() {
        CommonUtil.ajax({
            url: API.getDataDictionaryByType,
            type: 'GET',
            data: {dataType: 'goodsFeature'}
        }).then((data) => {
            if (data) {
                if (data) {
                    goodsFeatureCodeList = data;
                }
            }
        })
    }

    onGoodsFeatureCodeChange(name, val) {
        this.batchUpdateField.setValue(name, val);
    }

    handleModify = (id) => {
        let goodsFeatureKey = this._formatBatchFieldKey("goodsFeature", id);
        let goodsFeatureValue = this.batchUpdateField.getValue(goodsFeatureKey);
        CommonUtil.ajax({
            url: API.updateGoodsFeature,
            type: 'POST',
            data: {
                "packageId": id,
                "goodsFeature": goodsFeatureValue.toString()
            }
        }).then((data) => {
            CommonUtil.alert("修改成功");
            // this.batchUpdateField.setValue(goodsFeatureKey, "");
            this._doSearch();
        }, (error) => {
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("修改失败, " + error.errMsg);
            } else {
                CommonUtil.alert("修改失败");
            }
        });
    };

    handleGoodsFeatureStatus = (record) => {
        CommonUtil.ajax({
            url: API.updateGoodsFeatureStatus,
            type: 'POST',
            data: {
                "mailNo": record.mailNo,
                "warehouseId": this.state.warehouseId,
                "goodsFeature": record.goodsFeature.toString(),
                mailNoOriginal: record.mailNoOriginal || undefined
            }
        }).then((data) => {
            CommonUtil.alert("质检审核成功");
            this._doSearch();
        }, (error) => {
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("质检审核失败, " + error.errMsg);
            } else {
                CommonUtil.alert("质检审核失败");
            }
        });
    };

    _goodsFeatureRender(value, index, record, context) {
        let name = this._formatBatchFieldKey("goodsFeature", record.id);
        let cValue  = this.batchUpdateField.getValue(name)
        if (!cValue) cValue = record.goodsFeature
        return <div className="operation-div">
            <Select name={name} id={name}
                    showSearch hasClear mode="multiple"
                    disabled={this.state.goodsFeatureCodeDisabled}
                    onChange={this.onGoodsFeatureCodeChange.bind(this, name)}
                    value={cValue}
                    dataSource={goodsFeatureCodeList}
                    style={{width: '60%',marginRight: 10}}/>
            <a  onClick={this.handleModify.bind(this, record.id)}>修改</a>&nbsp;&nbsp;&nbsp;
            <a  onClick={this.handleGoodsFeatureStatus.bind(this, record)}>质检审核</a></div>
    }

    _contrabandTypeRender(value, index, record, context) {
        let name = this._formatBatchFieldKey("contrabandType", record.orderItemId);
        let contrabandKeyword = JSON.parse(JSON.stringify(record.contrabandKeywordList));
        let cValue = this.batchUpdateField.getValue(name)
        if (!cValue) cValue = record.contrabandType
        contrabandKeyword.unshift({
            "label": "请选择",
            "value": ""
        });
        return <Select name={name} id={name} dataSource={contrabandKeyword} value={cValue}
                       onChange={this.onContrabandTypeChange.bind(this, name)} style={{width: '100%'}}/>
    }

    _statusRender(value, index, record, context) {
        if (value === 1) {
            return <span>已审核</span>;
        } else {
            return <span>待审核</span>;
        }
    }

    _isElectricRender(value, index, record, context) {
        let name = this._formatBatchFieldKey("isElectric", record.orderItemId);
        let isElectricValue = record.isElectric ? record.isElectric : "N";
        let cValue = this.batchUpdateField.getValue(name)
        let thValue = this.batchUpdateField.getValue(this._formatBatchFieldKey("goodsType", record.orderItemId))
        if (!cValue) cValue = isElectricValue
        return <RadioGroup name={name} onChange={this.onIsElectricChange.bind(this, name)}
                           value={cValue}>
            <Radio value="N">不带电</Radio>
            <Radio value="Y" disabled={thValue === 'SPECIAL_GOODS'}>带电</Radio>
        </RadioGroup>;
    }

    _goodsTypeRender(value, index, record, context) {
        let name = this._formatBatchFieldKey("goodsType", record.orderItemId);
        let goodsTypeValue = record.goodsType ? record.goodsType : "NORMAL_GOODS";
        let ddValue = this.batchUpdateField.getValue(this._formatBatchFieldKey("isElectric", record.orderItemId))
        let cValue = this.batchUpdateField.getValue(name)
        if (!cValue) cValue = goodsTypeValue
        return <RadioGroup name={name} onChange={this.onGoodsTypeChange.bind(this, name)}
                        value={cValue}>
            <Radio value="SPECIAL_GOODS" disabled={ddValue === 'Y'}>特货</Radio>
            <Radio value="NORMAL_GOODS">普货</Radio>  
            <Radio value="FOOD_GOODS">食品</Radio>  
            <Radio value="SENSITIVE_GOODS">敏货</Radio>  
        </RadioGroup>;
    }

    _formatBatchFieldKey(prefix, positionId) {
        return prefix + positionId;
    }

    _booleanTypeRender(value, index, record, context) {
        if (value === 1) {
            return <span>已审核</span>;
        } else {
            return <span>待审核</span>;
        }
    }

    _commonRenderURL(value, index, record) {
        if (value || value === 0) {
            let url = record.referItemId ? 'https://item.taobao.com/item.htm?id=' + record.referItemId : 'javascript:;';

            return <a href={url} target="_blank"><span className="main-color">{value}</span></a>
        } else {
            return <span>-</span>;
        }
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

    _resetQuery() {
        let gmtCreateEnd = this.field.getValue("gmtCreateEnd");
        let gmtCreateStart = this.field.getValue("gmtCreateStart");
        this.field.remove("auditTimeEnd");
        this.field.remove("auditTimeStart");
        this.field.reset();
        this.field.setValue("gmtCreateEnd", gmtCreateEnd);
        this.field.setValue("gmtCreateStart", gmtCreateStart);
        this.setState({
            warehouseId: "",
            isContrabandAudit: "",
            isElectric: "",
            contrabandType: "",
            startTimeValue: gmtCreateStart,
            endTimeValue: gmtCreateEnd
        });
    }

    _doSearch() {
        let self = this;
        self.field.validate((errors, values) => {
            if (errors != null) {
                return;
            }
            let data = self._getSearchParams();
            if (data && data.mailNo && data.mailNo.split(",").length > 50) {
                CommonUtil.alert("搜索上限为50个包裹");
                return;
            }
            this.setState({loadingVisible: true});
            CommonUtil.ajax({
                url: API.getPackageAuditList,
                type: 'POST',
                data: filterNotEmptyData(data)
            }).then((data) => {
                let rowKes = [];
                if (data.result != null) {
                    data.result.forEach((item) => {
                        rowKes.push(item.id);
                        const goodsFeature = item.goodsFeature ? item.goodsFeature.split(',') : [];
                        item.goodsFeature = goodsFeature;
                    })
                }
                let paging = self.state.paging;
                paging.totalItems = data.total;
                self.setState({
                    openRowKeys: rowKes,
                    loadingVisible: false,
                    dataSource: data.result == null ? [] : data.result,
                    paging: paging
                })
            }).catch(() => {
                this.setState({loadingVisible: false})
            })
        });
    }

    // 触发查询
    handleSearch() {
        let paging = this.state.paging;
        paging.currentPage = 1;
        // paging.pageSize = window._pageSize_;
        this.setState(paging, () => {
            this._doSearch();
        });
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

    disabledExpandedCol() {
        this.setState({
            getExpandedColProps: (record, index) => {
                if (index === 3) {
                    return {
                        disabled: true
                    };
                }
            }
        });
    }

    toggleCol() {
        this.setState({
            hasExpandedRowCtrl: false
        });
    }

    onRowOpen(openRowKeys) {
        this.setState({openRowKeys});
    }

    toggleExpand(record) {
        const key = record.id,
            {openRowKeys} = this.state,
            index = openRowKeys.indexOf(key);
        if (index > -1) {
            openRowKeys.splice(index, 1);
        } else {
            openRowKeys.push(key);
        }
        this.setState({
            openRowKeys: openRowKeys
        });
    }

    handleWareHouseChange(value) {
        let self = this;
        this.field.setValue("warehouseId", value);
        self.setState({
            warehouseId: value
        });
    }

    handleCarrierTypeChange(value) {
        let self = this;
        this.field.setValue("carrierType", value);
        self.setState({
            carrierType: value
        });
    }

    handleIsContrabandAuditChange(value) {
        let self = this;
        this.field.setValue("isContrabandAudit", value);
        self.setState({
            isContrabandAudit: value
        });
    }

    handleIsElectricChange(value) {
        console.log(value)
        let self = this;
        this.field.setValue("isElectric", value);
        self.setState({
            isElectric: value
        });
    }

    handleContrabandTypeChange(value) {
        let self = this;
        this.field.setValue("contrabandType", value);
        self.setState({
            contrabandType: value
        });
    }

    onRowSelect(selected, record, records) {
        let positionIds = [];
        //选中
        if (selected) {
            records.forEach((item) => {
                positionIds.push(item.id);
            });
        }
    }

    onRowSelectAll(selected, records) {
        let positionIds = [];
        //全选中
        if (selected) {
            records.forEach((item) => {
                positionIds.push(item.id);
            });
        }
    }

    //table行的select与unselect变化
    onRowSelectChange(ids, records) {
        const {rowSelection} = this.state;
        rowSelection.selectedRowKeys = ids;
        this.setState({
            rowSelection,
            selectedRows: records || []
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

    onTimeChange(name, val) {
        let timeValue = val && val.format('YYYY-MM-DD HH:mm');
        this.field.setValue(name, timeValue);
    }

    timeChange(name, val) {
        if (!val) {
            this.field.remove(name);
        } else {
            this.field.setValue(name, val, 'YYYY-MM-DD HH:mm');
        }
    }


    // 业务类型
    _getServiceType() {
        let self = this;
        // self.setState({loadingVisible: true});
        CommonUtil.ajax({
            url: CUSTOMER_API.getServiceTypeNames,
            type: 'GET',
        }).then((data) => {
            if (data) {
                let svsTypes = [];
                data.forEach((item) => {
                    svsTypes.push({
                        "label": item.label,
                        "value": item.code
                    });
                });
                self.setState({
                    serviceTypeSource: svsTypes
                })
            }
            // self.setState({loadingVisible: false});
        }, (error) => {
            // this.setState({loadingVisible: false});
            if (error && typeof error.errMsg !== 'undefined') {
                CommonUtil.alert("获取业务类型失败, " + error.errMsg);
            } else {
                CommonUtil.alert("获取业务类型失败。");
            }
        });
    }

    // 页面渲染
    render() {
        const init = this.field.init;
        const {tableColumn, dataSource, paging} = this.state;
        const {pageSize, totalItems, currentPage} = paging;
        return (<div className="page-content pam-wrap package-audit">
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
                            <Col fixedSpan="12" key="warehouseId" show required>
                                <FormItem label="仓库简称"
                                          labelTextAlign="right"
                                          {...{labelCol: {fixedSpan: 8}, wrapperCol: {fixedSpan: 9}}}>
                                    <Select  {...init('warehouseId', {
                                        rules: {
                                            required: true,
                                            trigger: 'onChange',
                                            message: '请选择仓库'
                                        }
                                    })} showSearch hasClear
                                             dataSource={this.state.warehouseShortNames}
                                             onChange={this.handleWareHouseChange.bind(this)}
                                             value={this.state.warehouseId} style={{width: '100%'}}/>
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="carrierType" show>
                                <FormItem label="业务类型"
                                          labelTextAlign="right"
                                          {...{labelCol: {fixedSpan: 8}, wrapperCol: {fixedSpan: 9}}}>
                                    <Select  {...init('carrierType')} showSearch hasClear
                                             dataSource={this.state.serviceTypeSource}
                                             value={this.state.carrierType}
                                             onChange={this.handleCarrierTypeChange.bind(this)}
                                             style={{width: '100%'}}/>
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="isContrabandAudit" show>
                                <FormItem label="包裹审核状态"
                                          labelTextAlign="right"
                                          {...formItemLayout}>
                                    <Select  {...init('isContrabandAudit')} showSearch hasClear
                                             dataSource={isContrabandAuditSource}
                                             value={this.state.isContrabandAudit}
                                             onChange={this.handleIsContrabandAuditChange.bind(this)}
                                             style={{width: '100%'}}/>
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="mailNo" show>
                                <FormItem label="一段运单号"
                                          labelTextAlign="right"
                                          {...formItemLayout}>
                                    <Input  {...init('mailNo')} trim hasClear placeholder="" style={{width: '100%'}}/>
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="referLogisticsOrderCode" show>
                                <FormItem label="一段LP号"
                                          labelTextAlign="right"
                                          {...formItemLayout}>
                                    <Input  {...init('referLogisticsOrderCode')} trim hasClear placeholder=""
                                            style={{width: '100%'}}/>
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="referOrderId" show>
                                <FormItem label="一段交易订单号"
                                          labelTextAlign="right"
                                          {...formItemLayout}>
                                    <Input  {...init('referOrderId')} trim hasClear placeholder=""
                                            style={{width: '100%'}}/>
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="gmtCreateStart" show>
                                <FormItem label="包裹预报生成时间起" labelTextAlign="right"
                                          {...{labelCol: {fixedSpan: 8}, wrapperCol: {fixedSpan: 8}}}>
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        showTime={{format: 'HH:mm'}}
                                        disabledDate={this.markDisableTime.bind(this, true, "gmtCreateStart")}
                                        defaultValue={this.state.startTimeValue}
                                        onChange={this.onTimeChange.bind(this, "gmtCreateStart")}
                                        style={{width: '100%'}}
                                    />
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="gmtCreateEnd" show>
                                <FormItem label="包裹预报生成时间止" labelTextAlign="right"
                                          {...{labelCol: {fixedSpan: 8}, wrapperCol: {fixedSpan: 8}}}>
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        showTime={{format: 'HH:mm'}}
                                        disabledDate={this.markDisableTime.bind(this, false, "gmtCreateEnd")}
                                        defaultValue={this.state.endTimeValue}
                                        onChange={this.onTimeChange.bind(this, "gmtCreateEnd")}
                                        style={{width: '100%'}}
                                    />
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="isElectric" show>
                                <FormItem label="是否带电"
                                          labelTextAlign="right"
                                          {...formItemLayout}>
                                    <Select  {...init('isElectric')} showSearch hasClear
                                             dataSource={isElectricSource}
                                             value={this.state.isElectric}
                                             onChange={this.handleIsElectricChange.bind(this)}
                                             style={{width: '100%'}}/>
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="contrabandType" show>
                                <FormItem label="违禁品类型"
                                          labelTextAlign="right"
                                          {...formItemLayout}>
                                    <Select  {...init('contrabandType')} showSearch hasClear
                                             dataSource={contrabandTypeSource}
                                             value={this.state.contrabandType}
                                             onChange={this.handleContrabandTypeChange.bind(this)}
                                             style={{width: '100%'}}/>
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="orderItemName" show>
                                <FormItem label="商品名称"
                                          labelTextAlign="right"
                                          {...formItemLayout}>
                                    <Input  {...init('orderItemName')} trim hasClear placeholder=""
                                            style={{width: '100%'}}/>
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="auditTimeStart" show>
                                <FormItem label="包裹审核完成时间起" labelTextAlign="right"
                                          {...{labelCol: {fixedSpan: 8}, wrapperCol: {fixedSpan: 8}}}>
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        showTime={{format: 'HH:mm', minuteStep: 15}}
                                        disabledDate={this.markDisableTime.bind(this, true, "auditTimeEnd")}
                                        onChange={this.timeChange.bind(this, "auditTimeStart")}
                                        style={{width: '100%'}}
                                    />
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="auditTimeEnd" show>
                                <FormItem label="包裹审核完成时间止" labelTextAlign="right"
                                          {...{labelCol: {fixedSpan: 8}, wrapperCol: {fixedSpan: 8}}}>
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        showTime={{format: 'HH:mm', minuteStep: 15}}
                                        disabledDate={this.markDisableTime.bind(this, false, "auditTimeStart")}
                                        onChange={this.timeChange.bind(this, "auditTimeEnd")}
                                        style={{width: '100%'}}
                                    />
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="countryCode" show>
                                <FormItem label="国家">
                                    <ASelect
                                        name="countryCode"
                                        getOptions={async() => await getCountry}
                                    />
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="packageSource" show>
                                <FormItem label="包裹来源">
                                    <ASelect
                                      name="packageSource"
                                      getOptions={async() => packageSource}
                                    />
                                </FormItem>
                            </Col>
                            <Col fixedSpan="12" key="hasNoPreAlert" show>
                                <FormItem label="是操作无预报识别">
                                    <ASelect
                                      name="hasNoPreAlert"
                                      getOptions={async() => hasNoPreAlertOptions}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        <Col>
                            <ExportFile params={() => this._getSearchParams()} beforeExport={() => {
                                let data = this._getSearchParams();
                                if (data && data.mailNo && data.mailNo.split(",").length > 50) {
                                    return "搜索上限为50个包裹"
                                }
                            }}></ExportFile>
                            {/* <Button mr="10" onClick={this._resetQuery.bind(this)} type="primary">重置</Button> */}
                            <Button mr="10" onClick={this.handleBatchSubmitAudit.bind(this)}>批量审核</Button>
                            <Button mr="10" onClick={this.handleSearch.bind(this)} type="primary">查 询</Button>
                            {this.state.defineSearchComponent}
                        </Col>
                    </Row>
                    </FormCollapse>
                    {/* <Loading visible={this.state.loadingVisible} size="large" fullScreen="true"></Loading> */}
                    <Table dataSource={dataSource} fixedHeader loading={this.state.loadingVisible}
                        // expandedRowRender={expandedRowRender}
                           expandedRowRender={(record) => {
                               return (
                                   <div style={{marginTop: 10, width: '100%'}}>
                                       {Array.isArray(record.children) && record.children.map((r, index) => {
                                           return <div style={{width: '100%', display: 'flex', minHeight: 30}} key={index}>{this.state.innerTableColumn.map((c, i) => {
                                                return <div key={i} style={{flex: c.flex || 2, padding: 10, textAlign: c.align || 'left'}}>{c.cellRender(r[c.key], index, r)}</div>
                                           })}</div>
                                       })}
                                       {/* <Table dataSource={record.children}>
                                           {
                                               this.state.innerTableColumn.map((innerItem, index) => {
                                                   if (innerItem.key == 'operation') {
                                                       return <Table.Column title={innerItem.name} key={index}
                                                                            dataIndex={innerItem.key}
                                                                            cell={innerItem.cellRender}
                                                                            width={innerItem.width} lock="right"/>
                                                   } else {
                                                       return <Table.Column title={innerItem.name} key={index}
                                                                            dataIndex={innerItem.key}
                                                                            cell={innerItem.cellRender}
                                                                            width={innerItem.width}/>
                                                   }
                                               })
                                           }
                                       </Table> */}
                                   </div>
                               )
                           }}
                           isLazy={pageSize == 20 ? 0 : 10}
                           expandedRowIndent={[1, 1]}
                           openRowKeys={this.state.openRowKeys}
                           getExpandedColProps={this.state.getExpandedColProps}
                           hasExpandedRowCtrl={this.state.hasExpandedRowCtrl}
                           onRowOpen={this.onRowOpen.bind(this)}
                           rowSelection={this.state.rowSelection}
                           className="data-table">
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
                        pageSizeList={[5, 20, 50, 100]}
                        total={totalItems}
                        totalRender={total => `总记录条数: ${totalItems}`}
                        onChange={this.onPageChange.bind(this)}
                        onPageSizeChange={this.onPageSizeChange.bind(this)}/>
        </div>)
    }
}

export default  ListQuery