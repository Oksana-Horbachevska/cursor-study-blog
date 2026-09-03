let currentContextValue = {
  axios: {
    get: () => Promise.resolve(),
    post: () => Promise.resolve(),
    put: () => Promise.resolve(),
    delete: () => Promise.resolve()
  },
  navigate: () => {},
  token: null,
  setToken: () => {},
  blogs: [],
  setBlogs: () => {},
  input: '',
  setInput: () => {},
  fetchBlogs: () => {}
}

function createFns(vi) {
  return {
    axios: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    },
    navigate: vi.fn(),
    setToken: vi.fn(),
    setBlogs: vi.fn(),
    setInput: vi.fn(),
    fetchBlogs: vi.fn()
  }
}

export function getMockAppContext() {
  return currentContextValue
}

export function setMockAppContext(partial = {}, viApi) {
  const vi = viApi || globalThis.vi
  const fns = createFns(vi)
  currentContextValue = {
    token: null,
    blogs: [],
    input: '',
    ...fns,
    ...partial,
    axios: {
      ...fns.axios,
      ...(partial.axios || {})
    },
    navigate: partial.navigate ?? fns.navigate,
    setToken: partial.setToken ?? fns.setToken,
    setBlogs: partial.setBlogs ?? fns.setBlogs,
    setInput: partial.setInput ?? fns.setInput,
    fetchBlogs: partial.fetchBlogs ?? fns.fetchBlogs
  }
  return currentContextValue
}

export function resetMockAppContext(viApi) {
  return setMockAppContext({}, viApi)
}
