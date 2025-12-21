import "express";
import "express-serve-static-core";
import { UserPayload } from "../models/auth.models";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}

declare module "express" {
  interface Request {
    user?: UserPayload;
  }
}