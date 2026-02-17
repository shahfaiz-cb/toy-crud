export function isValidEmail (value: string): boolean | string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || "Please enter a valid email address";
}

export function isValidPassword (value: string) {
    if(value.length < 8) return "Password must contains atleast 8 characters"
    if(value.length >= 30) return "Password cannot be more than 30 characters"
    if(!/[A-Z]/.test(value)) return "Password must contain one upper case character"
    if(!/[a-z]/.test(value)) return "Password must contain one lower case character"
    if(!/[0-9]/.test(value)) return "Password must contain one digit"
    if(!/[^A-Za-z0-9]/.test(value)) return "Password must contain a special character"
    return true
}