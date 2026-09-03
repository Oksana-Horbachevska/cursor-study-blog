import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  classNames,
  debounce,
  scrollToTop,
  getErrorMessage,
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage
} from './helpers'

describe('classNames', () => {
  it('joins truthy class names', () => {
    expect(classNames('a', false, 'b', null, undefined, 'c')).toBe('a b c')
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('delays invocation and keeps only the last call', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 200)

    debounced('a')
    debounced('b')
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('b')
  })
})

describe('scrollToTop', () => {
  it('calls window.scrollTo with top 0', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    scrollToTop()
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    scrollToTop('auto')
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
    scrollTo.mockRestore()
  })
})

describe('getErrorMessage', () => {
  it('prefers response data message', () => {
    expect(
      getErrorMessage({ response: { data: { message: 'Server says no' } }, message: 'fallback' })
    ).toBe('Server says no')
  })

  it('falls back to error.message', () => {
    expect(getErrorMessage({ message: 'Network' })).toBe('Network')
  })

  it('falls back to generic message', () => {
    expect(getErrorMessage({})).toBe('Something went wrong')
  })
})

describe('localStorage helpers', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore?.()
  })

  it('saves and reads JSON values', () => {
    expect(saveToLocalStorage('key', { a: 1 })).toBe(true)
    expect(getFromLocalStorage('key')).toEqual({ a: 1 })
  })

  it('returns default when key missing', () => {
    expect(getFromLocalStorage('missing', 'default')).toBe('default')
  })

  it('returns default on invalid JSON', () => {
    localStorage.setItem('bad', '{not-json')
    expect(getFromLocalStorage('bad', 'fallback')).toBe('fallback')
  })

  it('removes a key', () => {
    saveToLocalStorage('x', 1)
    expect(removeFromLocalStorage('x')).toBe(true)
    expect(getFromLocalStorage('x')).toBeNull()
  })

  it('returns false when setItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(saveToLocalStorage('k', 'v')).toBe(false)
    spy.mockRestore()
  })
})
