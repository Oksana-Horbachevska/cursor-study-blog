import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import Loader from './Loader'

describe('Loader', () => {
  it('renders a loading spinner', () => {
    const { container } = renderWithProviders(<Loader />)
    expect(container.querySelector('.ant-spin')).toBeInTheDocument()
  })
})
