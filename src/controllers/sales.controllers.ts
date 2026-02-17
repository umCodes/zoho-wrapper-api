import { NextFunction, Request, Response } from "express";
import { ZohoCreateSalesOrder, ZohoGetSalesOrderById, ZohoGetSalesOrders, ZohoGetShipments } from "../services/sales.services";
import { SalesOrder, SalesOrderKeys, SalesOrderLineItemKeys } from "../models/sales.models";
import { HttpError } from "../errors/error";
import removeDataFromRedis, { obtainDataWithRedis } from "../database/redis/queries";
import { pick } from "../utils/helpers";



// POST | CREATE
export async function createSalesOrder(req: Request, res: Response, next: NextFunction){
    const salesOrderData: SalesOrder = req.body || {};

    console.log(salesOrderData);
    
    // Required fields:
    const requiredFields: SalesOrderKeys = ['customer_id', "line_items"]
    const requiredItemsFields: SalesOrderLineItemKeys = ['item_id', "quantity"]
    
    try{
        // Check if Required fields are provided:
        if(!requiredFields.every(field => field in salesOrderData)) throw new HttpError('Missing required fields in item data.', 400)
        if(!requiredItemsFields.every(field => salesOrderData.line_items.every(item => field in item))) throw new HttpError('Missing required fields in line_item data.', 400)

        // Check whether provided fields are valid:
        if(!salesOrderData.customer_id) throw new HttpError('Customer ID not provided', 400)
        if(salesOrderData.line_items.length === 0 || !salesOrderData.line_items) throw new HttpError('Line items not provided', 400)

        
        // Create Order with Zoho
        const response = await ZohoCreateSalesOrder(JSON.stringify({
            customer_id: salesOrderData.customer_id,
            line_items: salesOrderData.line_items
        }), req.headers['Authorization'] as string);
        

        await removeDataFromRedis("salesorders")
        return res.status(200).json(response);
    }catch(error){
        console.error("Error:", error);
        next(error)
    }
    
}


// GET | OBTAIN
export async function getSalesOrders(req: Request, res: Response, next: NextFunction) {
    try {
            
        //Get full data from zoho
        const fullData =  await ZohoGetSalesOrders(req.headers['Authorization'] as string)
        
        // Fields Constraints
        const neededFields = [
            "salesorder_id", "customer_name", "customer_id", "total", "date",
            "salesorder_number", "quantity", "order_status", "invoiced_status",
            "paid_status", "shipped_status", "status", "balance"
        ];

        // Apply constraints
        const neededDataArr = fullData.map((order: any) => pick(order, neededFields))

        const salesorders =  JSON.stringify(neededDataArr)
        

        if(!salesorders) return res.status(404).json({message: 'No salesorders found'})
        return res.status(200).json(JSON.parse(salesorders));
    } catch (error) {
        console.error(error);
        return next(error)
    }
}

export async function getSalesOrderById(req: Request, res: Response, next: NextFunction){
    // Sales ID
    const id = req.params.id;
    
    try {
        // Validate ID
        if(!id) throw new HttpError("Invalid Salesorder ID.", 400)
        
        const salesorder = await obtainDataWithRedis(`salesorders/${id}`, async () => {
            try {
                //Get full data from zoho
                const order = await ZohoGetSalesOrderById(id, req.headers["Authorization"] as string)
                // Fields Constraints
                const neededFields = [
                    "salesorder_id", "customer_name", "customer_id", "total", "date",
                    "salesorder_number", "order_status", "invoiced_status",
                    "paid_status", "shipped_status", "status", "balance", "line_items"
                ];
                const neededLineItemsFields = ["item_id", "line_item_id" , "name", "unit", "quantity", "rate", "item_total"]

                //If data not corrcetly obtained, throw an error
                if( Object.keys(order).length === 0 ) throw new Error('A problem occured retrieving data, please try again.')
                
                // Apply constraints
                const filtered = {
                    ...pick(order, neededFields),
                    line_items: order.line_items.map((item: any) => pick(item, neededLineItemsFields))
                }

                console.log(filtered.line_items);
                
                return JSON.stringify(filtered)
            
            } catch (error) {
                throw error
            }
            
        })
        
        
        if(!salesorder) return res.status(404).json({message: 'No salesorder found'})
        return res.status(200).json(JSON.parse(salesorder));

    } catch (error) {
        console.error(error);
        next(error);
    }
}


export async function getShipments(req: Request, res: Response, next: NextFunction) {
    try {
            
        //Get full data from zoho
        const fullData =  await ZohoGetShipments(req.headers['Authorization'] as string)
        
        // Fields Constraints
        const neededFields = [
            "salesorder_id", "customer_name", "customer_id", "total", "date",
            "salesorder_number", "quantity", "order_status", "invoiced_status",
            "paid_status", "shipped_status", "status", "balance"
        ];

        // Apply constraints
        const neededDataArr = fullData.map((order: any) => pick(order, neededFields))

        const salesorders =  JSON.stringify(neededDataArr)
        

        if(!salesorders) return res.status(404).json({message: 'No salesorders found'})
        return res.status(200).json(JSON.parse(salesorders));
    } catch (error) {
        console.error(error);
        return next(error)
    }
}
