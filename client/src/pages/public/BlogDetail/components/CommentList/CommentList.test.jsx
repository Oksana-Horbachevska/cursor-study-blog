import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import CommentList from './CommentList'

describe('CommentList', () => {
  it('shows empty state when there are no comments', () => {
    renderWithProviders(<CommentList comments={[]} />)
    expect(screen.getByText(/no comments/i)).toBeInTheDocument()
  })

  it('renders comment name and content', () => {
    renderWithProviders(
      <CommentList
        comments={[
          {
            _id: '1',
            name: 'Alice',
            content: 'Great post!',
            createdAt: '2024-06-01T12:00:00.000Z'
          }
        ]}
      />
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Great post!')).toBeInTheDocument()
  })
})
