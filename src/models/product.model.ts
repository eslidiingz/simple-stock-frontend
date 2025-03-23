export interface Product {
  id?: string
  category_id: string
  code?: string
  name: string
  description?: string
  image?: string
  thumbnail?: string
  price?: number
  stock?: number
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date

  // category: category
  // StockMovement: stockmovement
}

export interface ProductCreate {
  name: string
  category_id: string
  description?: string
  code?: string
  price?: string | number
  image?: string | Blob
  is_active?: boolean
}

export interface ProductUpdate extends ProductCreate {}

export const CreateProduct = async (product: ProductCreate) => {
  try {
    return await $api(`${BASE_API}/products`, {
      method: 'POST',
      body: objectToFormData(product),
    })
  }
  catch (error) {
    return {
      success: false,
      error,
    }
  }
}

export const FindProduct = async (_id: string) => {
  try {
    return await $api(`${BASE_API}/products/${_id}`)
  }
  catch (error) {
    console.error(error)

    return { success: false, message: error.data }
  }
}

export const UpdateProduct = async (_productId: string, _product: ProductUpdate) => {
  try {
    return await $api(`${BASE_API}/products/${_productId}`, {
      method: 'PUT',
      body: objectToFormData(_product),
    })
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}

export const DeleteProduct = async (id: string) => {
  try {
    return await $api(`${BASE_API}/products/${id}`, {
      method: 'DELETE',
    })
  }
  catch (error) {
    return {
      success: false,
      message: error.data,
    }
  }
}

export const FindProductByCode = async (code: string) => {
  try {
    return await $api(`${BASE_API}/products/code/${code}`)
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}
