import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { setMockAppContext } from '@/test/mockAppContext'
import { useCommentActions } from './useCommentActions'

describe('useCommentActions', () => {
  const post = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    setMockAppContext({
      axios: { post, get: vi.fn(), put: vi.fn(), delete: vi.fn() }
    }, vi)
  })

  it('approves a comment', async () => {
    post.mockResolvedValue({ data: { success: true } })
    const { result } = renderHook(() => useCommentActions())

    let response
    await act(async () => {
      response = await result.current.approveComment('c1')
    })

    expect(response.success).toBe(true)
    expect(post).toHaveBeenCalledWith('/api/admin/approve-comment', { id: 'c1' })
    expect(result.current.isApproving).toBe(false)
  })

  it('cancels delete when confirm is declined', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const { result } = renderHook(() => useCommentActions())

    let response
    await act(async () => {
      response = await result.current.deleteComment('c1')
    })

    expect(response).toEqual({ success: false, cancelled: true })
    expect(post).not.toHaveBeenCalled()
  })

  it('deletes a comment after confirm', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    post.mockResolvedValue({ data: { success: true } })
    const { result } = renderHook(() => useCommentActions())

    let response
    await act(async () => {
      response = await result.current.deleteComment('c2')
    })

    expect(response.success).toBe(true)
    expect(post).toHaveBeenCalledWith('/api/admin/delete-comment', { id: 'c2' })
    expect(result.current.isDeleting).toBe(false)
    expect(result.current.inProgress).toBe(false)
  })
})
