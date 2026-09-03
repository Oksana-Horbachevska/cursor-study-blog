import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import toast from 'react-hot-toast'
import { setMockAppContext } from '@/test/mockAppContext'
import { useBlogGenerator } from './useBlogGenerator'

vi.mock('marked', () => ({
  parse: vi.fn((md) => `<p>${md}</p>`)
}))

import { parse } from 'marked'

describe('useBlogGenerator', () => {
  const post = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    setMockAppContext({
      axios: { post, get: vi.fn(), put: vi.fn(), delete: vi.fn() }
    }, vi)
  })

  it('rejects empty prompt without calling API', async () => {
    const { result } = renderHook(() => useBlogGenerator())

    let response
    await act(async () => {
      response = await result.current.generateContent('   ')
    })

    expect(response).toEqual({ success: false, message: 'Title required' })
    expect(toast.error).toHaveBeenCalled()
    expect(post).not.toHaveBeenCalled()
  })

  it('returns parsed HTML on success', async () => {
    post.mockResolvedValue({
      data: { success: true, content: '## Hello' }
    })
    parse.mockReturnValue('<h2>Hello</h2>')

    const { result } = renderHook(() => useBlogGenerator())

    let response
    await act(async () => {
      response = await result.current.generateContent('Write about AI')
    })

    expect(response).toEqual({ success: true, content: '<h2>Hello</h2>' })
    expect(parse).toHaveBeenCalledWith('## Hello')
  })

  it('passthrough failed mutate result', async () => {
    post.mockResolvedValue({
      data: { success: false, message: 'Fail' }
    })

    const { result } = renderHook(() => useBlogGenerator())

    let response
    await act(async () => {
      response = await result.current.generateContent('Prompt')
    })

    expect(response.success).toBe(false)
  })
})
