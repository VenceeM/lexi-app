import { Router } from "express";
import { login, logout, middleWare, signUp, refreshTokenContoller } from '../../controllers/auth/authController.js'

const authRoute = Router();

// Account Registration
authRoute.post('/sign-up', signUp);

//Login
authRoute.post('/login', login);

//Logout
authRoute.get('/logout', middleWare, logout)

//Refresh token
authRoute.post('/refresh-token', refreshTokenContoller)

export default authRoute;