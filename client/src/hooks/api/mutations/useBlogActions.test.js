import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { setMockAppContext } from '@/test/mockAppContext'
import { useBlogActions } from './useBlogActions'

describe('useBlogActions', () => {
  const post = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    setMockAppContext({
      axios: { post, get: vi.fn(), put: vi.fn(), delete: vi.fn() }
    }, vi)
  })

  it('cancels delete when confirm is declined', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const { result } = renderHook(() => useBlogActions())

    let response
    await act(async () => {
      response = await result.current.deleteBlog('b1')
    })

    expect(response).toEqual({ success: false, cancelled: true })
    expect(post).not.toHaveBeenCalled()
    expect(result.current.isDeleting).toBe(false)
  })

  it('deletes a blog after confirm', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    post.mockResolvedValue({ data: { success: true, message: 'Deleted' } })
    const { result } = renderHook(() => useBlogActions())

    let response
    await act(async () => {
      response = await result.current.deleteBlog('b1')
    })

    expect(response.success).toBe(true)
    expect(post).toHaveBeenCalledWith('/api/blog/delete', { id: 'b1' })
    expect(result.current.isDeleting).toBe(false)
  })

  it('publishes and unpublishes a blog', async () => {
    post.mockResolvedValue({ data: { success: true } })
    const { result } = renderHook(() => useBlogActions())

    await act(async () => {
      await result.current.publishBlog('b2')
    })
    expect(post).toHaveBeenCalledWith('/api/blog/publish', { id: 'b2' })

    await act(async () => {
      await result.current.unpublishBlog('b2')
    })
    expect(post).toHaveBeenCalledWith('/api/blog/unpublish', { id: 'b2' })
    expect(result.current.isPublishing).toBe(false)
    expect(result.current.inProgress).toBe(false)
  })
})
