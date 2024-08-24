import jwt from 'jsonwebtoken'
import { revealPassword } from '../../utils/passwordUtils.js'
import { PrismaClient, UserStatus } from '@prisma/client'
import { config } from 'dotenv'
import { hashPassword } from '../../utils/passwordUtils.js'
import { generateOtp, verifyOtp } from '../../utils/otp.js'
import { sendEmail } from '../../utils/sendGrid.js'

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

export const refreshTokenService = async (token) => {

    const refreshTokenObject = {
        accessToken: null,
        refreshToken: null,
        message: null
    }

    try {

        if (!token) {
            refreshTokenObject.message = 'User id not found.'
            return refreshTokenObject;
        }
        const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token

        const accessToken = jwt.verify(actualToken, process.env.JWT_KEY);
        const userToken = await prisma.refreshTokens.findFirst({
            where: {
                user_id: accessToken.id
            },
        });

        if (!userToken) {
            refreshTokenObject.message = 'Invalid Token'
            return refreshTokenObject
        }

        await prisma.refreshTokens.delete({
            where: {
                id: userToken.id
            }
        });


        const newAccessToken = jwt.sign({ id: accessToken.id, email: accessToken.email }, process.env.JWT_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
        const newRefreshToken = jwt.sign({ id: accessToken.id, email: accessToken.email }, process.env.JWT_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });

        await prisma.refreshTokens.create({
            data: {
                refresh_token: newRefreshToken,
                user_id: accessToken.id
            }
        });


        refreshTokenObject.accessToken = newAccessToken
        refreshTokenObject.refreshToken = newAccessToken;
        refreshTokenObject.message = null
        return refreshTokenObject

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError || jwt.JsonWebTokenError) {
            refreshTokenObject.message = 'Invalid Token ' + error.message
            return refreshTokenObject;
        } else {
            console.error(error)
        }
    }
}

export const loginService = async (email, password) => {

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email,
                status: UserStatus.ACTIVE
            }
        });

        const userObject = {
            user: null,
            access_token: null,
            refresh_token: null,
            message: null
        }

        if (!user) {
            userObject.message = 'Incorrect email or password'
            return userObject;
        }

        const isPasswordValid = await revealPassword(user.password, password);

        if (!isPasswordValid) {
            userObject.message = 'Incorrect email or password'
            return userObject;
        }
        const secret = process.env.JWT_KEY
        const accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION
        const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION

        const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: accessTokenExpiration })
        const refreshToken = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: refreshTokenExpiration })
        insertRefreshToken(refreshToken, user.id);

        userObject.user = user
        userObject.access_token = token
        userObject.refresh_token = refreshToken
        userObject.message = null

        return userObject;
    } catch (error) {
        console.error(error)
    }
}

export const logoutService = async (accessToken, userId, expirationTime) => {

    try {
        const logoutObject = {
            message: null
        }

        if (!accessToken) {
            logoutObject.message = 'Access token not found'
            return logoutObject
        }
        if (!userId) {
            logoutObject.message = 'User id not found'
            return logoutObject
        }

        const insertToInvalidTokens = await prisma.invalidTokens.create({
            data: {
                user_id: userId,
                access_token: accessToken,
                expirationTime: String(expirationTime)
            }
        });

        return insertToInvalidTokens;

    } catch (error) {
        console.error(error)
    }
}


//Sign up
export const userSignUp = async (email, password, firstName, middleName, lastName, gender, birthdate) => {
    const role_id = 2;
    try {
        const signUpObject = {
            result: null,
            message: null
        }
        const passwordHash = await hashPassword(password);

        const { otp } = await generateOtp()

        if (!otp) {
            signUpObject.message = 'Something went wrong'
            return signUpObject
        }

        const user = await prisma.users.create({
            data: {
                email: email,
                password: passwordHash,
                role_id: role_id,
                user_information: {
                    create: {
                        first_name: firstName,
                        middle_name: middleName,
                        last_name: lastName,
                        gender: gender,
                        birthdate: birthdate
                    }
                },
                otp: {
                    create: {
                        otp_secret: otp
                    }
                }
            },
            include: {
                user_information: true
            }
        })

        await sendEmail(user.email, 'OTP', otp)

        signUpObject.message = null
        signUpObject.result = user

        return signUpObject;
    } catch (error) {
        console.error(error);
    }
}

export const resendOtpService = async (userId, email, oldOtp) => {

    try {

        const otpObject = {
            result: null,
            message: null
        }
        if (!userId) {
            otpObject.message = 'Something went wrong'
            return otpObject
        }

        const { otp } = await generateOtp()

        if (!otp) {
            otpObject.message = 'Something went wrong'
            return otpObject
        }


        const getOtp = await prisma.otp.findFirst({
            where: {
                user_id: Number(userId)
            }
        })


        const result = await prisma.otp.upsert({
            where: {
                otp_secret: String(oldOtp)
            },
            update: {
                otp_secret: otp
            },
            create: {
                otp_secret: otp,
                user_id: userId
            }
        })

        await sendEmail(email, 'OTP', otp)

        otpObject.message = null
        otpObject.result = result
        return otpObject

    } catch (error) {
        console.error(error);

    }
}

export const otpService = async (userId, otp) => {

    try {
        const otpObject = {
            result: null,
            message: null
        }
        const result = await prisma.otp.findFirst({
            where: {
                user_id: userId,
                otp_secret: String(otp)
            }
        })

        if (!result) {
            otpObject.message = 'Invalid otps'
            return otpObject
        }

        // const otpUtil = verifyOtp(otp, result.otp_secret)
        // console.log(otpUtil);

        // if (!otpUtil) {
        //     otpObject.message = 'Invalid otp'
        //     return otpObject
        // }


        const user = await prisma.users.update({
            where: {
                id: userId,
                status: UserStatus.PENDING
            },
            data: {
                status: UserStatus.ACTIVE
            }
        })

        await prisma.otp.delete({
            where: {
                id: result.id
            }
        })

        otpObject.message = null
        otpObject.result = user
        return otpObject


    } catch (error) {
        console.error(error);

    }
}