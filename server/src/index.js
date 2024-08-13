import express from 'express';
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import { config } from 'dotenv'
import authRoute from './routes/auth/authRoute.js';
import userRoute from './routes/user/userRoute.js';
import { middleWare } from './controllers/auth/authController.js'
config()


const app = express();
app.use(cors());
app.use(express.json())

const apiV1 = '/api/v1';

app.use(apiV1 + '/auth', authRoute);
app.use(apiV1, middleWare, userRoute);

const PORT = process.env.SERVER_PORT || 4000
app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});