import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBlogs } from './useBlogs'

vi.mock('../../../api', () => ({
  blogApi: {
    getAll: vi.fn()
  }
}))

import { blogApi } from '../../../api'

describe('useBlogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps blogs from successful response', async () => {
    blogApi.getAll.mockResolvedValue({
      data: { success: true, blogs: [{ _id: '1' }] }
    })

    const { result } = renderHook(() => useBlogs())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.blogs).toEqual([{ _id: '1' }])
  })

  it('defaults to empty blogs array', async () => {
    blogApi.getAll.mockResolvedValue({
      data: { success: true }
    })

    const { result } = renderHook(() => useBlogs())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.blogs).toEqual([])
  })
})
