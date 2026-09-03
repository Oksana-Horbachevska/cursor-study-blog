import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '@/test/test-utils'
import CommentForm from './CommentForm'

describe('CommentForm', () => {
  it('shows validation errors for empty submit', async () => {
    const onSubmit = vi.fn()
    const { user } = renderWithProviders(<CommentForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/please enter your name/i)).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits values and resets on success', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ success: true })
    const { user } = renderWithProviders(<CommentForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText(/your name/i), 'Alice')
    await user.type(screen.getByPlaceholderText(/your comment/i), 'This is a solid comment')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Alice',
        content: 'This is a solid comment'
      })
    })

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/your name/i)).toHaveValue('')
    })
  })
})
