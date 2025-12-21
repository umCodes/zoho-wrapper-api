import { NextFunction, Request, Response } from "express";
import { obtainDataWithRedis } from "../database/redis/queries";
import { ZohoGetCustomers } from "../services/customers.services";
import { pick } from "../utils/helpers";






export async function getCustomers(req: Request, res: Response, next: NextFunction){
    try {
        const data = await obtainDataWithRedis('customers', async () => {
            const customers = await ZohoGetCustomers(req.headers['Authorization'] as string)

            // Fields Constraints
            const neededFields = [
                "contact_id", "contact_name", "company_name"   
            ];

            
            // Apply constraints        
            const filtered = customers.map((order: any) => pick(order, neededFields))
            return JSON.stringify(filtered);
        }, 7200)

        if(!data) return res.status(404).json({message: 'No customers found'})
        return res.status(200).json(JSON.parse(data));
    } catch (error) {
        console.error(error);
        return next(error)   
    }
}