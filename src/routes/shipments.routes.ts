import { Router } from 'express'
import { getShipmentById } from '../controllers/shipments.controllers';
import { getShipments } from '../controllers/sales.controllers';

const shipmentsRouter = Router();

shipmentsRouter.get('/api/shipments/:id', getShipmentById)
shipmentsRouter.get('/api/shipments', getShipments)

export default shipmentsRouter;