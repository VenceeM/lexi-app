import { getUsers, getUserById, userSignUp, getUserByEmail } from '../../services/user/userService.js'
import { responseUtil } from '../../utils/responseUtil.js'
import { containsUpperCase, containsSymbols, } from '../../utils/characterUtils.js'
import { isPasswordStrong } from '../../utils/userValidation.js'

export const getUsersController = async (req, res) => {

    try {
        const users = await getUsers()
        return res.status(200).json(responseUtil(true, users));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserByIdController = async (req, res) => {
    const { id } = req.params;
    try {

        const user = await getUserById(id)

        return res.status(200).json(responseUtil(true, user))

    } catch (error) {
        return res.status(500).json({ message: error.message })
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

