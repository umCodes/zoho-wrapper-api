/// <reference path="./types/express.d.ts" />
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { PORT } from './env/index';

import { connectToDB } from './database/postgresql';
import { connectRedis } from './database/redis';


import { authenticateToken } from './middlewares/auth.middlewares';
import { refreshZohoToken } from './middlewares/refreshToken.middlewares';



import authRouter from './routes/auth.routes';
import salesRouter from './routes/sales.routes';
import itemsRouter from './routes/items.routes';
import packagesRouter from './routes/packages.routes';
import customersRouter from './routes/customers.routes';
import { errorHanlder } from './middlewares/errorhandler.middlewares';
import assemblyRouter from './routes/assemblies.routes';
import shipmentsRouter from './routes/shipments.routes';


const app = express();
const limiter = rateLimit({
    max: 250,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, try again in an hour."
})
const authLimiter = rateLimit({
    max: 5,
    windowMs: 10*60*1000,
    message: "Too many login attempts from this IP, try again in 10 minutes."
})

app.use("/api", limiter)
app.use("/api/auth", authLimiter)
app.use(express.json());


app.use(authRouter);
app.use(authenticateToken);
app.use(refreshZohoToken);
app.use(salesRouter);
app.use(shipmentsRouter);
app.use(itemsRouter);
app.use(assemblyRouter);
app.use(packagesRouter);
app.use(customersRouter);

app.use(errorHanlder);


(async () =>{
    await connectToDB();
    await connectRedis();
})()




    
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})


/*
Routes Summary:
GET /api/salesorders
GET /api/salesorders/:id
POST /api/salesorders

GET /api/items
POST /api/items
POST /api/compositeItems

GET /api/packages
POST /api/packages
POST /api/packages/ship

GET /api/customers


POST /api/assembly


POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh


*/