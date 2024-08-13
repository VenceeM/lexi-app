import { PrismaClient } from '@prisma/client'
import { loginService } from '../auth/auth.js'

const prisma = new PrismaClient();


// Get users
export const getUsers = async () => {

    try {
        const users = await prisma.users.findMany({
            include: {
                role: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return users;
    } catch (error) {
        console.error(error)
    }
}

// Get user by id
export const getUserById = async (id) => {

    try {
        const result = await prisma.users.findUnique({
            where: {
                id: Number(id),
                deleted_at: null
            },
            select: {
                id: true,
                email: true,
                user_information: true
            }
        })
        return result;
    } catch (error) {
        console.error(error)
    }
}

// Get user by email
export const getUserByEmail = async (email) => {

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })

        return user;

    } catch (error) {
        console.error(error)
    }
}


// Insert user
export const insertUserInformationService = async ({ firstName, middleName, lastName, age, birthDate, userId }) => {
    try {
        const userInfo = await prisma.userInformations.create({
            data: {
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                age: age,
                birthdate: birthDate,
                user_id: userId
            }
        });
        return userInfo;
    } catch (error) {
        console.error(error)
    }
}

// get user info
export const getUserInfoService = async (id) => {

    try {


        const result = await prisma.userInformations.findUnique({
            where: {
                user_id: Number(id),
            },
            select: {
                user: true
            }
        });

        return result;

    } catch (error) {
        console.error(error)
    }
}

//Update user
export const updateUserService = async ({ id, email, firstName, middleName, lastName, age, birthDate }) => {

    try {
        const userObject = {
            result: null,
            message: null
        }
        if (!email || !id) {
            userObject.message = 'Unauthorized';
            return userObject;
        }

        const getOldInformation = await prisma.users.findUnique({
            where: {
                id: id,
                email: email
            },
            include: {
                user_information: true
            }
        })

        const result = await prisma.users.update({
            where: {
                id: id
            },
            data: {
                email: email,
                user_information: {
                    update: {
                        where: {
                            user_id: id
                        },
                        data: {
                            first_name: firstName ?? getOldInformation.user_information.first_name,
                            middle_name: middleName ?? getOldInformation.user_information.middle_name,
                            last_name: lastName ?? getOldInformation.user_information.last_name,
                            age: age ?? getOldInformation.user_information.age,
                            birthdate: birthDate ?? getOldInformation.user_information.birthdate
                        }
                    }
                }
            },
            include: {
                user_information: true
            }
        });

        userObject.message = null
        userObject.result = result
        return userObject
    } catch (error) {
        console.error(error)
    }
}

// Delete user
export const deleteAccountService = async (id) => {

    try {
        const userObject = {
            result: null,
            message: null
        }

        if (!id) {
            userObject.message = 'Unauthorized'
            return userObject
        }

        const result = await prisma.users.update({
            where: {
                id: id
            },
            data: {
                status: 'deleted',
                deleted_at: new Date()
            }
        })

        userObject.message = null
        userObject.result = result
        return userObject;

    } catch (error) {
        console.error(error)
    }
}