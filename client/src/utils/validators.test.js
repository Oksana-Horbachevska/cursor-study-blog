import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateUrl
} from './validators'

describe('validateEmail', () => {
  it.each([
    ['user@example.com', true],
    ['a@b.co', true],
    ['invalid', false],
    ['@missing.com', false],
    ['no-at.com', false],
    ['spaces @x.com', false],
    ['', false]
  ])('validateEmail(%j) → %s', (email, expected) => {
    expect(validateEmail(email)).toBe(expected)
  })
})

describe('validateRequired', () => {
  it.each([
    ['hello', true],
    ['  text  ', true],
    ['', false],
    ['   ', false],
    [null, false],
    [undefined, false]
  ])('validateRequired(%j) → %s', (value, expected) => {
    if (value !== null && value !== undefined && typeof value !== 'string') {
      return
    }
    if (value === null || value === undefined) {
      expect(validateRequired(value)).toBe(expected)
      return
    }
    expect(validateRequired(value)).toBe(expected)
  })

  it('throws when value is a non-string truthy type without trim', () => {
    expect(() => validateRequired(123)).toThrow()
  })
})

describe('validateMinLength', () => {
  it('returns true when length meets minimum', () => {
    expect(validateMinLength('hello', 5)).toBe(true)
    expect(validateMinLength('hello', 3)).toBe(true)
  })

  it('returns falsy when too short or empty', () => {
    expect(validateMinLength('hi', 5)).toBe(false)
    expect(validateMinLength('', 1)).toBeFalsy()
    expect(validateMinLength(null, 1)).toBeFalsy()
  })
})

describe('validateMaxLength', () => {
  it('returns true when within max', () => {
    expect(validateMaxLength('hi', 5)).toBe(true)
    expect(validateMaxLength('hello', 5)).toBe(true)
  })

  it('returns falsy when over max or empty', () => {
    expect(validateMaxLength('toolong', 3)).toBe(false)
    expect(validateMaxLength('', 5)).toBeFalsy()
  })
})

describe('validateUrl', () => {
  it.each([
    ['https://example.com', true],
    ['http://localhost:3000/path', true],
    ['not-a-url', false],
    ['', false]
  ])('validateUrl(%j) → %s', (url, expected) => {
    expect(validateUrl(url)).toBe(expected)
  })
})
