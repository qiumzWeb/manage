import warehouseConfigRoutes from '@/routes/warehouseConfiguration'
import { isWarehouseConfigRoute } from '@/pages/warehouseConfiguration/warehouseConfigProgress/config'
export const hideTagWhiteList = [
  ...warehouseConfigRoutes.filter(r => r.path && isWarehouseConfigRoute(r.path)).map(r => r.path.toLowerCase())
]