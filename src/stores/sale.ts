import type { PaymentMethod } from '@/models/paymentMethod.model'
import type { Product } from '@/models/product.model'
import { defineStore } from 'pinia'

interface SaleItem extends Product {
  quantity: number
}

interface Customer {
  receiver: string
  phone: string
}

interface SaleState {
  items: SaleItem[],
  paymentMethod: PaymentMethod,
  customer: Customer,
  shippingAddress: string,
  note: string,
}

export const useSaleStore = defineStore('sale', {
  state: (): SaleState => ({
    items: [] as SaleItem[],
    paymentMethod: {} as PaymentMethod,
    customer: {} as Customer,
    shippingAddress: '',
    note: '',
  }),
  getters: {},
  actions: {
    addToOrder(product: Product) {
      if (this.items.some((p: Product) => p.id === product.id)) {
        this.items = this.items.map((p: SaleItem) => {
          if (p.id === product.id)
            p.quantity += 1

          return p
        })
      }
      else {
        this.items.push({ ...product, quantity: 1 })
      }
    },

    removeItem(product: Product) {
      this.items = this.items.filter((p: SaleItem) => p.id !== product.id)
    },
  },
})
