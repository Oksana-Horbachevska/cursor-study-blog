import { describe, it, expect, vi, beforeEach } from 'vitest'
import toast from 'react-hot-toast'
import { renderWithProviders, screen, waitFor } from '@/test/test-utils'
import Dashboard from './Dashboard'

vi.mock('@/hooks', () => ({
  useAdminDashboard: vi.fn()
}))

vi.mock('@/api', () => ({
  commentApi: {
    delete: vi.fn(),
    approve: vi.fn(),
    unapprove: vi.fn()
  }
}))

import { useAdminDashboard } from '@/hooks'
import { commentApi } from '@/api'

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading spinner while fetching', () => {
    useAdminDashboard.mockReturnValue({
      dashboardData: {},
      loading: true,
      refetch: vi.fn()
    })
    const { container } = renderWithProviders(<Dashboard />)
    expect(container.querySelector('.ant-spin')).toBeInTheDocument()
  })

  it('renders stats and approves a recent comment', async () => {
    const refetch = vi.fn()
    useAdminDashboard.mockReturnValue({
      loading: false,
      refetch,
      dashboardData: {
        blogs: 3,
        comments: 5,
        drafts: 1,
        recentBlogs: [
          {
            _id: 'b1',
            title: 'Latest Post',
            createdAt: '2024-01-01T00:00:00.000Z',
            isPublished: true,
            commentsCount: 2
          }
        ],
        recentComments: [
          {
            _id: 'c1',
            content: 'Pending comment',
            isApproved: false
          }
        ]
      }
    })
    commentApi.approve.mockResolvedValue({ data: { success: true } })

    const { user } = renderWithProviders(<Dashboard />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Latest Post')).toBeInTheDocument()
    expect(screen.getByText('Pending comment')).toBeInTheDocument()

    await user.click(document.querySelector('.admin-action-btn-approve'))

    await waitFor(() => {
      expect(commentApi.approve).toHaveBeenCalledWith('c1')
    })
    expect(toast.success).toHaveBeenCalled()
    expect(refetch).toHaveBeenCalled()
  })
})
