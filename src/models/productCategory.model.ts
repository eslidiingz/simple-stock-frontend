export interface ProductCategory {
  id?: string
  name: string
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date

  _count?: {
    products?: number
  }
}

export const GetAllCategories = async () => {
  try {
    return await $api(`${BASE_API}/product-categories/all`)
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}

export const GetProductCategories = async (_params?: any) => {
  try {
    return await $api(`${BASE_API}/product-categories${objectToQueryString(_params)}`)
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}

export const CreateProductCategory = async ({ name }: { name: string }) => {
  try {
    return await $api(`${BASE_API}/product-categories`, {
      method: 'POST',
      body: JSON.stringify({
        name,
      }),
    })
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}

export const UpdateProductCategory = async ({ id, name, is_active }: ProductCategory) => {
  try {
    return await $api(`${BASE_API}/product-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        is_active,
      }),
    })
  }
  catch (error) {
    return {
      success: false,
      message: error,
    }
  }
}

export const DeleteProductCategory = async (id: string) => {
  try {
    return await $api(`${BASE_API}/product-categories/${id}`, {
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

export const AddCategoryToCompany = async (category_id: string) => {
  try {
    return await $api(`${BASE_API}/product-categories/add-to-company`, {
      method: 'POST',
      body: JSON.stringify({
        category_id,
      }),
    })
  }
  catch (error) {
    return error.data
  }
}
