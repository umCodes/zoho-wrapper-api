

export async function ZohoCreatePackage(salesorder_id: string, body: string , headers: string) {
    try {

        const response = await fetch(`https://www.zohoapis.com/inventory/v1/packages?organization_id=${process.env.ORGANIZATION_ID}&salesorder_id=${salesorder_id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': headers,
            },
            body
        })

        const data = await response.json();
        return {
            code: data.code,
            message: data.message
        }
    } catch (error) {
        
    }
}

export async function ZohoGetPackages(headers: string) {
    try {

        const response = await fetch(`https://www.zohoapis.com/inventory/v1/packages?organization_id=${process.env.ORGANIZATION_ID}&filter_by=Status.NotShipped`, {
            method: "GET",
            headers: {
                'Authorization': headers,
            }
        })

        const data = await response.json();
        console.log(data);
        
        return data.packages; 
    } catch (error) {
        throw error;
    }
}