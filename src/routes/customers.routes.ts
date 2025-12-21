import { Router } from 'express'
import { getCustomers } from '../controllers/customers.controllers';

const customersRouter = Router();

customersRouter.get('/api/customers', getCustomers)

export default customersRouter;