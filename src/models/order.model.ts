import type { Product } from './product.model'

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

  details: OrderDetail[]
}

export interface OrderDetail {
  id: string
  order_id: string
  product_id: string
  category_id: string
  code: string
  name: string
  description: string
  price: number
  quantity: number
  total: number
  created_at: Date
  updated_at: Date
  deleted_at: Date

  product: Product
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PACKED = 'PACKED',
  DELIVERY = 'DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCEL = 'CANCEL',
  RETURNED = 'RETURNED',
  COMPLETED = 'COMPLETED',
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

export const FindOneOrder = async (_id: string) => {
  try {
    return await $api(`${BASE_API}/orders/${_id}`)
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}

export const UpdateOrder = async (_id: string, data: any) => {
  try {
    return await $api(`${BASE_API}/orders/${_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}

export const DeleteOrder = async (_id: string) => {
  try {
    return await $api(`${BASE_API}/orders/${_id}`, {
      method: 'DELETE',
    })
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}

export const resolveOrderStatus = (status: string) => {
  if (status === OrderStatus.PENDING)
    return { text: 'Pending', color: 'warning' }
  if (status === OrderStatus.PROCESSING)
    return { text: 'Processing', color: 'info' }
  if (status === OrderStatus.PACKED)
    return { text: 'Packed', color: 'info' }
  if (status === OrderStatus.DELIVERY)
    return { text: 'Delivery', color: 'info' }
  if (status === OrderStatus.DELIVERED)
    return { text: 'Delivered', color: 'success' }
  if (status === OrderStatus.CANCEL)
    return { text: 'Cancel', color: 'error' }
  if (status === OrderStatus.RETURNED)
    return { text: 'Returned', color: 'error' }
  if (status === OrderStatus.COMPLETED)
    return { text: 'Completed', color: 'success' }
}

export const resolveOrderPaymentStatus = (status: string) => {
  if (status === OrderPaymentStatus.PAID)
    return { text: 'Paid', color: 'success' }
  if (status === OrderPaymentStatus.UNPAID)
    return { text: 'Unpaid', color: 'secondary' }
  if (status === OrderPaymentStatus.REFUNDED)
    return { text: 'Refunded', color: 'error' }
}
