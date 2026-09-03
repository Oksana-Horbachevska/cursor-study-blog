import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useApiMutation } from './useApiMutation'

describe('useApiMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns cancelled when confirm is declined', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const apiCall = vi.fn()
    const { result } = renderHook(() => useApiMutation())

    let response
    await act(async () => {
      response = await result.current.mutate(apiCall, {
        confirmMessage: 'Sure?'
      })
    })

    expect(response).toEqual({ success: false, cancelled: true })
    expect(apiCall).not.toHaveBeenCalled()
  })

  it('succeeds and toasts on success', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const onSuccess = vi.fn()
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'Done', id: 1 }
    })
    const { result } = renderHook(() => useApiMutation())

    let response
    await act(async () => {
      response = await result.current.mutate(apiCall, {
        confirmMessage: 'Go?',
        successMessage: 'Created',
        onSuccess
      })
    })

    expect(response.success).toBe(true)
    expect(toast.success).toHaveBeenCalledWith('Created')
    expect(onSuccess).toHaveBeenCalled()
    expect(result.current.loading).toBe(false)
  })

  it('handles soft failure', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Rejected' }
    })
    const { result } = renderHook(() => useApiMutation())

    let response
    await act(async () => {
      response = await result.current.mutate(apiCall)
    })

    expect(response).toEqual({ success: false, message: 'Rejected' })
    expect(result.current.error).toBe('Rejected')
    expect(toast.error).toHaveBeenCalledWith('Rejected')
  })

  it('handles thrown errors and respects toast suppression', async () => {
    const apiCall = vi.fn().mockRejectedValue(new Error('Network'))
    const { result } = renderHook(() => useApiMutation({ showToast: false }))

    let response
    await act(async () => {
      response = await result.current.mutate(apiCall)
    })

    expect(response.success).toBe(false)
    expect(response.message).toBe('Network')
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('reset clears error and loading', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Err' }
    })
    const { result } = renderHook(() => useApiMutation())

    await act(async () => {
      await result.current.mutate(apiCall)
    })
    expect(result.current.error).toBe('Err')

    act(() => {
      result.current.reset()
    })
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })
})
