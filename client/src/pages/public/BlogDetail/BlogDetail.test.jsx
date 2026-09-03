import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Routes, Route } from 'react-router-dom'
import { renderWithProviders, screen } from '@/test/test-utils'
import BlogDetail from './BlogDetail'

vi.mock('@/assets/assets', () => ({
  assets: { sprint: 'sprint.svg' }
}))

vi.mock('@/hooks', () => ({
  useBlog: vi.fn(),
  useComments: vi.fn()
}))

import { useBlog, useComments } from '@/hooks'

function renderBlogDetail(path = '/blog/b1') {
  return renderWithProviders(
    <Routes>
      <Route path="/blog/:id" element={<BlogDetail />} />
    </Routes>,
    { route: path }
  )
}

describe('BlogDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useComments.mockReturnValue({
      comments: [],
      addComment: vi.fn()
    })
  })

  it('shows loader while blog is loading', () => {
    useBlog.mockReturnValue({ blog: null, loading: true })
    const { container } = renderBlogDetail()
    expect(container.querySelector('.ant-spin')).toBeInTheDocument()
  })

  it('renders blog content and comments section when loaded', () => {
    useBlog.mockReturnValue({
      loading: false,
      blog: {
        _id: 'b1',
        title: 'Loaded Article',
        subTitle: 'Subtitle',
        category: 'Startup',
        description: '<p>Body copy</p>',
        image: ''
      }
    })
    useComments.mockReturnValue({
      comments: [{ _id: 'c1', name: 'Ada', content: 'Hi there!', createdAt: '2024-01-01' }],
      addComment: vi.fn()
    })

    renderBlogDetail()

    expect(screen.getByRole('heading', { name: 'Loaded Article' })).toBeInTheDocument()
    expect(screen.getByText('Body copy')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
  })
})
