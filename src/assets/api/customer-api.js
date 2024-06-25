const CUSTOMER_API = {
    'getWarehouseNames':'/sys/warehouses/names',
    //包裹查询
    'getCountryNames':'/meta/coverage-areas',
    'getPackageStatusNames':'/meta/packageStatus',
    'getPackageTypeNames':'/meta/packageType',
    'getPlatformTypeNames':'/meta/platformType',
    'getServiceTypeNames':'/meta/serviceType',
    'queryPackageList':'/package/search/list',
    'queryPackageDetail':'/package/search/detail/{prealertPackageId}',
    'savePackageRemark':'/package/search/saveRemark/{prealertPackageId}',
    'queryPackageCount':'/package/search/count',
    'packageDetailExportAll':'/package/search/export',
    'packageDetailExportSelected':'/package/search/export/selected',
    'getSpecialParcelSign':'/meta/specialParcelSign',
    'getPackageExceptionType':'/meta/packageExceptionType',
    //订单查询
    'getOrderStatusNames':'/meta/orderStatus',
    'getOrderExceptionNames':'/meta/orderExceptionType',
    'getChannelNames':'/meta/channelType',
    'queryOrderList':'/order/search/list',
    'queryOrderDetail':'/order/search/detail/{prealertOrderId}',
    'queryOrderCount':'/order/search/count',
    'saveOrderRemark':'/order/search/saveRemark/{prealertOrderId}',
    'orderDetailExportAll':'/order/search/export',
    'orderDetailExportSelected':'/order/search/export/selected',
    'orderPackageExportAll':'/order/search/export/orderPackage',
    'orderPackageExportSelected':'/order/search/export/orderPackage/selected',
    // 大包查询
    'queryBigPackageList':'/statistic/prealert/bigpackage/list',
    'queryBigPackageDetail':'/statistic/prealert/bigpackage/detail',
    'saveBigPackageRemark':'/statistic/prealert/bigpackage/saveRemark',
    'getBigPackageNames':'/statistic/prealert/bigpackage/bigPackageStatus',
    'bigPackageExport':'statistic/prealert/bigpackage/export',
    'bigPackageOver':'statistic/prealert/bigpackage/over',
    'bigPackageExportBigBagDetailList':'statistic/prealert/bigpackage/exportBigBagDetailList'
};
Object.entries(CUSTOMER_API).forEach(([key, val]) => {
    const api = /^\//.test(val) ? val : ('/' + val)
    CUSTOMER_API[key] = '/pcsservice' + api
})
export default CUSTOMER_API;