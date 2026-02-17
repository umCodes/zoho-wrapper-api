import { Router } from 'express'
import { createPackage, getPackages, getPackgeById, shipOrder } from '../controllers/packages.controllers';

const packagesRouter = Router();

packagesRouter.get('/api/packages', getPackages)
packagesRouter.get('/api/packages/:id', getPackgeById)
packagesRouter.post('/api/packages', createPackage)
packagesRouter.post('/api/packages/ship', shipOrder)

export default packagesRouter;