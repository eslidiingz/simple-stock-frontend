<script setup lang="ts">
import type { TableOptions } from '@/interfaces/misc.interface'
import { ModeType } from '@/interfaces/misc.interface'
import { CreateProductCategory, DeleteProductCategory, type ProductCategory, UpdateProductCategory } from '@/models/productCategory.model'

const headers = [
  { title: 'Categories', key: 'name', sortable: false },
  // { title: 'Products', key: '_count.products', sortable: false },
  { title: 'Status', key: 'is_active', sortable: false, align: 'center' },
  // { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const mode = ref<ModeType>(ModeType.CREATE)
const productSelected = ref<ProductCategory>()

const searchQuery = ref<string>('')
const searchQueryDelay = ref<string>('')

// Data table options
const itemsPerPage = ref<number>(10)
const page = ref<number>(1)
const sortBy = ref<string>()
const orderBy = ref<string>()

// Modal & Notify
const isToastVisible = ref<boolean>(false)
const toastText = ref<string>('')
const toastStatus = ref<string>('success')

const isAddProductModalOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isConfirmModalOpen = ref<boolean>(false)

// Update data table options
const updateOptions = (options: TableOptions) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const BASE_API = 'http://localhost:8000/api'

const { data: categoriesData, execute: fetchCategories } = await useApi<any>(createUrl(`${BASE_API}/product-categories`, {
  query: {
    name: searchQueryDelay,
    page,
    limit: itemsPerPage,
    sortBy,
    orderBy,
  },
}))

// isLoading.value = true

// setTimeout(() => {
//   isLoading.value = false
// }, 2000)

const categories = computed((): ProductCategory[] => categoriesData.value.data)
const totalItem = computed(() => categoriesData.value.pagination.total)

const onOpenModalCreateCategory = () => {
  mode.value = ModeType.CREATE
  productSelected.value = undefined
  isAddProductModalOpen.value = true
}

const handleFormCategorySubmitted = async (productCategory: ProductCategory): Promise<void> => {
  isLoading.value = true

  if (mode.value === ModeType.CREATE) {
    const { message } = await CreateProductCategory({ name: productCategory.name })

    toastText.value = message
  }

  else if (mode.value === ModeType.EDIT) {
    const { message } = await UpdateProductCategory(productCategory)

    toastText.value = message
  }

  await fetchCategories()
  isToastVisible.value = true
  isLoading.value = false
}

const onDelete = async (): Promise<void> => {
  if (productSelected.value?.id) {
    isLoading.value = true

    const categoryDeleted = await DeleteProductCategory(productSelected.value?.id)

    if (categoryDeleted.success) {
      await fetchCategories()
      toastText.value = categoryDeleted.message
    }
    else {
      toastText.value = categoryDeleted?.message?.data?.error
    }

    isConfirmModalOpen.value = false
    toastStatus.value = categoryDeleted.success ? 'success' : 'error'
    isToastVisible.value = true
  }

  isLoading.value = false
}

const onOpenConfirmDelete = async (product: ProductCategory): Promise<void> => {
  productSelected.value = product
  isConfirmModalOpen.value = true
}

const onEditProduct = (product: ProductCategory) => {
  productSelected.value = product
  mode.value = ModeType.EDIT
  isAddProductModalOpen.value = true
}

let timer: any = null

watch(searchQuery, newValue => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    searchQueryDelay.value = newValue
  }, 500) // 2 seconds delay
})
</script>

<template>
  <div>
    <!-- 👉 categories -->
    <VCard>
      <div class="d-flex flex-wrap gap-4 ma-6">
        <div class="d-flex align-center">
          <!-- 👉 Search  -->
          <!-- v-model="searchQuery" -->
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Category"
            style="max-inline-size: 280px; min-inline-size: 280px;"
            class="me-3"
          />
        </div>

        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
          <AppSelect
            v-model="itemsPerPage"
            :items="[5, 10, 20, 25, 50]"
          />

          <VBtn
            color="primary"
            prepend-icon="tabler-plus"
            @click="onOpenModalCreateCategory"
          >
            Add Category
          </VBtn>

          <CategoryForm
            v-model:isOpen="isAddProductModalOpen"
            :mode="mode"
            :title="mode === ModeType.EDIT ? 'Edit Category' : 'Create Category'"
            :item="productSelected"
            @update:submit="(productCategory: ProductCategory) => handleFormCategorySubmitted(productCategory)"
          />
        </div>
      </div>

      <VDivider class="mt-4" />

      <!-- 👉 Datatable  -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="categories"
        :items-length="totalItem"
        :loading="isLoading"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <template #item.name="{ item }">
          <div class="text-capitalize">
            {{ item.name }}
          </div>
        </template>

        <!-- Active -->
        <template #item.is_active="{ item }">
          <IsActiveLabel :is-active="item.is_active" />
        </template>

        <!-- Actions -->
        <!-- <template #item.actions="{ item }">
          <IconBtn @click="onEditProduct(item)">
            <VIcon icon="tabler-edit" />
          </IconBtn>
          <IconBtn
            :disabled="item._count.products"
            @click="onOpenConfirmDelete(item)"
          >
            <VIcon
              icon="tabler-trash"
              size="22"
            />
          </IconBtn>
        </template> -->

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalItem"
          />
        </template>
      </VDataTableServer>
    </VCard>
  </div>

  <ConfirmModal
    v-model:is-open="isConfirmModalOpen"
    @update:submit="onDelete"
  />

  <Toast
    v-model:visible="isToastVisible"
    :text="toastText"
    :status="toastStatus"
  />
</template>

<style lang="scss">
.category-table {
  border: 1px solid black;
}
</style>
