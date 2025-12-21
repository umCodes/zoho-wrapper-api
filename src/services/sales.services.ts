import { obtainDataWithRedis } from "../database/redis/queries";



export async function ZohoCreateSalesOrder(salesOrderDataPayload: string, headers: string){
    
    try {
        const response = await fetch(`https://www.zohoapis.com/inventory/v1/salesorders?organization_id=${process.env.ORGANIZATION_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': headers,
            },
            body: salesOrderDataPayload
        })
        
        const data = await response.json();
        console.log(response, data);
        
        return data;
            
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function ZohoGetSalesOrders(headers: string){
    
    try {
        const response = await fetch(`https://www.zohoapis.com/inventory/v1/salesorders?organization_id=${process.env.ORGANIZATION_ID}`, {
            method: 'GET',
            headers: {
                'Authorization': headers,
            }})
        const data = await response.json()
        
        return data.salesorders;             
    } catch (error) {
        console.error(error);
        throw error;        
    }
}


export async function ZohoGetSalesOrderById(id: string, headers: string){
    console.log(id);
    
    try {    
        const response = await fetch(`https://www.zohoapis.com/inventory/v1/salesorders/${id}?organization_id=${process.env.ORGANIZATION_ID}`, {
            method: 'GET',
            headers: {
                'Authorization': headers,
            }})
        const data = await response.json()
        // console.log("🟢 Order:  ", data.salesorder);

        if(!data) throw new Error('Sales not found')
        return data.salesorder;
    } catch (error) {
        console.error(error);
        throw error;        
    }
}

