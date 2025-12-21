import { NextFunction, Request, Response } from "express";




export async function errorHanlder(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.status || 500;
    const message = err.message;
    console.error(err);
    res.status(status).json({ 
        message: err.status <= 500 ? message : "Internal Server Error", 
        status: err.status 
    });   

}
