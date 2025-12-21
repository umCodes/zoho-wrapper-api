

export async function ZohoGetCustomers(headers: string){
    
    try {
        const response = await fetch(`https://www.zohoapis.com/inventory/v1/contacts?organization_id=${process.env.ORGANIZATION_ID}`, {
            method: 'GET',
            headers: {
                'Authorization': headers,
            }})
        const data = await response.json()
        
        return data.contacts;             
    } catch (error) {
        console.error(error);
        throw error;        
    }
}
