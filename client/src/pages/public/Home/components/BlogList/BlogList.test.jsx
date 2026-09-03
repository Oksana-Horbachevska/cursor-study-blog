import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import BlogList from './BlogList'

describe('BlogList', () => {
  it('shows empty state when there are no blogs', () => {
    renderWithProviders(<BlogList />, {
      contextValue: { blogs: [], input: '' }
    })
    expect(screen.getByText(/no blogs|no articles|empty/i)).toBeInTheDocument()
  })

  it('renders blog titles and filters by search input', () => {
    renderWithProviders(<BlogList />, {
      contextValue: {
        input: 'React',
        blogs: [
          {
            _id: '1',
            title: 'React Tips',
            category: 'Technology',
            description: '<p>Hello</p>',
            image: 'a.png'
          },
          {
            _id: '2',
            title: 'Cooking Pasta',
            category: 'Lifestyle',
            description: '<p>Food</p>',
            image: 'b.png'
          }
        ]
      }
    })

    expect(screen.getByText('React Tips')).toBeInTheDocument()
    expect(screen.queryByText('Cooking Pasta')).not.toBeInTheDocument()
  })
})
