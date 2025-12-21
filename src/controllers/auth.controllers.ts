import { NextFunction, Request, Response } from "express";
import { findUser, insertUser, isTokenUsed, moveTokenToUsedTokens, updateUser } from "../database/postgresql/queries";
import { HttpError } from "../errors/error";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SIGNATURE } from "../env";
import { UserPayload } from "../models/auth.models";
import { compareTokens } from "../middlewares/auth.middlewares";
import { access } from "fs";


export async function register(req: Request, res: Response, next: NextFunction){
        const {
        name, 
        role, 
        phone_number,
        password,
        confirm_password
    } = req.body
    
    
    
    const phoneNumberPattern =  /^\+?9665[0-9]{8}$|^05[0-9]{8}$/
    try {
        if(await findUser({phone_number})) throw new HttpError('User already exists.', 400)  
        if(!phoneNumberPattern.test(phone_number)) throw new HttpError('Invalid Phone Number.', 400)
        if(password.length < 6) throw new HttpError('Password must be at least 6 characters long.', 400);
        if(password !== confirm_password) throw new HttpError('Passwords do not match.', 400);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await insertUser({
            name,
            role,
            phone_number,
            password: hashedPassword
        })

        const tokens = {
            access: jwt.sign({role, sub: user.id}, ACCESS_TOKEN_SIGNATURE, {expiresIn: ACCESS_TOKEN_EXPIRY}),
            refresh: jwt.sign({role, sub: user.id}, REFRESH_TOKEN_SIGNATURE, {expiresIn: REFRESH_TOKEN_EXPIRY})
        }

        
        await updateUser(user.id.toString(), {
            refresh_token: tokens.refresh,
            expires_at: new Date(Date.now()  + REFRESH_TOKEN_EXPIRY).toISOString()
        })

        
        return res.status(201).json({message: "User registered successfully", 
            access_token: tokens.access, 
            access_token_expiry: ACCESS_TOKEN_EXPIRY,
            refresh_token: tokens.refresh
        });
        
    } catch (error) {
        console.error(error);
        next(error);
           
    }
}



export async function login(req: Request, res: Response, next: NextFunction){
    const {phone_number, password} = req.body

    try {
        const user = await findUser({phone_number});
        if(!user) throw new HttpError('Invalid phone number or password.', 401);
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) throw new HttpError('Invalid phone number or password.', 401);

        
        const tokens = {
            access: jwt.sign({role: user.role, sub: user.id}, ACCESS_TOKEN_SIGNATURE, {expiresIn: ACCESS_TOKEN_EXPIRY}),
            refresh: jwt.sign({role: user.role, sub: user.id}, REFRESH_TOKEN_SIGNATURE, {expiresIn: REFRESH_TOKEN_EXPIRY})
        }

        await moveTokenToUsedTokens({
            user_id: user.id,
            token: user.refresh_token,
            last_used_at: new Date().toISOString()
        })
        
        await updateUser(user.id.toString(), {
            refresh_token: tokens.refresh,
            expires_at: new Date(Date.now()  + REFRESH_TOKEN_EXPIRY).toISOString()
        })

        
        return res.status(201).json({message: "User registered successfully", 
            access_token: tokens.access, 
            access_token_expiry: ACCESS_TOKEN_EXPIRY,
            refresh_token: tokens.refresh,

        });
        
    } catch (error) {
        console.error(error);
        if(error instanceof HttpError) next(error)
        else next(new HttpError('Internal Server Error', 500));
               
    }
}


export async function logout(req: Request, res: Response, next: NextFunction){
    
    const refreshToken = req.headers['auth-refresh-token'] as string;

    if(!refreshToken) return;   
    const payload = jwt.verify(refreshToken, String(REFRESH_TOKEN_SIGNATURE)) as UserPayload;
    const {sub} = payload; 
    try {
        if(await isTokenUsed(refreshToken)) throw new HttpError('Invalid refresh token.', 403);
        await moveTokenToUsedTokens({
            user_id: sub,
            token: refreshToken,
            last_used_at: new Date().toISOString()
        })
        
        return res.status(200).json({
            message: 'Logged out successfully.'
        })
    } catch (error) {
        console.error(error);
        if(error instanceof HttpError) next(error)
        else next(new HttpError('Internal Server Error', 500));
    }

}




export async function refreshToken(req: Request, res: Response, next: NextFunction){
    
    //Get Tokens...
    const refreshToken = req.headers['auth-refresh-token'] as string;
    const accessToken = req.headers['authorization']?.split(' ')[1];   
        
    try {
        const validateRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SIGNATURE) as UserPayload;
        if(!refreshToken || !accessToken || !validateRefreshToken) throw new HttpError('Access or Refresh Token not provided.', 400);
        if(!compareTokens(accessToken, refreshToken)) throw new HttpError('Invalid access token.', 403);
        if(await isTokenUsed(refreshToken)) throw new HttpError('Invalid refresh token.', 403);

        //Extract UID
        const payload = jwt.decode(accessToken) as UserPayload;
    
        const {sub, role} = payload;
        if(!sub) throw new HttpError('Invalid token payload.', 403);
        

        //Refresh expired tokens

        return res.status(200).json({
            message: 'Tokens refreshed successfully.',
            accessToken: jwt.sign({sub, role}, ACCESS_TOKEN_SIGNATURE, { expiresIn: ACCESS_TOKEN_EXPIRY }),
            expiresIn: ACCESS_TOKEN_EXPIRY
        })

        
    } catch (error) {
        console.error(error);
        if(error instanceof HttpError) next(error)
        else next(new HttpError('Internal Server Error', 500));
    }


}