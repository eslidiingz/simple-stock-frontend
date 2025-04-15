export interface PaymentType {
  id?: string
  name: string
  code: string
  is_active?: boolean
  is_protected?: boolean
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date

  // payment_methods PaymentMethod[]
}

export const GetPaymentTypes = async (_params?: any) => {
  try {
    return await $api(`${BASE_API}/payment-types${objectToQueryString(_params)}`)
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}

export const GetPaymentTypesActive = async (_params?: any) => {
  try {
    return await $api(`${BASE_API}/payment-types/active${objectToQueryString(_params)}`)
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}
