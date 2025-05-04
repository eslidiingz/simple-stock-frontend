<script setup lang="ts">
import { FindProductByCode, Product } from '@/models/product.model'
import { useDialogStore } from '@/stores/dialog'
import { useSaleStore } from '@/stores/sale'

const barcode = ref<string>('')
const sale = useSaleStore()
const dialog = useDialogStore()

const canAddProductToOrder = (item: Product) => {
  if ( !item ) {
    dialog.error({ message: 'Product not found' })
    barcode.value = ''
    return false
  }

  if ( item?.stock < 1 ) {
    dialog.info({ message: 'Product out of stock' })
    barcode.value = ''
    return false
  }

  const hasProduct = sale.items.find(p => p.code === item.code)

  if ( hasProduct && hasProduct?.quantity >= item.stock ) {
      dialog.info({ message: 'Product out of stock' })
      barcode.value = ''
    return false
  }

  return true
}

const addToOrder = async () => {
  const { product } = await FindProductByCode(barcode.value)

  if (canAddProductToOrder(product)) {
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
