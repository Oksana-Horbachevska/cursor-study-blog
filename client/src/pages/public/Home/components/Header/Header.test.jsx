import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import Header from './Header'

describe('Header', () => {
  it('renders tagline and search', () => {
    renderWithProviders(<Header />, {
      contextValue: { input: '', setInput: vi.fn() }
    })
    expect(screen.getByText(/ai feature/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/search for blogs/i)).toBeInTheDocument()
  })

  it('writes search value to context', async () => {
    const setInput = vi.fn()
    const { user } = renderWithProviders(<Header />, {
      contextValue: { input: '', setInput }
    })

    await user.type(screen.getByPlaceholderText(/search for blogs/i), 'react')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(setInput).toHaveBeenCalledWith('react')
  })

  it('clears search when clear is clicked', async () => {
    const setInput = vi.fn()
    const { user } = renderWithProviders(<Header />, {
      contextValue: { input: 'react', setInput }
    })

    await user.click(screen.getByRole('button', { name: /clear search/i }))
    expect(setInput).toHaveBeenCalledWith('')
  })
})
