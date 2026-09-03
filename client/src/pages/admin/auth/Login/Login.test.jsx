import { describe, it, expect, vi, beforeEach } from 'vitest'
import toast from 'react-hot-toast'
import { renderWithProviders, screen, waitFor } from '@/test/test-utils'
import Login from './Login'

vi.mock('@/assets/assets', () => ({
  assets: { sprint: 'sprint.svg' }
}))

vi.mock('@/api', () => ({
  adminApi: {
    login: vi.fn()
  }
}))

import { adminApi } from '@/api'

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits credentials and stores token on success', async () => {
    const setToken = vi.fn()
    adminApi.login.mockResolvedValue({
      data: { success: true, token: 'jwt-token' }
    })

    const { user } = renderWithProviders(<Login />, {
      contextValue: { setToken, navigate: vi.fn() }
    })

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com')
    await user.type(screen.getByLabelText(/password/i), 'secret123')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(adminApi.login).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'secret123'
      })
    })

    expect(setToken).toHaveBeenCalledWith('jwt-token')
    expect(localStorage.getItem('token')).toBe('jwt-token')
    expect(toast.success).toHaveBeenCalled()
  })

  it('toasts error when login fails', async () => {
    adminApi.login.mockResolvedValue({
      data: { success: false, message: 'Invalid credentials' }
    })

    const { user } = renderWithProviders(<Login />, {
      contextValue: { setToken: vi.fn(), navigate: vi.fn() }
    })

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })
})
