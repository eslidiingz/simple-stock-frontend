import { defineStore } from 'pinia'
import type { Product } from '@/models/product.model'

interface ProductImportItem extends Product {
  product_id: string
  quantity: number
}

export const useStockStore = defineStore('stock', {
  state: () => ({
    list: [] as ProductImportItem[],
  }),

  actions: {
    addToList(product: Product) {
      if (this.list.some((p: Product) => p.id === product.id)) {
        this.list = this.list.map((p: ProductImportItem) => {
          if (p.id === product.id)
            p.quantity += 1

          return p
        })
      }
      else {
        this.list.push({ ...product, product_id: product.id, quantity: 1 })
      }
    },

    removeFromList(product: ProductImportItem) {
      this.list = this.list.filter((p: ProductImportItem) => p.id !== product.id)
    },

    clear() {
      this.list = []
    },
  },
})
