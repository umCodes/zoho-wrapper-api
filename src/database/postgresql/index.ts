import { Pool } from "pg";
import { DB_CONFIG } from "../../env";


export const pool = new Pool(DB_CONFIG);




export async function connectToDB(){
    try {
        await pool.connect();
        console.log('☑️  Connected to PostreSQL DB.');
    } catch (error) {
        console.error('❌ Failed to connect to PostgreSQL DB.', error);
    }
}





