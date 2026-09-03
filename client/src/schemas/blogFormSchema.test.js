import { describe, it, expect } from 'vitest'
import { createBlogFormSchema } from './blogFormSchema'
import { UPLOAD } from '@/constants/ui'

const t = (key) => key
const schema = createBlogFormSchema(t)

const validBase = {
  title: 'My Title',
  subTitle: 'A subtitle',
  category: 'Startup',
  description: '<p>Real content</p>'
}

function makeFile({ type = 'image/png', sizeMb = 1, name = 'pic.png' } = {}) {
  const size = Math.floor(sizeMb * 1024 * 1024)
  const buffer = new ArrayBuffer(size)
  return new File([buffer], name, { type })
}

describe('createBlogFormSchema', () => {
  it('accepts valid blog data with image file', () => {
    const result = schema.safeParse({
      ...validBase,
      image: makeFile()
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty title and subtitle after trim', () => {
    expect(
      schema.safeParse({
        ...validBase,
        title: '  ',
        image: makeFile()
      }).success
    ).toBe(false)

    expect(
      schema.safeParse({
        ...validBase,
        subTitle: '',
        image: makeFile()
      }).success
    ).toBe(false)
  })

  it('rejects empty Quill HTML variants', () => {
    for (const description of ['', '<p><br></p>', '<p></p>', '  <p><br></p>  ']) {
      expect(
        schema.safeParse({
          ...validBase,
          description,
          image: makeFile()
        }).success
      ).toBe(false)
    }
  })

  it('rejects missing or non-File image', () => {
    expect(
      schema.safeParse({
        ...validBase,
        image: null
      }).success
    ).toBe(false)

    expect(
      schema.safeParse({
        ...validBase,
        image: true
      }).success
    ).toBe(false)
  })

  it('rejects non-image MIME type', () => {
    const result = schema.safeParse({
      ...validBase,
      image: makeFile({ type: 'application/pdf', name: 'doc.pdf' })
    })
    expect(result.success).toBe(false)
  })

  it('rejects image at or above max size', () => {
    const result = schema.safeParse({
      ...validBase,
      image: makeFile({ sizeMb: UPLOAD.MAX_SIZE_MB })
    })
    // refine uses `< MAX_SIZE_MB`, so exactly MAX_SIZE_MB fails
    expect(result.success).toBe(false)
  })

  it('accepts image just under max size', () => {
    const result = schema.safeParse({
      ...validBase,
      image: makeFile({ sizeMb: UPLOAD.MAX_SIZE_MB - 0.1 })
    })
    expect(result.success).toBe(true)
  })
})
