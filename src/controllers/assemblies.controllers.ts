import { NextFunction, Request, Response } from "express";
import { Assembly, AssemblyKeys, AssemblyLineItemKeys } from "../models/assembly.models";
import { ZohoCreateAssembly } from "../services/assembly.services";
import { HttpError } from "../errors/error";
import { generateDateString } from "../utils/helpers";
import { WAREHOUSE_ID } from "../env";
import removeDataFromRedis from "../database/redis/queries";






export async function createAssembly(req: Request, res: Response, next: NextFunction) {
    const assemblyData: Assembly = req.body || {};
    req.body.is_complete = true;
    // req.body.location_id = WAREHOUSE_ID;
    req.body.warehouse_id = WAREHOUSE_ID;


    
    
    const requiredFields: AssemblyKeys = ['composite_item_id', "composite_item_name", 'description', 'date', 'quantity_to_bundle', 'line_items', 'is_complete', "warehouse_id"];
    const lineItemFields: AssemblyLineItemKeys = ['item_id', 'name', 'quantity_consumed', 'unit', "warehouse_id"];
    
    
    try{        
        if(!requiredFields.every(field => field in assemblyData)) throw new HttpError('Missing required fields in assembly data.', 400)
        
        if(!lineItemFields.every(field => assemblyData.line_items.every(item =>{ 
            item.warehouse_id = WAREHOUSE_ID;                
            return field in item
            
        }))) throw new HttpError('Missing required fields in line items data.', 400)
        
        if(!assemblyData.composite_item_id || !assemblyData.composite_item_name || !assemblyData.description || !assemblyData.date || !assemblyData.quantity_to_bundle || assemblyData.is_complete !== true) throw new HttpError('Please fill all the required fields.', 400)

        console.log(assemblyData);
        const assemble = await ZohoCreateAssembly(JSON.stringify({...assemblyData, refrence_number: `ASM-${assemblyData.composite_item_id}.${generateDateString()}`}), req.headers['Authorization'] as string)
        
        console.log(assemble);
        await removeDataFromRedis(`compositeItem/${assemblyData.composite_item_id}`)
        return 
    }catch(error){
        console.log(error);
        return next(error)     
    }    
}



