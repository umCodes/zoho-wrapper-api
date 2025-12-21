import { Router } from 'express'
import { createPackage, getPackages, shipOrder } from '../controllers/packages.controllers';

const packagesRouter = Router();

packagesRouter.get('/api/packages', getPackages)
packagesRouter.post('/api/packages', createPackage)
packagesRouter.post('/api/packages/ship', shipOrder)

export default packagesRouter;