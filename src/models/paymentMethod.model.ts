import type { PaymentType } from './paymentType.model'

export interface PaymentMethod {
  id?: string
  user_id?: string
  fee: number
  is_active: boolean
  is_protected?: boolean
  is_default?: boolean
  note?: string | null
  payment_type_id: string
  created_at?: Date
  updated_at?: Date
  deleted_at?: null
  payment_type?: PaymentType
}

export const GetPaymentMethods = async (_params?: any) => {
  try {
    return await $api(`${BASE_API}/payment-methods${objectToQueryString(_params)}`)
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}
