/* These validators will take in some text and return an object
 * describing whether it is valid, and if it is not valid, why. The
 * object has fields 'success' and 'reason'. If the entry is valid,
 * then return { success: true }. If the entry is invalid, then return
 * {success: false, reason: why-is-invalid}.
 *
 * All of these take text, the current value of some form input.
 */
export function validateEmail(email) {
    if (email === '') {
        return {success: false, reason: "Email field is empty"};
    }
    return {success: true};
}

export function validatePassword(password) {
    if (password === '') {
        return {success: false, reason: "Password field is empty"};
    }
    return {success: true};
}

export function validateTickerName(tickerName) {
    if (tickerName === '') {
        return {success: false, reason: "Ticker field is empty"};
    }
    return {success: true};
}

export function validatePositiveInteger(number) {
    if (number === '') {
        return {success: false, reason: "Number field is empty"};
    }
    let parsed = Number(number);
    if (isNaN(parsed)) {
        return {success: false, reason: "Invalid number entered"};
    }
    if (parsed <= 0) {
        return {success: false, reason: "Nonpositive number entered"};
    }
    if (!Number.isInteger(parsed)) {
        return {success: false, reason: "Decimal number entered"};
    }
    return {success: true};
}
