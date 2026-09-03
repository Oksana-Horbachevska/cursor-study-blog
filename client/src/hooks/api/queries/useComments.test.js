import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useComments } from './useComments'

vi.mock('../../../api', () => ({
  commentApi: {
    getByBlogId: vi.fn(),
    add: vi.fn()
  }
}))

import { commentApi } from '../../../api'

describe('useComments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('skips fetch without blogId', async () => {
    const { result } = renderHook(() => useComments(undefined))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(commentApi.getByBlogId).not.toHaveBeenCalled()
  })

  it('loads comments on success', async () => {
    commentApi.getByBlogId.mockResolvedValue({
      data: { success: true, comments: [{ _id: 'c1', content: 'Hi' }] }
    })

    const { result } = renderHook(() => useComments('blog-1'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.comments).toHaveLength(1)
  })

  it('addComment refetches on success', async () => {
    commentApi.getByBlogId
      .mockResolvedValueOnce({ data: { success: true, comments: [] } })
      .mockResolvedValueOnce({
        data: { success: true, comments: [{ _id: 'c1' }] }
      })
    commentApi.add.mockResolvedValue({
      data: { success: true, message: 'Added' }
    })

    const { result } = renderHook(() => useComments('blog-1'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    let response
    await act(async () => {
      response = await result.current.addComment({
        name: 'A',
        content: 'Hello!',
        blogId: 'blog-1'
      })
    })

    expect(response.success).toBe(true)
    expect(toast.success).toHaveBeenCalled()
    await waitFor(() => expect(result.current.comments).toHaveLength(1))
  })

  it('joins array server errors on add failure', async () => {
    commentApi.getByBlogId.mockResolvedValue({
      data: { success: true, comments: [] }
    })
    commentApi.add.mockRejectedValue({
      response: { data: { errors: ['Too short', 'Bad name'] } }
    })

    const { result } = renderHook(() => useComments('blog-1'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    let response
    await act(async () => {
      response = await result.current.addComment({ name: 'A', content: 'x' })
    })

    expect(response.success).toBe(false)
    expect(response.message).toBe('Too short. Bad name')
    expect(toast.error).toHaveBeenCalledWith('Too short. Bad name')
  })
})
