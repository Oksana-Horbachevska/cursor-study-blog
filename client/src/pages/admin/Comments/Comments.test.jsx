import { describe, it, expect, vi, beforeEach } from 'vitest'
import toast from 'react-hot-toast'
import { renderWithProviders, screen, waitFor } from '@/test/test-utils'
import Comments from './Comments'

vi.mock('@/hooks', () => ({
  useAdminComments: vi.fn()
}))

vi.mock('@/api', () => ({
  commentApi: {
    delete: vi.fn(),
    approve: vi.fn(),
    unapprove: vi.fn()
  }
}))

import { useAdminComments } from '@/hooks'
import { commentApi } from '@/api'

describe('Comments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading spinner while fetching', () => {
    useAdminComments.mockReturnValue({ comments: [], loading: true, refetch: vi.fn() })
    const { container } = renderWithProviders(<Comments />)
    expect(container.querySelector('.ant-spin')).toBeInTheDocument()
  })

  it('approves a pending comment', async () => {
    const refetch = vi.fn()
    useAdminComments.mockReturnValue({
      loading: false,
      refetch,
      comments: [
        {
          _id: 'c1',
          content: 'Nice article',
          name: 'Ada',
          isApproved: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          blog: { title: 'Post A' }
        }
      ]
    })
    commentApi.approve.mockResolvedValue({ data: { success: true } })

    const { user } = renderWithProviders(<Comments />)
    expect(screen.getByText('Nice article')).toBeInTheDocument()

    await user.click(document.querySelector('.admin-action-btn-approve'))

    await waitFor(() => {
      expect(commentApi.approve).toHaveBeenCalledWith('c1')
    })
    expect(toast.success).toHaveBeenCalled()
    expect(refetch).toHaveBeenCalled()
  })

  it('deletes a comment', async () => {
    const refetch = vi.fn()
    useAdminComments.mockReturnValue({
      loading: false,
      refetch,
      comments: [
        {
          _id: 'c2',
          content: 'Remove me',
          name: 'Bob',
          isApproved: true,
          createdAt: '2024-01-02T00:00:00.000Z',
          blog: { title: 'Post B' }
        }
      ]
    })
    commentApi.delete.mockResolvedValue({ data: { success: true } })

    const { user } = renderWithProviders(<Comments />)
    await user.click(document.querySelector('.admin-action-btn-delete'))

    await waitFor(() => {
      expect(commentApi.delete).toHaveBeenCalledWith('c2')
    })
    expect(refetch).toHaveBeenCalled()
  })
})
