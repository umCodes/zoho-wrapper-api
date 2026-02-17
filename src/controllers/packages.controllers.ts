import { NextFunction, Request, Response } from "express";
import { PackageOrder, PackageOrderFields, PackageOrderItemsFields } from "../models/packages.models";
import { HttpError } from "../errors/error";
import { ZohoCreatePackage, ZohoGetPackageById, ZohoGetPackages } from "../services/packages.services";
import removeDataFromRedis, { obtainDataWithRedis } from "../database/redis/queries";
import { generateDateString, pick } from "../utils/helpers";
import { ZohoCreateShipment } from "../services/shipment.services";



//POST | CREATE
export async function createPackage(req: Request, res: Response, next: NextFunction) {
    const packageOrderData: PackageOrder = req.body || {};
    const requiredFields: PackageOrderFields = ["salesorder_id", "line_items", "date"];
    const requiredItemsFields: PackageOrderItemsFields = ["so_line_item_id", "quantity"];

    console.log(packageOrderData);
    

    try {
        // Validate required fields
        if (!requiredFields.every(field => field in packageOrderData))
            throw new HttpError('Missing required fields in item data.', 400);
        if (!requiredItemsFields.every(field => packageOrderData.line_items.every(item => field in item)))
            throw new HttpError('Missing required fields in line items.', 400);
        if (!packageOrderData.salesorder_id) throw new HttpError('Salesorder ID not provided', 400);
        if (!packageOrderData.line_items || packageOrderData.line_items.length === 0)
            throw new HttpError('Line items not provided', 400);

        const authToken = req.headers['Authorization'] as string;


        // if (packageOrderData.order_status === "draft") {
        //     console.log(await ZohoConfirmSalesOrder(packageOrderData.salesorder_id, authToken));
        // }

        console.log(packageOrderData.salesorder_id, packageOrderData);
        
        const response = await ZohoCreatePackage(packageOrderData.salesorder_id, JSON.stringify({...packageOrderData, package_number: `PA-${generateDateString()}`}), authToken);
        console.log(response);

        await removeDataFromRedis("salesorders")
        await removeDataFromRedis("packages")
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error:", error);
        next(error);
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
            
            await removeDataFromRedis("packages")
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

        console.log(packages);
        

        if(!packages) return res.status(404).json({message: 'No salesorders found'})
        return res.status(200).json(JSON.parse(packages));
    } catch (error) {
        console.error(error)
        next(error)
    }
} 


export async function getPackgeById(req: Request, res: Response, next: NextFunction){
    // Sales ID
    const id = req.params.id;
    
    try {
        // Validate ID
        if(!id) throw new HttpError("Invalid Package ID.", 400)
        
        const order_package = await obtainDataWithRedis(`packages/${id}`, async () => {
            try {
                //Get full data from zoho
                const order_package = await ZohoGetPackageById(id, req.headers["Authorization"] as string)
                // Fields Constraints
                const neededFields = [
                    "customer_name", "customer_id", "date", "created_time", "package_id", "package_number",
                    "salesorder_id", "salesorder_number", "line_items"
                ];
                const neededLineItemsFields = ["item_id", "so_line_item_id" , "name", "unit", "quantity" ]

                //If data not corrcetly obtained, throw an error
                if( Object.keys(order_package).length === 0 ) throw new Error('A problem occured retrieving data, please try again.')
                
                // Apply constraints
                const filtered = {
                    ...pick(order_package, neededFields),
                    line_items: order_package.line_items.map((item: any) => pick(item, neededLineItemsFields))
                }

                console.log(filtered.line_items);
                
                return JSON.stringify(filtered)
            
            } catch (error) {
                throw error
            }
            
        })
        
        
        if(!order_package) return res.status(404).json({message: 'No package found'})
        return res.status(200).json(JSON.parse(order_package));

    } catch (error) {
        console.error(error);
        next(error);
    }
}