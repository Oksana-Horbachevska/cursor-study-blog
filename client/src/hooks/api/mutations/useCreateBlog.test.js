import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { setMockAppContext } from '@/test/mockAppContext'
import { useCreateBlog } from './useCreateBlog'

describe('useCreateBlog', () => {
  const post = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    setMockAppContext({
      axios: { post, get: vi.fn(), put: vi.fn(), delete: vi.fn() }
    }, vi)
  })

  it('rejects missing or boolean image without calling API', async () => {
    const { result } = renderHook(() => useCreateBlog())

    let response
    await act(async () => {
      response = await result.current.createBlog({ title: 'T' }, null)
    })
    expect(response).toEqual({ success: false, message: 'Invalid image file' })
    expect(post).not.toHaveBeenCalled()

    await act(async () => {
      response = await result.current.createBlog({ title: 'T' }, true)
    })
    expect(response.success).toBe(false)
    expect(post).not.toHaveBeenCalled()
  })

  it('posts FormData with blog JSON and image', async () => {
    post.mockResolvedValue({
      data: { success: true, message: 'Created' }
    })
    const file = new File(['x'], 'pic.png', { type: 'image/png' })
    const { result } = renderHook(() => useCreateBlog())

    let response
    await act(async () => {
      response = await result.current.createBlog(
        { title: 'Hello', category: 'Startup' },
        file
      )
    })

    expect(response.success).toBe(true)
    expect(post).toHaveBeenCalledTimes(1)
    expect(post.mock.calls[0][0]).toBe('/api/blog/add')
    expect(post.mock.calls[0][1]).toBeInstanceOf(FormData)
  })
})
