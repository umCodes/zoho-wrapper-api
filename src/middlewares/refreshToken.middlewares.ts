import { log } from "console";
import { NextFunction, Request, Response } from "express";



let expiryDate = 0;
let access_token = '';

export async function refreshZohoToken(req: Request, res: Response, next: NextFunction) {
    try {
         
        log('Refereshing')
        log(access_token, expiryDate)
        req.headers['Authorization'] = `Bearer ${access_token}`;
        if(expiryDate && expiryDate > Date.now()) return next();
        

        
        const cliendId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        // const code = process.env.CODE;
        const params = new URLSearchParams({
            client_id: cliendId!,
            client_secret: clientSecret!,
            refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
            redirect_uri: process.env.ZOHO_REDIRECT_URI!,
            grant_type: 'refresh_token',
        })

        const respose = await fetch(`https://accounts.zoho.com/oauth/v2/token?${params}`, {
            method: 'POST',
        })
        log(respose)
        
        const data = await respose.json()
        access_token = data.access_token;
        expiryDate = Date.now() + data.expires_in * 1000;

        req.headers['Authorization'] = `Bearer ${access_token}`;


        return next();
    } catch (error) {
        console.error(error);
        return next(error)
    }
}
