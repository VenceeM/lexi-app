
export const containsUpperCase = (text) => {
    return /[A-Z]/.test(text);
}

export const containsSymbols = (text) => {
    return /[!@#$%^&*(),.?":{}|<>]/.test(text);
}