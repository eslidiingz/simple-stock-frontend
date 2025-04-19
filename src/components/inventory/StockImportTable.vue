<script setup lang="ts">
import type { Product } from '@/models/product.model'
import { ImportStockMovement } from '@/models/stockMovement.model'
import { useDialogStore } from '@/stores/dialog'
import { useStockStore } from '@/stores/stock'

interface ProductSelected extends Product {
  quantity: number
}

const stock = useStockStore()
const dialog = useDialogStore()

const headers = [
  { title: 'Product', key: 'product', sortable: false },
  { title: 'Quantity', key: 'quantity', sortable: false },
  { title: 'Delete', key: 'delete', sortable: false },
]

const data = computed(() => stock.list)
const productSelected = ref<ProductSelected>()

const importStock = async () => {
  const dataImport = data.value.map((item: { id: string; quantity: number }) => ({
    product_id: item.id,
    quantity: item.quantity,
  }))

  const imported = await ImportStockMovement(dataImport)

  if (imported?.adjustment?.movementList?.length) {
    dialog.show({ message: 'Import product into stock is successfully.' })
    stock.clear()
  }
}

const onOpenConfirmDelete = (itemSelected: ProductSelected) => {
  dialog.showConfirm({
    message: 'Are you sure you want to delete this product?',
    onConfirm: async () => {
      await onDelete()
    },
  })
  productSelected.value = itemSelected
}

const onDelete = async () => {
  if (productSelected.value?.id) {
    stock.removeFromList(productSelected.value)
  }
}
</script>

<template>
  <div class="d-flex justify-end">
    <VBtn
      color="success"
      :disabled="!data.length"
      @click="importStock"
    >
      <VIcon
        start
        icon="tabler-cube-plus"
      />
      Import product
    </VBtn>
  </div>

  <VDivider class="mt-6" />

  <VDataTable
    :headers="headers"
    :items="data"
    :items-per-page="5"
  >
    <template #item.product="{ item }">
      <div class="d-flex align-center gap-x-4">
        <VAvatar
          v-if="item.image"
          size="38"
          variant="tonal"
          rounded
          :image="imageUrl(item.image)"
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

    <template #item.quantity="{ item }">
      <AppTextField
        v-model.number="item.quantity"
        type="number"
        style="inline-size: 100px;"
        class="text-right"
        min="1"
      />
    </template>

    <template #item.delete="{ item }">
      <IconBtn @click="onOpenConfirmDelete(item)">
        <VIcon
          icon="tabler-trash"
          size="22"
        />
      </IconBtn>
    </template>
  </VDataTable>
</template>
