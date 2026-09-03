import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { setMockAppContext, resetMockAppContext, getMockAppContext } from './mockAppContext'
import '@/i18n'

/**
 * Render UI with MemoryRouter + Ant Design ConfigProvider.
 * Pass `contextValue` to override the mocked AppContext (see mockAppContext.js).
 */
export function renderWithProviders(
  ui,
  {
    route = '/',
    contextValue,
    ...renderOptions
  } = {}
) {
  if (contextValue) {
    setMockAppContext(contextValue, vi)
  } else {
    resetMockAppContext(vi)
  }

  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={[route]}>
      <ConfigProvider>{children}</ConfigProvider>
    </MemoryRouter>
  )

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}

export {
  setMockAppContext,
  resetMockAppContext,
  getMockAppContext
}

export * from '@testing-library/react'
export { userEvent }
