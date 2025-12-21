

export async function ZohoCreateAssembly(assemblyDataPayload: string, headers: string){
    try {
        const response = await fetch(`https://www.zohoapis.com/inventory/v1/bundles?organization_id=${process.env.ORGANIZATION_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': headers,
            },
            body: assemblyDataPayload
        })
        return await response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}