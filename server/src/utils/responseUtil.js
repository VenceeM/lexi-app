

export const responseUtil = (success, data, message = 'Request was successful.') => {
    return { success, data, message }
}