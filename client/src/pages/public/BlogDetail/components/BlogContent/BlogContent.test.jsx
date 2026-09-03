import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import BlogContent from './BlogContent'

describe('BlogContent', () => {
  it('renders sanitized HTML text content', () => {
    renderWithProviders(
      <BlogContent content="<p>Hello <strong>world</strong></p><script>alert(1)</script>" />
    )
    expect(screen.getByText(/Hello/)).toBeInTheDocument()
    expect(screen.getByText(/world/)).toBeInTheDocument()
    expect(document.querySelector('script')).not.toBeInTheDocument()
  })
})
