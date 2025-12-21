import { pool } from "./index";

type UserSchema = {
    name: string;
    role: 'client' | 'preparer' | 'loader' | 'driver' | 'admin';
    phone_number: string;
    password: string;
    refresh_token?: string;
    expires_at?: string;
}

type UsedTokenSchema = {
    user_id: number;
    token: string;
    last_used_at: string;
}

export async function insertUser(user: UserSchema){
    const ALLOWED_COLUMNS = ['name', 'role', 'password', 'phone_number', 'refresh_token', 'expires_at']; 
    const entries = Object.entries(user).filter(([key]) => ALLOWED_COLUMNS.includes(key));
    const keys = entries.map(([key]) => key);
    const values = entries.map(([_, value]) => value);

    try {
        const result = await pool.query(`
            INSERT INTO users (${keys.join(', ')})
            VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')})
            RETURNING *;
            `, 
            values
        );

        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
        
    }
}


export async function getUser(id: number){
    try {
        const result = await pool.query(`
            SELECT * FROM users WHERE id = $1;`, 
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
        
    }
}

export async function findUser(by: {id?: number, phone_number?: string}){
    const ALLOWED_COLUMNS = ['phone_number', 'id']; 
    const entry = Object.entries(by).filter(([key]) => ALLOWED_COLUMNS.includes(key))[0];

    try {
        if(!entry) throw new Error('Provide a valid entry.');
        const [key, value] = entry;
        const result = await pool.query(`
            SELECT * FROM users WHERE ${key} = $1;`, 
            [value]
        );
        return result.rows[0];
    } catch (error) {
        console.error(error);
        return null;
        
    }
}


export async function updateUser(id: number, updates: Partial<UserSchema>){
    
    const ALLOWED_COLUMNS = ['name', 'role', 'password', 'phone_number', 'refresh_token', 'expires_at']; 
    const entries = Object.entries(updates).filter(([key]) => ALLOWED_COLUMNS.includes(key));

    try {
        if(entries.length === 0) throw new Error('No updates provided.');
        const result = await pool.query(`
            UPDATE users
            SET ${entries.map(([key], i) => `${key} = $${i + 2}`).join(', ')}
            WHERE id = $1 RETURNING *;
        `, 
            [id, ...entries.map(([_, value]) => value)]
        );

        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
        
    }
}



export async function deleteUser(id: number){
    try {
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1 RETURNING *;`, 
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
        
    }
}



export async function moveTokenToUsedTokens(token: UsedTokenSchema){
    try {
        const result = await pool.query(`
            INSERT INTO used_refresh_tokens (user_id, token, last_used_at)
            VALUES ($1, $2, $3) RETURNING *;
            `, 
            [token.user_id, token.token, token.last_used_at]
        );

        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function isTokenUsed(token: string){
    try {
        const result = await pool.query(`
            SELECT * FROM used_refresh_tokens WHERE token = $1;`, 
            [token]
        );
        return result.rows[0] ? true : false
    } catch (error) {
        console.error(error);
        return false;        
    }
}