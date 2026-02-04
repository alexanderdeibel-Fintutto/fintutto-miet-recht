/**
 * Password validation utility following NIST guidelines
 * Requires minimum 8 characters with complexity requirements
 */

interface PasswordValidationResult {
  valid: boolean
  message?: string
}

export function validatePassword(password: string): PasswordValidationResult {
  if (password.length < 8) {
    return { valid: false, message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Das Passwort muss mindestens einen Kleinbuchstaben enthalten.' }
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Das Passwort muss mindestens einen Großbuchstaben enthalten.' }
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Das Passwort muss mindestens eine Zahl enthalten.' }
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password)) {
    return { valid: false, message: 'Das Passwort muss mindestens ein Sonderzeichen enthalten (!@#$%^&* etc.).' }
  }
  
  return { valid: true }
}

/**
 * Check if password meets all requirements and return all failed requirements
 */
export function getPasswordRequirements(password: string) {
  return {
    minLength: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password),
  }
}
