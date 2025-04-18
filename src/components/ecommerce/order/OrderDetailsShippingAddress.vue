<script setup lang="ts">
import type { Order } from '@/models/order.model'

interface Props {
  order: Order
}

const props = defineProps<Props>()
</script>

<template>
  <VCard class="mb-6">
    <VCardItem>
      <VCardTitle>Shipping Address</VCardTitle>
      <template #append>
        <div class="d-flex align-center justify-space-between">
          <div
            class="text-base font-weight-medium text-primary cursor-pointer"
            @click="isEditAddressDialogVisible = !isEditAddressDialogVisible"
          >
            Edit
          </div>
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <div class="text-body-1">
        <div class="d-flex align-center">
          <VIcon
            icon="tabler-map-pin"
            class="me-1"
          />{{ props.order.shipping_address }}
        </div>
        <!--
          <AppTextarea
          v-model="sale.shippingAddress"
          placeholder="Shipping Address"
          prepend-inner-icon="tabler-map-pin"
          />
        -->
      </div>
    </VCardText>
  </VCard>
</template>
