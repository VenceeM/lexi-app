import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config();

export const verifyToken = async (token) => {
    try {

        const accessToken = jwt.verify(token, process.env.JWT_KEY)
        return accessToken

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return { message: 'Access token expired' }
        } else if (error instanceof jwt.JsonWebTokenError) {
            return { message: 'Access token invalid' }
        } else {
            return { message: error.message }
        }
    }
}