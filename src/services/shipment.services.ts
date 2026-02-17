



export async function ZohoCreateShipment(salesorder_id: string, package_ids: string, body: string , headers: string) {
    try {

        const response = await fetch(`https://www.zohoapis.com/inventory/v1/shipmentorders?organization_id=${process.env.ORGANIZATION_ID}&salesorder_id=${salesorder_id}&package_ids=${package_ids}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': headers,
            },
            body
        })

        const data = await response.json();
        console.log(data);  
        
        return {
            code: data.code,
            message: data.message
        }
    } catch (error) {
        
    }
}

//shipmentorders

export async function ZohoGetShipmentById(id: string, headers: string){ 
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

