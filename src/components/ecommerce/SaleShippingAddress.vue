<script setup lang="ts">
import { useSaleStore } from '@/stores/sale';

const sale = useSaleStore()
</script>

<template>
  <VCard class="mb-6">
    <VCardText class="d-flex flex-column gap-y-6">
      <h5 class="text-h5">
        Shipping Address
      </h5>

      <div class="text-body-1">
        <AppTextarea
          v-model="sale.shippingAddress"
          placeholder="Shipping Address"
          prepend-inner-icon="tabler-map-pin"
        />
      </div>
    </VCardText>
  </VCard>
</template>
