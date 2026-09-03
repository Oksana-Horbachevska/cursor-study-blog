import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import { ROUTES } from '@/constants/routes'
import Footer from './Footer'

vi.mock('@/assets/assets', () => ({
  assets: { sprint: 'sprint.svg' }
}))

describe('Footer', () => {
  it('renders brand and quick links', () => {
    renderWithProviders(<Footer />)
    expect(screen.getAllByText('StudySprint').length).toBeGreaterThan(0)
    expect(screen.getByText(/quick links/i)).toBeInTheDocument()
  })

  it('navigates home when All Articles is clicked', async () => {
    const navigate = vi.fn()
    const { user } = renderWithProviders(<Footer />, {
      contextValue: { navigate }
    })

    await user.click(screen.getByText(/all articles/i))
    expect(navigate).toHaveBeenCalledWith(ROUTES.HOME)
  })
})
