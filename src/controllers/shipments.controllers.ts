import { NextFunction, Request, Response } from "express";
import { ZohoGetShipmentById } from "../services/shipment.services";
import { HttpError } from "../errors/error";
import { obtainDataWithRedis } from "../database/redis/queries";
import { pick } from "../utils/helpers";

// GET | OBTAIN
export async function getShipmentById(req: Request, res: Response, next: NextFunction){
    // Sales ID
    const id = req.params.id;
    
    try {
        // Validate ID
        if(!id) throw new HttpError("Invalid Salesorder ID.", 400)
        
        const salesorder = await obtainDataWithRedis(`shipments/${id}`, async () => {
            try {
                //Get full data from zoho
                const order = await ZohoGetShipmentById(id, req.headers["Authorization"] as string)
                // Fields Constraints
                const neededFields = [
                    "salesorder_id", "customer_name", "customer_id", "total", "date",
                    "salesorder_number", "line_items"
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