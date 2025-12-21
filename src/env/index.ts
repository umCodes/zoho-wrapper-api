import dotenv from 'dotenv';
dotenv.config()


export const PORT = process.env.PORT || 3000;

//  JWT Signatures:
export const ACCESS_TOKEN_SIGNATURE = process.env.ACCESS_TOKEN_SIGNATURE as string;
export const REFRESH_TOKEN_SIGNATURE = process.env.REFRESH_TOKEN_SIGNATURE as string;

//  JWT Expiry Times:
export const ACCESS_TOKEN_EXPIRY = Number(process.env.ACCESS_TOKEN_EXPIRY);
export const REFRESH_TOKEN_EXPIRY = Number(process.env.REFRESH_TOKEN_EXPIRY);



//  Development DB

export const DB_CONFIG = {
    host: process.env.PG_HOST as string,
    port: Number(process.env.PG_PORT),
    user: process.env.PG_USER as string,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB_NAME as string
}