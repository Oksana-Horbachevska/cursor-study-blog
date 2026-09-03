import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useApiRequest } from './useApiRequest'

describe('useApiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('executes success path with toast and onSuccess', async () => {
    const onSuccess = vi.fn()
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'OK' }
    })
    const { result } = renderHook(() => useApiRequest())

    let response
    await act(async () => {
      response = await result.current.execute(apiCall, {
        successMessage: 'Saved',
        onSuccess
      })
    })

    expect(response.success).toBe(true)
    expect(toast.success).toHaveBeenCalledWith('Saved')
    expect(onSuccess).toHaveBeenCalled()
    expect(result.current.inProgress).toBe(false)
  })

  it('handles soft failure', async () => {
    const onError = vi.fn()
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Nope' }
    })
    const { result } = renderHook(() => useApiRequest())

    let response
    await act(async () => {
      response = await result.current.execute(apiCall, { onError })
    })

    expect(response).toEqual({ success: false, message: 'Nope' })
    expect(result.current.error).toBe('Nope')
    expect(onError).toHaveBeenCalledWith('Nope')
  })

  it('handles network throw', async () => {
    const apiCall = vi.fn().mockRejectedValue({
      response: { data: { message: 'Down' } }
    })
    const { result } = renderHook(() => useApiRequest())

    let response
    await act(async () => {
      response = await result.current.execute(apiCall)
    })

    expect(response.message).toBe('Down')
    expect(toast.error).toHaveBeenCalledWith('Down')
  })

  it('reset clears state', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Err' }
    })
    const { result } = renderHook(() => useApiRequest())

    await act(async () => {
      await result.current.execute(apiCall)
    })

    act(() => {
      result.current.reset()
    })
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })
})
