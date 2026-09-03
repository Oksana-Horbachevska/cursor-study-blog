import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders, screen, waitFor } from '@/test/test-utils'
import AddBlogForm from './AddBlogForm'

vi.mock('quill', () => {
  return {
    default: vi.fn().mockImplementation(function MockQuill(container) {
      this.root = document.createElement('div')
      this.root.innerHTML = ''
      this.root.classList.add('ql-editor')
      if (container) {
        container.appendChild(this.root)
      }
      this.on = vi.fn()
      this.enable = vi.fn()
      this.disable = vi.fn()
      this.getSemanticHTML = vi.fn(() => this.root.innerHTML || '')
      this.setText = vi.fn((text) => {
        this.root.innerHTML = text ? `<p>${text}</p>` : ''
      })
      this.clipboard = {
        dangerouslyPasteHTML: vi.fn((html) => {
          this.root.innerHTML = html
        })
      }
    })
  }
})

vi.mock('@/hooks', () => ({
  useBlogGenerator: vi.fn(),
  useCreateBlog: vi.fn()
}))

import { useBlogGenerator, useCreateBlog } from '@/hooks'

describe('AddBlogForm', () => {
  const createBlog = vi.fn()
  const generateContent = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useCreateBlog.mockReturnValue({ createBlog, isCreating: false })
    useBlogGenerator.mockReturnValue({ generateContent, isGenerating: false })
  })

  it('renders core fields', () => {
    renderWithProviders(<AddBlogForm />)
    expect(document.querySelector('input[name="title"]')).toBeInTheDocument()
    expect(document.querySelector('input[name="subTitle"]')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /publish article/i })).toBeInTheDocument()
  })

  it('validates required fields on publish attempt', async () => {
    const { user } = renderWithProviders(<AddBlogForm />)

    await user.click(screen.getByRole('button', { name: /publish article/i }))

    await waitFor(() => {
      expect(createBlog).not.toHaveBeenCalled()
    })
  })
})
