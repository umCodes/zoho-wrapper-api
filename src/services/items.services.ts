import { log } from "node:console";

export async function ZohoCreateItem(itemsDataPayload: string, headers: string){
    
    try {
        const response = await fetch(`https://www.zohoapis.com/inventory/v1/items?organization_id=${process.env.ORGANIZATION_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': headers,
            },
            body: itemsDataPayload
        })
        return await response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function ZohoCreateCompositeItem(itemsDataPayload: string, headers: string){
    
    try {
        const response = await fetch(`https://www.zohoapis.com/inventory/v1/compositeitems?organization_id=${process.env.ORGANIZATION_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': headers,
            },
            body: itemsDataPayload
        })
        return await response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function ZohoGetItems(headers: string){

    log(headers)
    try{            
            const response = await fetch(`https://www.zohoapis.com/inventory/v1/items?organization_id=${process.env.ORGANIZATION_ID}`,{
                method: 'GET',
                headers: {
                    'Authorization': headers,
                }
            }
            )
            const json = await response.json();
            return json.items;
    }catch(error){
        throw error;
    } 

} 