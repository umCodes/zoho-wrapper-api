import { NextFunction, Request, Response } from "express";
import { PackageOrder, PackageOrderFields, PackageOrderItemsFields } from "../models/packages.models";
import { HttpError } from "../errors/error";
import { ZohoCreatePackage, ZohoGetPackages } from "../services/packages.services";
import { obtainDataWithRedis } from "../database/redis/queries";
import { pick } from "../utils/helpers";
import { ZohoCreateShipment } from "../services/shipment.services";



//POST | CREATE

export async function createPackage(req: Request, res: Response, next: NextFunction){
    const packageOrderData: PackageOrder = req.body || {};
    
        // Required fields:
        const requiredFields: PackageOrderFields = ["salesorder_id", "package_number", "line_items"]
        const requiredItemsFields: PackageOrderItemsFields = ["so_line_item_id" , "quantity"]
        
        try{
            // Check if Required fields are provided:
            if(!requiredFields.every(field => field in packageOrderData)) throw new HttpError('Missing required fields in item data.', 400)
            if(!requiredItemsFields.every(field => field in packageOrderData.line_items)) throw new HttpError('Missing required fields in location data.', 400)
    
            // Check whether provided fields are valid:
            if(!packageOrderData.salesorder_id) throw new HttpError('Salesorder ID not provided', 400)
            if(packageOrderData.line_items.length === 0 || !packageOrderData.line_items) throw new HttpError('Line items not provided', 400)
    
            
            // Create Package with Zoho
            const response = await ZohoCreatePackage(packageOrderData.salesorder_id, JSON.stringify(packageOrderData) , req.headers['Authorization'] as string);
            
            return res.status(200).json(response);
        }catch(error){
            console.error("Error:", error);
            next(error)
        }
}

export async function shipOrder(req: Request, res: Response, next: NextFunction){
    const {salesorder_id, package_ids} = req.body
        try{
            if(!salesorder_id || typeof salesorder_id !== "string") throw new HttpError('Salesorder ID not provided', 400)
            
            
            // Create Package with Zoho
            const response = await ZohoCreateShipment(salesorder_id, package_ids, JSON.stringify({
                delivery_method: "Driver",
            }) , req.headers['Authorization'] as string);
            
            return res.status(200).json(response);
        }catch(error){
            console.error("Error:", error);
            next(error)
        }
}



//GET | OBTAIN

export async function getPackages(req: Request, res: Response, next: NextFunction){


    try {
        const packages = await obtainDataWithRedis('packages', async () => {
            try {
                const fullData = await ZohoGetPackages(req.headers["Authorization"] as string)
                  //Get full data from zoho
                
                // Fields Constraints
                const neededFields =  [
                    "created_time",
                    "customer_id",
                    "customer_name",
                    "date",
                    "package_id",
                    "package_number",
                    "salesorder_id",
                    "salesorder_number",
                    "total_quantity"
                ]
    
                // Apply constraints
                const neededDataArr = fullData.map((order: any) => pick(order, neededFields))
    
                return JSON.stringify(neededDataArr)
            } catch (error) {
                throw error
            }
        })

        if(!packages) return res.status(404).json({message: 'No salesorders found'})
        return res.status(200).json(JSON.parse(packages));
    } catch (error) {
        console.error(error)
        next(error)
    }
} 