import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import SocialShare from './SocialShare'

describe('SocialShare', () => {
  it('renders share title and social buttons', () => {
    renderWithProviders(<SocialShare />)
    expect(screen.getByText(/share this article/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Facebook' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Twitter' })).toBeInTheDocument()
  })
})
