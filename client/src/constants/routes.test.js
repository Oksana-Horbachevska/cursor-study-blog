import { describe, it, expect } from 'vitest'
import { ROUTES, getBlogDetailPath } from './routes'

describe('getBlogDetailPath', () => {
  it('builds the blog detail path from an id', () => {
    expect(getBlogDetailPath('abc123')).toBe('/blog/abc123')
  })
})

describe('ROUTES', () => {
  it('exposes expected path constants', () => {
    expect(ROUTES.HOME).toBe('/')
    expect(ROUTES.ADMIN).toBe('/admin')
    expect(ROUTES.ADMIN_ADD_BLOG).toBe('/admin/addBlog')
  })
})
