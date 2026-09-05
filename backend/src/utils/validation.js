/**
 * Utility functions for validating request data types and number formats.
 * Differentiates between integers and float numbers decimals.
 */

/**
 * Validates if the value is a valid integer.
 * Accepts pure numbers or clean integer numeric strings.
 * Rejects floats, booleans, objects, arrays, null, undefined, NaN, Infinity, empty strings, and non-numeric strings.
 *
 * @param {any} value
 * @returns {boolean}
 */
function isInteger(value) {
  if (value === null || value === undefined) return false
  if (typeof value === 'boolean') return false

  if (typeof value === 'number') {
    return Number.isInteger(value)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') return false
    // Only optional sign followed by digits
    if (!/^-?\d+$/.test(trimmed)) return false
    const num = Number(trimmed)
    return Number.isSafeInteger(num)
  }

  return false
}

/**
 * Validates if the value is a valid float / decimal number (or integer as a valid real number).
 * Accepts pure numbers or clean float numeric strings.
 * Rejects booleans, objects, arrays, null, undefined, NaN, Infinity, empty strings, and non-numeric strings.
 *
 * @param {any} value
 * @param {object} [options]
 * @param {number} [options.maxDecimalPlaces] - Maximum allowed decimal places (e.g. 2 for currency)
 * @returns {boolean}
 */
function isFloat(value, { maxDecimalPlaces } = {}) {
  if (value === null || value === undefined) return false
  if (typeof value === 'boolean') return false

  let num
  let str

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return false
    num = value
    str = value.toString()
  } else if (typeof value === 'string') {
    str = value.trim()
    if (str === '') return false
    // Match optional sign, digits, optional decimal point with digits
    if (!/^-?\d+(\.\d+)?$/.test(str)) return false
    num = Number(str)
    if (!Number.isFinite(num)) return false
  } else {
    return false
  }

  // Check decimal places constraint if specified
  if (maxDecimalPlaces !== undefined) {
    const parts = str.split('.')
    if (parts.length === 2 && parts[1].length > maxDecimalPlaces) {
      return false
    }
  }

  return true
}

/**
 * Validates if the value is a positive integer (full number > 0).
 *
 * @param {any} value
 * @returns {boolean}
 */
function isPositiveInteger(value) {
  if (!isInteger(value)) return false
  return Number(value) > 0
}

/**
 * Validates if the value is a non-negative integer (full number >= 0).
 *
 * @param {any} value
 * @returns {boolean}
 */
function isNonNegativeInteger(value) {
  if (!isInteger(value)) return false
  return Number(value) >= 0
}

/**
 * Validates if the value is a non-negative float (decimal number >= 0).
 *
 * @param {any} value
 * @param {object} [options]
 * @param {number} [options.maxDecimalPlaces=2]
 * @returns {boolean}
 */
function isNonNegativeFloat(value, { maxDecimalPlaces = 2 } = {}) {
  if (!isFloat(value, { maxDecimalPlaces })) return false
  return Number(value) >= 0
}

/**
 * Validates if the value is a non-empty string.
 *
 * @param {any} value
 * @returns {boolean}
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

module.exports = {
  isInteger,
  isFloat,
  isPositiveInteger,
  isNonNegativeInteger,
  isNonNegativeFloat,
  isNonEmptyString
}
