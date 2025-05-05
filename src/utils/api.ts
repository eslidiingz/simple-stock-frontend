import { ofetch } from 'ofetch'

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
  async onResponseError({ request, response, error }) {
    console.error('API Error:', {
      url: request,
      status: response?.status,
      message: error?.message,
    })

    if (response?.status === 401) {
      const router = useRouter()
      // const accessToken = useCookie('accessToken')
      // accessToken.value = null

      // Remove "accessToken" from cookie
      useCookie('accessToken').value = null

      // Remove "userData" from cookie
      useCookie('userData').value = null

      // Remove "userAbilities" from cookie
      useCookie('userAbilityRules').value = null

      // Redirect to login page
      window.location.href = '/login'
      
      // router.replace('/login')
    }
  },
})
