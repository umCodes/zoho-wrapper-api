import { createClient } from 'redis';


export const redisClient = createClient();


redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('✅ Connected to Redis');
  }
}
