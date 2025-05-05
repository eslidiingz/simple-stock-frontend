import { createFetch } from '@vueuse/core'
import { destr } from 'destr'

export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
  options: {
    refetch: true,
    async beforeFetch({ options }) {
      const accessToken = useCookie('accessToken').value

      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,

        }
      }

      return { options }
    },
    afterFetch(ctx) {
      const { data, response } = ctx
      // Parse data if it's JSON

      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
        console.error(error)
      }

      return { data: parsedData, response }
    },

    onFetchError({ data, response, error }) {
      if ( response?.status === 401 ) {
        console.error('Unauthorized. Redirect to login.')

        // Remove "accessToken" from cookie
        useCookie('accessToken').value = null

        // Remove "userData" from cookie
        useCookie('userData').value = null

        // Remove "userAbilities" from cookie
        useCookie('userAbilityRules').value = null

        // Redirect to login page
        window.location.href = '/login'
      }
      return { data, response, error }
    },
  },
})
