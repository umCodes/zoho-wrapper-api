import { JwtPayload } from "jsonwebtoken";

export type UserPayload = JwtPayload & {
    sub: number;
    role: string;

}