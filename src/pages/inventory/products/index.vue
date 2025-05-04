<script setup lang="ts">
import IsActiveLabel from '@/components/IsActiveLabel.vue'
import type { TableOptions } from '@/interfaces/misc.interface'
import { DeleteProduct, type Product } from '@/models/product.model'
import type { ProductCategory } from '@/models/productCategory.model'
import { GetProductCategories } from '@/models/productCategory.model'
import { imageUrl } from '@/utils/image'
import { formatNumber } from '@/utils/number'

const headers = [
  { title: 'Product', key: 'product', sortable: false },
  { title: 'Category', key: 'category.name', sortable: false, align: 'center' },

  // { title: 'Stock', key: 'stock', sortable: false },
  // { title: 'SKU', key: 'sku' },
  { title: 'Price', key: 'price', sortable: false, align: 'end' },
  { title: 'Stock', key: 'stock', sortable: false, align: 'end' },

  // { title: 'QTY', key: 'qty' },
  { title: 'Status', key: 'is_active', sortable: false, align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
]

const productSelected = ref<Product>()

const searchQuery = ref<string>('')
const searchQueryDelay = ref<string>('')

// Data table options
const itemsPerPage = ref<number>(10)
const page = ref<number>(1)
const sortBy = ref<string>()
const orderBy = ref<string>()

const selectedCategory = ref<ProductCategory | undefined>()
const selectedStock = ref<boolean | undefined>()
const selectedStatus = ref<boolean | undefined>()

/** Filter options */
const status = ref([
  { title: 'Active', value: true },
  { title: 'Inactive', value: false },
])

const { data: categoriesData } = await GetProductCategories()
const categories = computed(() => categoriesData.map((category: ProductCategory) => ({ title: category.name[0].toLocaleUpperCase() + category.name.slice(1), value: category.id })))

const stockStatus = ref([
  { title: 'In Stock', value: true },
  { title: 'Out of Stock', value: false },
])

// Update data table options
const updateOptions = (options: TableOptions) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const { data: productsData, execute: fetchProducts } = await useApi<any>(createUrl(`${BASE_API}/products`,
  {
    query: {
      name: searchQueryDelay,
      category_id: selectedCategory,
      in_stock: selectedStock,
      is_active: selectedStatus,
      page,
      limit: itemsPerPage,
      sortBy,
      orderBy,
    },
  },
))

const products = computed((): Product[] => productsData.value.data)
const totalItem = computed(() => productsData.value.pagination.total)

// Modal & Notify
const snackBarText = ref<string>('')
const isFlatSnackbarVisible = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isConfirmModalOpen = ref<boolean>(false)

const onOpenConfirmDelete = async (product: Product): Promise<void> => {
  productSelected.value = product
  isConfirmModalOpen.value = true
}

const onDelete = async () => {
  if (productSelected.value?.id) {
    isLoading.value = true

    const productDeleted = await DeleteProduct(productSelected.value.id)

    if (productDeleted.success) {
      await fetchProducts()

      isConfirmModalOpen.value = false
      snackBarText.value = productDeleted.message
      isFlatSnackbarVisible.value = true
    }
  }

  isLoading.value = false
}

let timer: any = null

watch(searchQuery, newValue => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    searchQueryDelay.value = newValue
  }, 700) // 0.7 seconds delay
})
</script>

<template>
  <div>
    <!-- 👉 products -->
    <VCard>
      <div class="d-flex justify-space-between gap-4 ma-6">
        <div class="d-flex flex-fill align-center gap-4">
          <!-- 👉 Search  -->
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Product"
            style="inline-size: 220px;"
          />

          <!-- Category filter -->
          <AppSelect
            v-model="selectedCategory"
            placeholder="Category"
            :items="categories"
            clearable
            clear-icon="tabler-x"
            class="text-capitalize"
            style="text-transform: capitalize;"
          />

          <!-- Stock filter -->
          <AppSelect
            v-model="selectedStock"
            placeholder="Stock"
            :items="stockStatus"
            clearable
            clear-icon="tabler-x"
          />

          <!-- Status filter -->
          <AppSelect
            v-model="selectedStatus"
            placeholder="Status"
            :items="status"
            clearable
            clear-icon="tabler-x"
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
            @click="$router.push('/inventory/products/create')"
          >
            Add Product
          </VBtn>
        </div>
      </div>

      <VDivider class="mt-4" />

      <!-- 👉 Datatable  -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="products"
        :items-length="totalItem"
        :loading="isLoading"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- product  -->
        <template #item.product="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar
              v-if="item.thumbnail"
              size="38"
              variant="tonal"
              rounded
              :image="imageUrl(item.thumbnail)"
            />

            <div class="d-flex flex-column">
              <span class="text-body-1 font-weight-medium text-high-emphasis">{{ item.name }}</span>
              <div class="text-body-2">
                <span>{{ item.productBrand }}</span>
                <span class="text-caption">{{ item.code }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- category -->
        <template #item.category="{ item }">
          <VAvatar
            size="30"
            variant="tonal"
            :color="resolveCategory(item.category)?.color"
            class="me-4"
          >
            <VIcon
              :icon="resolveCategory(item.category)?.icon"
              size="18"
            />
          </VAvatar>
          <span class="text-body-1 text-high-emphasis">{{ item.category }}</span>
        </template>

        <!-- price -->
        <template #item.price="{ item }">
          {{ formatNumber(item.price) }}
        </template>

        <!-- status -->
        <template #item.is_active="{ item }">
          <IsActiveLabel :is-active="item.is_active" />
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn @click="$router.push(`/inventory/products/${item.id}`)">
            <VIcon icon="tabler-edit" />
          </IconBtn>

          <IconBtn @click="onOpenConfirmDelete(item)" :disabled="item.stock > 0">
            <VIcon
              icon="tabler-trash"
              size="22"
            />
          </IconBtn>
        </template>

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

  <VSnackbar
    v-model="isFlatSnackbarVisible"
    location="top end"
    variant="flat"
    color="success"
  >
    {{ snackBarText }}
  </VSnackbar>
</template>

<style lang="scss">
.v-table {
  .v-table__wrapper {
    table {
      .v-data-table__tbody {
        tr.v-data-table__tr {
          td.v-data-table__td {
            text-transform: capitalize;
          }
        }
      }
    }
  }
}
</style>
