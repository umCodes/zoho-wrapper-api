import { Router } from 'express'
import { login, register, refreshToken, logout } from '../controllers/auth.controllers';

const authRouter = Router();

authRouter.post('/api/auth/register', register)
authRouter.post('/api/auth/login', login)
authRouter.post('/api/auth/logout', logout)
authRouter.post('/api/auth/refresh', refreshToken)

export default authRouter;