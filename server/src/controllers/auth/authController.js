import { loginService, logoutService, userSignUp, refreshTokenService } from '../../services/auth/auth.js'
import { responseUtil } from '../../utils/responseUtil.js'
import { auth } from '../../middleware/auth.js'
import { getUserByEmail } from '../../services/user/userService.js'
import { containsUpperCase, containsSymbols, } from '../../utils/characterUtils.js'
import { isPasswordStrong } from '../../utils/userValidation.js'

export const middleWare = async (req, res, next) => {
    const authorization = req.headers.authorization
    try {
        if (!authorization) {
            return res.status(401).json(responseUtil(false, null, 'Authorization token not found.'))
        }

        const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : authorization
        const { decodedToken, message } = await auth(accessToken)
        if (message) {
            return res.status(401).json(responseUtil(false, null, message))
        }


        req.accessToken = { value: accessToken, exp: decodedToken.exp }
        req.user = { id: decodedToken.id, email: decodedToken.email }

        next();

    } catch (error) {
        return res.status(500).json(responseUtil(false, null, error.message))
    }
}

export const refreshTokenContoller = async (req, res) => {

    const { refreshTokenBody } = req.body

    try {
        if (!refreshTokenBody) {
            return res.status(401).json(responseUtil(false, null, 'Authorization not found.'))
        }

        const { accessToken, refreshToken, message } = await refreshTokenService(refreshTokenBody)

        if (message) {
            return res.status(400).json(responseUtil(false, null, message))
        }

        const refreshTokenObject = {
            access_token: accessToken,
            refresh_token: refreshToken
        }

        return res.status(200).json(responseUtil(true, refreshTokenObject))

    } catch (error) {
        return res.status(500).json(responseUtil(false, null, error.message))
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;
    try {

        if (!email || !password) {
            return res.status(400).json(responseUtil(false, null, 'All fields are required.'));
        }
        const { user, access_token, refresh_token, message } = await loginService(email, password)

        if (message) {
            return res.status(400).json(responseUtil(false, null, message))
        }
        const loginData = {
            id: user.id,
            email: user.email,
            access_token: access_token,
            refresh_token: refresh_token
        }
        return res.status(200).json(responseUtil(true, loginData))

    } catch (error) {
        return res.status(500).json(responseUtil(false, null, error.message))
    }
}

export const logout = async (req, res) => {
    const accessToken = req.accessToken.value
    const userId = req.user.id
    const expirationTime = req.accessToken.exp
    try {
        if (!accessToken) {
            return res.status(400).json(responseUtil(false, null, 'Token not found.'));
        }

        const result = await logoutService(accessToken, userId, expirationTime)

        if (result.message) {
            return res.status(400).json(responseUtil(false, null, result.message));
        }

        return res.status(200).json(responseUtil(true, null))

    } catch (error) {
        return res.status(500).json(responseUtil(false, null, error.message))
    }
}

export const signUp = async (req, res) => {

    const { email, password } = req.body;
    try {

        if (!email || !password) {
            return res.status(400).json(responseUtil(false, null, 'All fields are required.'))
        }

        if (!email.includes('@')) {
            return res.status(400).json(responseUtil(false, null, 'Please enter a valid email'));
        }

        if (!isPasswordStrong(password)) {
            return res.status(400).json(responseUtil(false, null, 'Please provide a strong password with at least 1 uppercase letter and 1 symbol.'))
        }

        const userExist = await getUserByEmail(email)
        if (userExist) {
            return res.status(400).json(responseUtil(false, null, 'The email you provided is already registered.'))
        }

        const user = await userSignUp(email, password);
        return res.status(201).json(responseUtil(true, user))
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}