<script setup lang="ts">
import { FindProductByCode } from '@/models/product.model'
import { useSaleStore } from '@/stores/sale'

const barcode = ref<string>('')
const sale = useSaleStore()

const addToOrder = async () => {
  const { product } = await FindProductByCode(barcode.value)

  if (product) {
    sale.addToOrder(product)

    barcode.value = ''
  }
}
</script>

<template>
  <VCard class="mb-4">
    <VCardText>
      <VForm
        class="d-flex gap-x-4"
        @submit.prevent="addToOrder"
      >
        <AppTextField
          v-model="barcode"
          prepend-inner-icon="tabler-barcode"
        />

        <VBtn
          type="submit"
          :disabled="barcode === ''"
          color="secondary"
        >
          <VIcon
            start
            icon="tabler-copy-plus"
          />
          Add to order
        </VBtn>
      </VForm>
    </VCardText>
  </VCard>
</template>
