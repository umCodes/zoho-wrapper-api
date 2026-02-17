import { Router } from 'express'
import { createCompositeItem, createItem, getCompositeItemById, getCompositeItems, getItems } from '../controllers/items.controllers';

const itemsRouter = Router();

itemsRouter.get('/api/items', getItems)
itemsRouter.get('/api/compositeitems', getCompositeItems)
itemsRouter.get('/api/compositeitems/:composite_item_id', getCompositeItemById)
itemsRouter.post('/api/item', createItem)
itemsRouter.post('/api/compositeItem', createCompositeItem)


export default itemsRouter;