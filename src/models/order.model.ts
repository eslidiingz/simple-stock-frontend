export interface Order {
  id: string
  code: string
  company_id: string
  customer_id?: string
  product_count: number
  product_count_items: number
  sub_total: number
  discount: number
  shipping: number
  grand_total: number
  receiver_name: string
  receiver_phone: string
  shipping_address: string
  note?: string
  tracking_code?: string
  shipping_provider?: string
  shipped_at?: Date
  delivered_at?: Date
  payment_method_id?: string
  payment_code: string
  payment_status: OrderPaymentStatus
  status: OrderStatus
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PACKED = 'PACKED',
  DELIVERY = 'DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCEL = 'CANCEL',
  RETURNED = 'RETURNED',
}

export enum OrderPaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

interface OrderItem {
  id: string
  category_id: string
  code: string
  name: string
  description: string
  price: number
  quantity: number
}

interface CustomerOrder {
  receiver: string
  phone: string
}

interface PaymentMethodOrder {
  fee: number
  payment_type: {
    code: string
  }
}

export interface SaleOrderCreate {
  items: OrderItem[]
  paymentMethod: PaymentMethodOrder
  customer: CustomerOrder
  shippingAddress: string
  note?: string
}

export const CreateSaleOrder = async (saleOrder: SaleOrderCreate) => {
  try {
    return await $api(`${BASE_API}/orders`, {
      method: 'POST',
      body: JSON.stringify(saleOrder),
    })
  }
  catch (error) {
    return {
      success: false,
      error,
    }
  }
}

export const GetOrders = async (_params?: any) => {
  try {
    return await $api(`${BASE_API}/orders${objectToQueryString(_params)}`)
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}
