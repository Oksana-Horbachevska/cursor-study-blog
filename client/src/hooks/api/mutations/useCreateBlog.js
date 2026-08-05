import { useAppContext } from '../../../context/AppContext'
import { useApiMutation } from '../../core'
import { MESSAGES } from '../../../constants/messages'
import { API_ENDPOINTS } from '../../../constants/apiEndpoints'

export function useCreateBlog() {
  const { axios } = useAppContext()
  const { mutate, loading, error } = useApiMutation()

  const createBlog = async (blogData, imageFile) => {
    if (!imageFile || typeof imageFile === 'boolean') {
      return {
        success: false,
        message: 'Invalid image file'
      }
    }

    const formData = new FormData()
    formData.append('blog', JSON.stringify(blogData))
    formData.append('image', imageFile)

    return mutate(
      () => axios.post(API_ENDPOINTS.BLOG_CREATE, formData),
      {
        successMessage: MESSAGES.SUCCESS_BLOG_CREATED,
        errorMessage: MESSAGES.ERROR_CREATE_BLOG
      }
    )
  }

  return {
    createBlog,
    isCreating: loading,
    inProgress: loading,
    error
  }
}
