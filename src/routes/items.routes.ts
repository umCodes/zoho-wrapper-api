import { Router } from 'express'
import { createCompositeItem, createItem, getItems } from '../controllers/items.controllers';

const itemsRouter = Router();

itemsRouter.get('/api/items', getItems)
itemsRouter.post('/api/item', createItem)
itemsRouter.post('/api/compositeItem', createCompositeItem)


export default itemsRouter;