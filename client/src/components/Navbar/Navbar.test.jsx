import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import { ROUTES } from '@/constants/routes'
import Navbar from './Navbar'

vi.mock('@/assets/assets', () => ({
  assets: { sprint: 'sprint.svg' }
}))

function buttonWithText(text) {
  return screen.getAllByRole('button').find((btn) => btn.textContent?.includes(text))
}

describe('Navbar', () => {
  it('shows Login when unauthenticated', () => {
    renderWithProviders(<Navbar />, {
      contextValue: { token: null }
    })
    expect(buttonWithText('Login')).toBeTruthy()
    expect(buttonWithText('Register')).toBeTruthy()
  })

  it('shows Dashboard when authenticated', () => {
    renderWithProviders(<Navbar />, {
      contextValue: { token: 'tok' }
    })
    expect(buttonWithText('Dashboard')).toBeTruthy()
    expect(buttonWithText('Register')).toBeFalsy()
  })

  it('navigates home from Home button', async () => {
    const navigate = vi.fn()
    const { user } = renderWithProviders(<Navbar />, {
      contextValue: { navigate, token: null }
    })

    await user.click(buttonWithText('Home'))
    expect(navigate).toHaveBeenCalledWith(ROUTES.HOME)
  })
})
