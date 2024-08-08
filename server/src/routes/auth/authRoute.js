import { Router } from "express";

const authRoute = Router();

//Login
authRoute.post('/login');

//Logout
authRoute.get('/logout')


export default authRoute;