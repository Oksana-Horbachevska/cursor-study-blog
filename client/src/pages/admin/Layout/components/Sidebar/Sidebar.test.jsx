import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import { ROUTES } from '@/constants/routes'
import Sidebar from './Sidebar'

describe('Sidebar', () => {
  it('renders admin navigation links', () => {
    renderWithProviders(<Sidebar />, { route: ROUTES.ADMIN_DASHBOARD })
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
    expect(screen.getAllByText(/add article|add blog/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/all articles|articles/i)).toBeInTheDocument()
    expect(screen.getByText(/comments/i)).toBeInTheDocument()
  })

  it('navigates to add blog from footer button', async () => {
    const navigate = vi.fn()
    const { user } = renderWithProviders(<Sidebar />, {
      route: ROUTES.ADMIN_DASHBOARD,
      contextValue: { navigate }
    })

    const buttons = screen.getAllByRole('button', { name: /add article|add blog/i })
    await user.click(buttons[buttons.length - 1])
    expect(navigate).toHaveBeenCalledWith(ROUTES.ADMIN_ADD_BLOG)
  })
})
