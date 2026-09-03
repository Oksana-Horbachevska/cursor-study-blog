import { describe, it, expect, vi } from 'vitest'
import toast from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom'
import { renderWithProviders, screen } from '@/test/test-utils'
import { ROUTES } from '@/constants/routes'
import Layout from './Layout'

vi.mock('@/assets/assets', () => ({
  assets: { sprint: 'sprint.svg' }
}))

describe('Layout', () => {
  it('renders logout and clears auth on logout', async () => {
    localStorage.setItem('token', 'jwt')
    const setToken = vi.fn()
    const navigate = vi.fn()

    const { user } = renderWithProviders(
      <Routes>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<div>Outlet child</div>} />
        </Route>
      </Routes>,
      {
        route: '/admin',
        contextValue: { setToken, navigate }
      }
    )

    expect(screen.getByText('Outlet child')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /log out/i }))

    expect(localStorage.getItem('token')).toBeNull()
    expect(setToken).toHaveBeenCalledWith(null)
    expect(navigate).toHaveBeenCalledWith(ROUTES.HOME)
    expect(toast.success).toHaveBeenCalled()
  })
})
