



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