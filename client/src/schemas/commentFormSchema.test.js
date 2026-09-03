import { describe, it, expect } from 'vitest'
import { createCommentFormSchema } from './commentFormSchema'
import { COMMENT } from '@/constants/ui'

const t = (key, params) => (params ? `${key}:${JSON.stringify(params)}` : key)
const schema = createCommentFormSchema(t)

describe('createCommentFormSchema', () => {
  it('accepts valid name and content', () => {
    const result = schema.safeParse({
      name: 'Alice',
      content: 'Hello there'
    })
    expect(result.success).toBe(true)
  })

  it('trims whitespace', () => {
    const result = schema.safeParse({
      name: '  Bob  ',
      content: '  Valid comment text  '
    })
    expect(result.success).toBe(true)
    expect(result.data.name).toBe('Bob')
    expect(result.data.content).toBe('Valid comment text')
  })

  it('rejects empty name', () => {
    const result = schema.safeParse({ name: '  ', content: 'Valid comment' })
    expect(result.success).toBe(false)
  })

  it('rejects name shorter than 2 chars', () => {
    const result = schema.safeParse({ name: 'A', content: 'Valid comment' })
    expect(result.success).toBe(false)
  })

  it('rejects content below min length', () => {
    const result = schema.safeParse({
      name: 'Alice',
      content: 'x'.repeat(COMMENT.MIN_LENGTH - 1)
    })
    expect(result.success).toBe(false)
  })

  it('rejects content above max length', () => {
    const result = schema.safeParse({
      name: 'Alice',
      content: 'x'.repeat(COMMENT.MAX_LENGTH + 1)
    })
    expect(result.success).toBe(false)
  })

  it('accepts content at min and max boundaries', () => {
    expect(
      schema.safeParse({
        name: 'Al',
        content: 'x'.repeat(COMMENT.MIN_LENGTH)
      }).success
    ).toBe(true)

    expect(
      schema.safeParse({
        name: 'Al',
        content: 'x'.repeat(COMMENT.MAX_LENGTH)
      }).success
    ).toBe(true)
  })
})
