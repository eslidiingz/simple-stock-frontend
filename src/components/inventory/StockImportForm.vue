<script setup lang="ts">
import { FindProductByCode } from '@/models/product.model'
import { useStockStore } from '@/stores/stock'

const barcode = ref<string>('')
const stock = useStockStore()

const addToList = async () => {
  const { product } = await FindProductByCode(barcode.value)

  if (product) {
    stock.addToList(product)

    barcode.value = ''
  }
}
</script>

<template>
  <VForm
    class="d-flex gap-x-4 mb-16"
    @submit.prevent="addToList"
  >
    <AppTextField
      v-model="barcode"
      prepend-inner-icon="tabler-barcode"
    />
    <VBtn :disabled="barcode === ''">
      <VIcon
        start
        icon="tabler-copy-plus"
      />
      Add to list
    </VBtn>
  </VForm>
</template>
