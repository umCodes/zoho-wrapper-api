import { NextFunction, Request, Response } from "express";
import { Assembly, AssemblyKeys, LineItemKeys } from "../models/assembly.models";
import { ZohoCreateAssembly } from "../services/assembly.services";
import { HttpError } from "../errors/error";






export async function createAssembly(req: Request, res: Response, next: NextFunction) {

    const assemblyData: Assembly = req.body || {};

    const requiredFields: AssemblyKeys = ['composite_item_id', "composite_item_name", 'description', 'refrence_number', 'date', 'quantity_to_bundle', 'line_items', 'is_complete'];
    const lineItemFields: LineItemKeys = ['item_id', 'name', 'quantity_consumed', 'unit', 'account_id', 'location_id'];
    
    if(!requiredFields.every(field => field in assemblyData)) throw new HttpError('Missing required fields in item data.', 400)
    if(!lineItemFields.every(field => field in assemblyData.line_items)) throw new HttpError('Missing required fields in location data.', 400)
    if(!assemblyData.composite_item_id || !assemblyData.composite_item_name || !assemblyData.description || !assemblyData.refrence_number || !assemblyData.date || !assemblyData.quantity_to_bundle || assemblyData.is_complete !== true) throw new HttpError('Please fill all the required fields.', 400)

    try{    
        return await ZohoCreateAssembly(JSON.stringify(assemblyData), req.headers['Authorization'] as string)
    }catch(error){
        console.log(error);
        return next(error)     
    }    
}



