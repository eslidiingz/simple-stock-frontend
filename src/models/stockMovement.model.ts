import type { Product } from './product.model'

export interface StockMovement {
  id: string
  product_id: string
  quantity: number
  movement_type: MovementType
  reference: string
  created_at: Date

  product?: Product
}

export enum MovementType {
  STOCK_IN = 'stock_in',
  STOCK_OUT = 'stock_out',
}

export interface StockMovementCreate {
  product_id: string
  quantity: number
  reference?: string
}

export const CreateStockMovement = async (stockMovements: StockMovementCreate[]) => {
  try {
    return await $api(`${BASE_API}/stock-movements`, {
      method: 'POST',
      body: JSON.stringify({
        stockMovements,
      }),
    })
  }
  catch (error) {
    return {
      success: false,
      error,
    }
  }
}

export const ImportStockMovement = async (movementList: StockMovementCreate[]) => {
  try {
    return await $api(`${BASE_API}/stock-movements/import`, {
      method: 'POST',
      body: JSON.stringify({
        movementList,
      }),
    })
  }
  catch (error) {
    return {
      success: false,
      error,
    }
  }
}
