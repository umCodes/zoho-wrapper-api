import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/error";




export async function errorHanlder(err: any, req: Request, res: Response, next: NextFunction) {

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.status < 500 ? err.message : 'Internal Server Error',
      status: err.status,
    });
  }
  return res.status(500).json({
    message: 'Internal Server Error',
    status: 500,
  });

}
