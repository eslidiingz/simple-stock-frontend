<script setup lang="ts">
import type { StockMovement } from '@/models/stockMovement.model'
import { MovementType } from '@/models/stockMovement.model'

const headers = [
  { title: 'Product', key: 'product', sortable: false },
  { title: 'Type', key: 'movement_type', sortable: false },
  { title: 'Quantity', key: 'quantity', sortable: false, align: 'end' },
  { title: 'Created At', key: 'created_at', sortable: false, align: 'end' },
]

// Data table options
const page = ref<number>(1)
const itemsPerPage = ref<number>(10)

const isLoading = ref<boolean>(false)

const { data: stockMovementsData, execute: fetchStockMovements } = await useApi<any>(createUrl('/stock-movements', {
  query: {
    page,
    limit: itemsPerPage,
  },
}))

const stockMovements = computed((): StockMovement[] => stockMovementsData.value.data)
const totalItem = computed(() => stockMovementsData.value.pagination.total)
</script>

<template>
  <VDataTableServer
    :headers="headers"
    :items="stockMovements"
    :items-length="totalItem"
    :loading="isLoading"
    class="text-no-wrap"
    @update:options="fetchStockMovements"
  >
    <template #item.product="{ item }">
      <div class="d-flex align-center gap-x-4">
        <VAvatar
          v-if="item.product?.thumbnail"
          size="38"
          variant="tonal"
          rounded
          :image="imageUrl(item.product.thumbnail)"
        />

        <div class="d-flex flex-column">
          <span class="text-body-1 font-weight-medium text-high-emphasis">{{ item.product?.name }}</span>
          <div class="text-body-2">
            <span>{{ item.productBrand }}</span>
            <span class="text-caption">{{ item?.product.code }}</span>
          </div>
        </div>
      </div>
    </template>

    <template #item.movement_type="{ item }">
      <VChip
        :color="item.movement_type === MovementType.STOCK_IN ? 'success' : 'error'"
        :label="false"
        size="small"
      >
        <VIcon
          start
          :icon="item.movement_type === MovementType.STOCK_IN ? 'tabler-arrow-up' : 'tabler-arrow-down'"
        />
        {{ item.movement_type }}
      </VChip>
    </template>

    <template #item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
      <!-- {{ new Date(item.created_at).toLocaleDateString() }} -->
    </template>

    <template #bottom>
      <TablePagination
        v-model:page="page"
        :items-per-page="itemsPerPage"
        :total-items="totalItem"
      />
    </template>
  </VDataTableServer>
</template>
