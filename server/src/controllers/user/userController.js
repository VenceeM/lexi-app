import { getUsers, getUserById, getUserByEmail, insertUserInformationService, getUserInfoService, updateUserService, deleteAccountService } from '../../services/user/userService.js'
import { responseUtil } from '../../utils/responseUtil.js'
import { containsUpperCase, containsSymbols, } from '../../utils/characterUtils.js'
import { isPasswordStrong } from '../../utils/userValidation.js'
import { logoutService } from '../../services/auth/auth.js'
export const getUsersController = async (req, res) => {

    try {
        const users = await getUsers()
        return res.status(200).json(responseUtil(true, users));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserByIdController = async (req, res) => {
    const { id } = req.user;
    try {

        const user = await getUserById(id)

        return res.status(200).json(responseUtil(true, user))

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getUserInformationController = async (req, res) => {

    const { id } = req.user
    return console.log(id);
    try {
        if (!id) {
            return res.status(400).json(responseUtil(false, null, 'No Data found.'))
        }

        const result = await getUserInfoService(id);

        return res.status(200).json(responseUtil(true, result))

    } catch (error) {
        return res.status(500).json(responseUtil(false, null, error.message))
    }
}

export const insertUserInformationController = async (req, res) => {

    const { first_name, middle_name, last_name, age, birth_date } = req.body
    const { id } = req.user
    try {
        if (!id) {
            return res.status(400).json(responseUtil(false, null, 'User id is missing'))
        }

        if (!first_name || !last_name || !age) {
            return res.status(400).json(responseUtil(false, null, 'User information is required'))
        }

        const userInfo = {
            firstName: first_name,
            middleName: middle_name,
            lastName: last_name,
            age: age,
            birthDate: birth_date,
            userId: id
        }

        const result = await insertUserInformationService(userInfo)

        return res.status(201).json(responseUtil(true, result));

    } catch (error) {
        return res.status(500).json(responseUtil(false, null, error.message))
    }
}

export const updateUserController = async (req, res) => {
    const { id, email } = req.user
    const { userId } = req.params
    const { first_name, middle_name, last_name, age, birth_date } = req.body
    try {

        if (!id || !email) {
            return res.status(400).json(responseUtil(false, null, 'Unauthorized'));
        }

        if (id != userId) {
            return res.status(401).json(responseUtil(false, null, 'Unauthorized'))
        }

        const userObject = {
            firstName: first_name,
            middleName: middle_name,
            lastName: last_name,
            age: age,
            birthDate: birth_date,
            email: email,
            id: id
        }

        const result = await updateUserService(userObject)
        delete result.result.password
        delete result.result.role_id
        delete result.result.deleted_at

        return res.status(200).json(responseUtil(true, result));

    } catch (error) {
        return res.status(500).json(responseUtil(false, null, error.message))
    }
}

export const deleteAccountController = async (req, res) => {

    const accessToken = req.headers.authorization
    const accessTokenExpiration = req.accessToken.exp
    const { id } = req.user;
    const { userId } = req.params
    try {

        if (!id || id != userId || !accessToken) {
            return res.status(401).json(responseUtil(false, null, 'Unauthorized'));
        }
        const token = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken
        if (!userId) {
            return res.status(401).json(responseUtil(false, null, 'User id not found'));
        }

        await deleteAccountService(id)

        await logoutService(token, id, accessTokenExpiration)

        return res.status(200).json(responseUtil(true, null, 'Acount has been deleted'))

    } catch (error) {
        return res.status(500).json(responseUtil(false, null, error.message))
    }
}