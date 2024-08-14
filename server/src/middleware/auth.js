
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
// import { config } from 'dotenv';
// config();

const prisma = new PrismaClient();

const middlewareResponse = {
    decodedToken: null,
    message: null
}

export const auth = async (accessToken) => {

    try {
        if (!accessToken) {
            middlewareResponse.message = 'Access token not found'
            return middlewareResponse;
        }

        const invalidToken = await prisma.invalidTokens.findFirst({
            where: {
                access_token: accessToken
            }
        });

        if (invalidToken) {
            middlewareResponse.message = 'Invalid access token'
            return middlewareResponse;
        }

        const decodedToken = jwt.verify(accessToken, process.env.JWT_KEY)
        middlewareResponse.decodedToken = decodedToken;
        middlewareResponse.message = null;
        return middlewareResponse;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            middlewareResponse.message = 'Access token expired'
            return middlewareResponse
        } else if (error instanceof jwt.JsonWebTokenError) {
            middlewareResponse.message = 'Access token invalid'
            return middlewareResponse
        } else {
            middlewareResponse.message = error.message
            return middlewareResponse;
        }
    }

}