import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForm } from './useForm'

describe('useForm', () => {
  it('initializes with provided values', () => {
    const { result } = renderHook(() => useForm({ name: '', email: '' }))
    expect(result.current.values).toEqual({ name: '', email: '' })
    expect(result.current.errors).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('updates values and clears field error on change', () => {
    const { result } = renderHook(() => useForm({ name: '' }))

    act(() => {
      result.current.setFieldError('name', 'Required')
    })
    expect(result.current.errors.name).toBe('Required')

    act(() => {
      result.current.handleChange('name', 'Ada')
    })
    expect(result.current.values.name).toBe('Ada')
    expect(result.current.errors.name).toBeNull()
  })

  it('marks fields as touched on blur', () => {
    const { result } = renderHook(() => useForm({ name: '' }))
    act(() => {
      result.current.handleBlur('name')
    })
    expect(result.current.touched.name).toBe(true)
  })

  it('blocks submit when validation returns errors', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useForm({ name: '' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit, () => ({ name: 'Required' }))
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.errors.name).toBe('Required')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('calls onSubmit and clears isSubmitting', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useForm({ name: 'Ada' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit)
    })

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada' })
    expect(result.current.isSubmitting).toBe(false)
  })

  it('clears isSubmitting even when onSubmit throws', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('fail'))
    const { result } = renderHook(() => useForm({ name: 'Ada' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit)
    })

    expect(result.current.isSubmitting).toBe(false)
  })

  it('resets form to initial values', () => {
    const { result } = renderHook(() => useForm({ name: 'Ada' }))

    act(() => {
      result.current.handleChange('name', 'Bob')
      result.current.setFieldError('name', 'err')
      result.current.handleBlur('name')
    })

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.values).toEqual({ name: 'Ada' })
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })
})
