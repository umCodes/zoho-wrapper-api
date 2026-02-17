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
        const response = await fetch(`https://www.zohoapis.com/inventory/v1/salesorders?organization_id=${process.env.ORGANIZATION_ID}&status=draft`, {
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


export async function ZohoConfirmSalesOrder(salesorderId: string, headers: string) {
    try {
        const response = await fetch(`https://www.zohoapis.com/inventory/v1/salesorders/${salesorderId}/status/confirmed?organization_id=${process.env.ORGANIZATION_ID}`, {
            method: 'POST',
            headers: {
                'Authorization': headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('ZohoConfirmSalesOrder Error:', error);
        throw error;
    }
}



export async function ZohoGetShipments(headers: string){
    
    try {
        const response = await fetch(`https://www.zohoapis.com/inventory/v1/salesorders?organization_id=${process.env.ORGANIZATION_ID}`, {
            method: 'GET',
            headers: {
                'Authorization': headers,
            }})
        const data = await response.json()
        
        const filtered = data.salesorders.filter((so: any) => so.shipped_status === "shipped" || so.shipped_status === "partially_shipped");
        console.log(filtered);
        
        return filtered              
    } catch (error) {
        console.error(error);
        throw error;        
    }
}