<script setup lang="ts">
import { useSaleStore } from '@/stores/sale';

const sale = useSaleStore()
</script>

<template>
  <VCard class="mb-6">
    <VCardText class="d-flex flex-column gap-y-6">
      <h5 class="text-h5">
        Customer details
      </h5>

      <div class="d-flex flex-column gap-y-1">
        <AppTextField
          v-model="sale.customer.receiver"
          placeholder="Receiver"
          label="Receiver"
          class="mb-4"
          prepend-inner-icon="tabler-user"
        />

        <AppTextField
          v-model="sale.customer.phone"
          placeholder="Phone"
          label="Phone"
          class="mb-4"
          prepend-inner-icon="tabler-phone"
        />
      </div>
    </VCardText>
  </VCard>
</template>
