import { describe, it, expect, vi } from 'vitest'
import toast from 'react-hot-toast'
import { renderWithProviders, screen, waitFor } from '@/test/test-utils'
import NewsletterForm from './NewsletterForm'

describe('NewsletterForm', () => {
  it('rejects invalid email', async () => {
    const { user } = renderWithProviders(<NewsletterForm />)

    await user.type(screen.getByPlaceholderText(/email/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    expect(toast.error).toHaveBeenCalled()
  })

  it('succeeds with a valid email after delay', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const { user } = renderWithProviders(<NewsletterForm />)

    await user.type(screen.getByPlaceholderText(/email/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    await vi.advanceTimersByTimeAsync(1100)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled()
    })
    expect(screen.getByPlaceholderText(/email/i)).toHaveValue('')
    vi.useRealTimers()
  })
})
