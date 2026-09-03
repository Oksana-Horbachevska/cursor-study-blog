import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatRelativeTime,
  truncateText,
  stripHtmlTags,
  truncateHtml
} from './formatters'

describe('formatDate', () => {
  it('formats a date as Month Day Year', () => {
    expect(formatDate('2024-01-15')).toMatch(/January/)
    expect(formatDate('2024-01-15')).toMatch(/2024/)
  })
})

describe('formatRelativeTime', () => {
  it('returns a relative time string', () => {
    const result = formatRelativeTime(new Date())
    expect(result).toMatch(/ago|in a few seconds|a few seconds ago|moments ago|just now/i)
  })
})

describe('truncateText', () => {
  it('returns empty string for falsy input', () => {
    expect(truncateText('')).toBe('')
    expect(truncateText(null)).toBe('')
    expect(truncateText(undefined)).toBe('')
  })

  it('returns text unchanged when within length', () => {
    expect(truncateText('short', 80)).toBe('short')
    expect(truncateText('exactly10', 10)).toBe('exactly10')
  })

  it('truncates and appends ellipsis when over length', () => {
    expect(truncateText('abcdefghij', 5)).toBe('abcde...')
  })
})

describe('stripHtmlTags', () => {
  it('returns empty for falsy html', () => {
    expect(stripHtmlTags('')).toBe('')
    expect(stripHtmlTags(null)).toBe('')
  })

  it('removes tags including nested', () => {
    expect(stripHtmlTags('<p>Hello <strong>world</strong></p>')).toBe('Hello world')
  })
})

describe('truncateHtml', () => {
  it('strips tags then truncates', () => {
    expect(truncateHtml('<p>abcdefghij</p>', 5)).toBe('abcde...')
  })
})
