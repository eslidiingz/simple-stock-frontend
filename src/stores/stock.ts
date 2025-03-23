import { defineStore } from 'pinia'
import type { Product } from '@/models/product.model'

export const useStockStore = defineStore('stock', {
  state: () => ({
    list: [],
  }),

  actions: {
    addToList(product: Product) {
      if (this.list.some((p: Product) => p.id === product.id)) {
        this.list = this.list.map((p: Product) => {
          if (p.id === product.id)
            p.quantity += 1

          return p
        })
      }
      else {
        this.list.push({ ...product, product_id: product.id, quantity: 1 })
      }
    },

    removeFromList(product: Product) {
      this.list = this.list.filter((p: Product) => p.id !== product.id)
    },

    clear() {
      this.list = []
    },
  },
})
