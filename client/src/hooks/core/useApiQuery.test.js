import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useApiQuery } from './useApiQuery'

describe('useApiQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches on mount when enabled', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: true, blogs: [1] }
    })
    const onSuccess = vi.fn()

    const { result } = renderHook(() =>
      useApiQuery(apiCall, { onSuccess })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual({ success: true, blogs: [1] })
    expect(onSuccess).toHaveBeenCalledWith({ success: true, blogs: [1] })
  })

  it('skips fetch when enabled is false', async () => {
    const apiCall = vi.fn()
    const { result } = renderHook(() =>
      useApiQuery(apiCall, { enabled: false })
    )

    expect(result.current.loading).toBe(false)
    expect(apiCall).not.toHaveBeenCalled()
  })

  it('handles soft failure (success: false)', async () => {
    const apiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Nope' }
    })
    const onError = vi.fn()

    const { result } = renderHook(() =>
      useApiQuery(apiCall, { onError })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Nope')
    expect(toast.error).toHaveBeenCalledWith('Nope')
    expect(onError).toHaveBeenCalledWith('Nope')
  })

  it('handles thrown errors and can suppress toast', async () => {
    const apiCall = vi.fn().mockRejectedValue({
      response: { data: { message: 'Boom' } }
    })

    const { result } = renderHook(() =>
      useApiQuery(apiCall, { showErrorToast: false })
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Boom')
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('refetch re-runs the api call', async () => {
    const apiCall = vi
      .fn()
      .mockResolvedValueOnce({ data: { success: true, n: 1 } })
      .mockResolvedValueOnce({ data: { success: true, n: 2 } })

    const { result } = renderHook(() => useApiQuery(apiCall))
    await waitFor(() => expect(result.current.data?.n).toBe(1))

    await act(async () => {
      await result.current.refetch()
    })

    expect(result.current.data?.n).toBe(2)
    expect(apiCall).toHaveBeenCalledTimes(2)
  })

  it('sets loading false when apiCall is falsy', async () => {
    const { result } = renderHook(() => useApiQuery(null))
    await waitFor(() => expect(result.current.loading).toBe(false))
  })
})
