interface Login {
  username: string
  password: string
}

interface Register extends Login {
  email: string
}

const BASE_API = 'http://localhost:8000/api'

export const signUp = async (credentials: Register) => {
  const uri = `${BASE_API}/auth/sign-up`
  try {
    return await $api(uri, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  catch (error: any) {
    console.error(error.data.message)

    return { success: false, message: error.data.message }
  }
}

export const signIn = async (credentials: Login) => {
  const uri = `${BASE_API}/auth/sign-in`
  try {
    const res = await $api(uri, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    const userAbilityRules = [
      {
        action: 'manage',
        subject: 'all',
      },
    ]

    const userData = {
      ...res.data,
      fullname: 'John Doe',
      avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      role: 'admin',
    }

    return {
      success: true,
      userAbilityRules,
      accessToken: res.access_token,
      userData,
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  catch (error: any) {
    console.error(error.data.message)

    return { success: false, message: error.data.message }
  }
}
