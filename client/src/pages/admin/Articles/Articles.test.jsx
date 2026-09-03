import { describe, it, expect, vi, beforeEach } from 'vitest'
import toast from 'react-hot-toast'
import { renderWithProviders, screen, waitFor } from '@/test/test-utils'
import Articles from './Articles'

vi.mock('@/hooks', () => ({
  useAdminBlogs: vi.fn()
}))

vi.mock('@/api', () => ({
  blogApi: {
    deleteBlog: vi.fn(),
    publish: vi.fn(),
    unpublish: vi.fn()
  }
}))

import { useAdminBlogs } from '@/hooks'
import { blogApi } from '@/api'

describe('Articles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading spinner while fetching', () => {
    useAdminBlogs.mockReturnValue({ blogs: [], loading: true, refetch: vi.fn() })
    const { container } = renderWithProviders(<Articles />)
    expect(container.querySelector('.ant-spin')).toBeInTheDocument()
  })

  it('renders blog rows and publishes a draft', async () => {
    const refetch = vi.fn()
    useAdminBlogs.mockReturnValue({
      loading: false,
      refetch,
      blogs: [
        {
          _id: 'b1',
          title: 'Draft Post',
          createdAt: '2024-01-01T00:00:00.000Z',
          isPublished: false
        }
      ]
    })
    blogApi.publish.mockResolvedValue({ data: { success: true } })

    const { user } = renderWithProviders(<Articles />)
    expect(screen.getByText('Draft Post')).toBeInTheDocument()

    const publishBtn = document.querySelector('.admin-action-btn-approve')
    expect(publishBtn).toBeTruthy()
    await user.click(publishBtn)

    await waitFor(() => {
      expect(blogApi.publish).toHaveBeenCalledWith('b1')
    })
    expect(toast.success).toHaveBeenCalled()
    expect(refetch).toHaveBeenCalled()
  })

  it('deletes a blog', async () => {
    const refetch = vi.fn()
    useAdminBlogs.mockReturnValue({
      loading: false,
      refetch,
      blogs: [
        {
          _id: 'b2',
          title: 'Delete Me',
          createdAt: '2024-01-01T00:00:00.000Z',
          isPublished: true
        }
      ]
    })
    blogApi.deleteBlog.mockResolvedValue({ data: { success: true } })

    const { user } = renderWithProviders(<Articles />)
    const deleteBtn = document.querySelector('.admin-action-btn-delete')
    await user.click(deleteBtn)

    await waitFor(() => {
      expect(blogApi.deleteBlog).toHaveBeenCalledWith('b2')
    })
    expect(refetch).toHaveBeenCalled()
  })
})
