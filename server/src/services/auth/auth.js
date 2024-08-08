import jwt from 'jsonwebtoken'
import { revealPassword } from '../../utils/passwordUtils'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config()

const prisma = new PrismaClient()

const insertRefreshToken = async (refreshToken, userId) => {
    try {
        const token = await prisma.refreshTokens.create({
            data: {
                refresh_token: refreshToken,
                user_id: userId
            }
        });
        return token;
    } catch (error) {
        console.log(error);
    }
}

export const login = async (email, password) => {

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return { message: 'Incorrect email or password' };
        }

        const isPasswordValid = await revealPassword(user.password, password);

        if (!isPasswordValid) {
            return { message: 'Incorrect email or password' };
        }
        const secret = process.env.JWT_KEY
        const accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION
        const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION

        const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: accessTokenExpiration })
        const refreshToken = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: refreshTokenExpiration })
        insertRefreshToken(refreshToken, user.id);

        const userObject = {
            id: user.id,
            email: user.email,
            access_token: token,
            refresh_token: refreshToken
        }

        return userObject;
    } catch (error) {
        console.error(error)
    }
}