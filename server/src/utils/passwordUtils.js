import bcrypt from 'bcrypt'


export const hashPassword = async (password) => {
    const saltRound = 10;
    try {
        const salt = await bcrypt.genSalt(saltRound)
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword;
    } catch (error) {
        console.error(error)
    }
}

export const revealPassword = async (hashedPassword, password) => {
    try {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword)
        return isPasswordValid
    } catch (error) {
        console.error(error)
    }
}