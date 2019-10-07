/* These validators will take in some text and return an object
 * describing whether it is valid, and if it is not valid, why. The
 * object has fields 'success' and 'reason'. If the entry is valid,
 * then return { success: true }. If the entry is invalid, then return
 * {success: false, reason: why-is-invalid}.
 */
export function validateEmail(email) {
    if (email === '') {
        return {success: false, reason: "No email entered!"};
    }
    return {success: true};
}

export function validatePassword(password) {
    if (password === '') {
        return {success: false, reason: "No password entered!"};
    }
    return {success: true};
}
