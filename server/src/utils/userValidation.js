import { containsUpperCase, containsSymbols } from './characterUtils.js'

export const isPasswordStrong = (password) => {
    const passwordLength = password.length <= 6
    const containsBasicPassword = password == '12345678'
    return !passwordLength && !containsBasicPassword && containsUpperCase(password) && containsSymbols(password)
}

export const isValidEmail = (email) => email.includes('@');
