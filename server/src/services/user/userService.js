import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../../utils/passwordUtils.js'

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
                id: Number(id)
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



//Sign up
export const userSignUp = async (email, password, role_id = 2) => {

    try {
        const passwordHash = await hashPassword(password);
        const user = prisma.users.create({
            data: {
                email: email,
                password: passwordHash,
                role_id: role_id
            }
        })
        return user;
    } catch (error) {
        console.error(error);
    }
}

// Insert user
export const insertUserInformation = async (first_name, middle_name, last_name, age, birthdate, user_id) => {
    try {
        const userInfo = await prisma.userInformations.create({
            data: {
                first_name: first_name,
                middle_name: middle_name,
                last_name: last_name,
                age: age,
                birthdate: birthdate,
                user_id: user_id
            }
        });
        return userInfo;
    } catch (error) {
        console.error(error)
    }
}