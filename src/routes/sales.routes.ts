import { Router } from 'express'
import { createSalesOrder, getSalesOrderById, getSalesOrders } from '../controllers/sales.controllers';

const salesRouter = Router();

salesRouter.post('/api/salesorders', createSalesOrder)
salesRouter.get('/api/salesorders', getSalesOrders)
salesRouter.get('/api/salesorders/:id', getSalesOrderById)

export default salesRouter;