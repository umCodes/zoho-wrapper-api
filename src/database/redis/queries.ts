import { redisClient } from ".";


export async function obtainDataWithRedis(key: string, cb: () => Promise<string>, duration?: number){
    try {
        const data = await redisClient.get(key);
        if(data !== null) return data;

        const obtainedData = await cb();
        console.log(obtainedData);
        
        if(!obtainedData) throw new Error('Your callback should return a valid data in string format');
        duration ? await redisClient.set(key, obtainedData, {EX: duration}) : await redisClient.set(key, obtainedData)
        return obtainedData
    } catch (error) {
        console.error(error);
        throw error
    }
}

export default async function removeDataFromRedis(key: string){
    try {
        const data = await redisClient.del(key);
    } catch (error) {
        console.error(error);
        throw error;
            
    }
}




