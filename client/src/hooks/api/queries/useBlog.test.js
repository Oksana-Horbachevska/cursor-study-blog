import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useBlog } from './useBlog'

vi.mock('../../../api', () => ({
  blogApi: {
    getById: vi.fn()
  }
}))

import { blogApi } from '../../../api'

describe('useBlog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not fetch without an id', async () => {
    const { result } = renderHook(() => useBlog(undefined))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(blogApi.getById).not.toHaveBeenCalled()
    expect(result.current.blog).toBeNull()
  })

  it('loads a blog on success', async () => {
    blogApi.getById.mockResolvedValue({
      data: { success: true, blog: { _id: '1', title: 'Hello' } }
    })

    const { result } = renderHook(() => useBlog('1'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.blog).toEqual({ _id: '1', title: 'Hello' })
  })

  it('toasts on soft failure', async () => {
    blogApi.getById.mockResolvedValue({
      data: { success: false, message: 'Missing' }
    })

    const { result } = renderHook(() => useBlog('1'))
    await waitFor(() => expect(result.current.error).toBe('Missing'))
    expect(toast.error).toHaveBeenCalled()
  })

  it('refetch no-ops without id', async () => {
    const { result } = renderHook(() => useBlog(null))
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.refetch()
    })
    expect(blogApi.getById).not.toHaveBeenCalled()
  })
})
