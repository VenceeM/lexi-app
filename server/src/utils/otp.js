import { totp, authenticator } from 'otplib'
import crypto from 'crypto'
// totp.options = { digits: 6, step: 60 }
authenticator.options = { digits: 6, step: 60 }

export const generateOtp = async () => {

    try {
        // const secret = authenticator.generateSecret()
        // return {
        //     otp: authenticator.generate(secret),
        //     secret: secret
        // }
        return {
            otp: crypto.randomInt(100000, 999999).toString()
        }
    } catch (error) {
        console.error(error);
    }
}

export const verifyOtp = (token, secret) => {
    try {
        const generatedKey = authenticator.generate(secret)
        console.log(generatedKey);
        console.log(secret);
        console.log(authenticator.check(token, secret));
        return authenticator.check(token, secret)
    } catch (error) {
        console.error(error);
    }
}