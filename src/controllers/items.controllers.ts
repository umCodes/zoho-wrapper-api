import { NextFunction, Request, Response } from "express";
import { obtainDataWithRedis } from "../database/redis/queries";
import { ZohoCreateCompositeItem, ZohoCreateItem, ZohoGetItems } from "../services/items.services";
import { CompositeItem, CompositeItemKeys, Item, ItemKeys, MappedItemKeys } from "../models/items.models";
import { pick } from "../utils/helpers";
import { HttpError } from "../errors/error";


//POST | CREATE

export async function createItem(req: Request, res: Response, next: NextFunction) {    
    const itemData: Item = req.body || {};

    // Required fields:
    const requiredFields: ItemKeys = ['name', 'description', 'unit', 'rate', 'purchase_rate', 'product_type', 'inventory_account_id', "location"];
    const locationFields = ['location_id', 'initial_stock'];
    
    try {   
        // Check if Required fields are provided:
        if(!requiredFields.every(field => field in itemData)) throw new HttpError('Missing required fields in item data.', 400)
        if(!locationFields.every(field => field in itemData.location)) throw new HttpError('Missing required fields in location data.', 400)

        // Check whether provided fields are valid:
        if(!itemData.name || !itemData.description || !itemData.unit || !itemData.rate || !itemData.purchase_rate || itemData.product_type !== "goods" || !itemData.inventory_account_id) throw new HttpError('Fields should not be left empty.', 400)
        
        return await ZohoCreateItem(JSON.stringify(itemData), req.headers['Authorization'] as string)
    } catch (error) {
        console.log(error);
        next(error)
    
    }
}





export async function createCompositeItem(req: Request, res: Response, next: NextFunction) {
    const itemData: CompositeItem = req.body || {};
    
    // Required fields:
    const requiredFields: CompositeItemKeys = ['name', 'description', 'mapped_items', 'item_type', 'unit', 'sku', 'rate', 'product_type', 'inventory_account_id'];
    const mappedItemsFields: MappedItemKeys = ['item_id', 'quantity']
    
    
    try {
        // Check if Required fields are provided:
        if(!requiredFields.every(field => field in itemData)) throw new HttpError('Missing required fields in item data.', 400)
        if(!mappedItemsFields.every(field => field in itemData.mapped_items)) throw new HttpError('Missing required fields in location data.', 400)

        // Check whether provided fields are valid:
        if(!itemData.name || !itemData.description || !itemData.unit || !itemData.sku || !itemData.rate || itemData.product_type !== "goods" || !itemData.inventory_account_id) throw new HttpError('Fields should not be left empty.', 400)

        return await ZohoCreateCompositeItem(JSON.stringify(itemData), req.headers['Authorization'] as string)
    } catch (error) {
        console.log(error);
        next(error)
    }
}



//GET | OBTAIN

export async function getItems(req: Request, res: Response, next: NextFunction) {
    
    try {
        const data = await obtainDataWithRedis('items', async () => {            
            const items = await ZohoGetItems(req.headers['Authorization'] as string)
            
            // Fields Constraints
            const neededFields = [
                "item_id", "name", "group_name", "unit", "item_type", "description", "locations", "rate",   
            ];

            // Apply constraints
            const filtered = items.map((item: any) => pick(item, neededFields))
            return JSON.stringify(filtered);
        },3600)

        if(!data) return res.status(404).json({message: 'No items found'})
        return res.status(200).json(JSON.parse(data));
    } catch (error) {
        console.error(error);
        return next(error)   
    }
}


