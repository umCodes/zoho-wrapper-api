import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SIGNATURE } from "../env";
import { UserPayload } from "../models/auth.models";
import { HttpError } from "../errors/error";
import { isTokenUsed } from "../database/postgresql/queries";


export function compareTokens(token1: string, token2: string) {
    const uid1 = (jwt.decode(token1) as UserPayload).sub;
    const uid2 = (jwt.decode(token2) as UserPayload).sub; //change type later 🔴    
    return uid1 === uid2
}


export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const access_token = authHeader && authHeader.split(" ")[1]; 

    try {
        if (!access_token) throw new HttpError("Access token is missing", 401);
        const payload = jwt.verify(access_token, ACCESS_TOKEN_SIGNATURE) as UserPayload;
        if (!payload) throw new HttpError("Invalid token", 403);
        req.user = payload;
        next();
    } catch (error) {
        return next(error);
    }

}



