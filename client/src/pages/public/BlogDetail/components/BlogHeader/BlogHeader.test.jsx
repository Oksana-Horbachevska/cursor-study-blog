import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import BlogHeader from './BlogHeader'

describe('BlogHeader', () => {
  const blog = {
    title: 'Test Article',
    subTitle: 'A short subtitle',
    category: 'Startup',
    image: 'https://example.com/img.png'
  }

  it('renders title, subtitle, category and author', () => {
    renderWithProviders(<BlogHeader blog={blog} author="Jane Doe" />)
    expect(screen.getByRole('heading', { name: 'Test Article' })).toBeInTheDocument()
    expect(screen.getByText('A short subtitle')).toBeInTheDocument()
    expect(screen.getByText('Startup')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  it('omits subtitle when missing', () => {
    renderWithProviders(
      <BlogHeader blog={{ title: 'Only Title', category: 'Tech' }} />
    )
    expect(screen.getByRole('heading', { name: 'Only Title' })).toBeInTheDocument()
  })
})
