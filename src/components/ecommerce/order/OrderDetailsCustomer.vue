<script setup lang="ts">
import type { Order } from '@/models/order.model';

interface Props {
  order: Order
}

const props = defineProps<Props>()
</script>

<template>
  <VCard class="mb-6">
    <VCardItem>
      <VCardTitle>Customer details</VCardTitle>
      <!-- <template #append>
        <div class="d-flex align-center justify-space-between">
          <div
            class="text-base font-weight-medium text-primary cursor-pointer"
            @click="isEditAddressDialogVisible = !isEditAddressDialogVisible"
          >
            Edit
          </div>
        </div>
      </template> -->
    </VCardItem>

    <VCardText class="d-flex flex-column gap-y-6">
      <div class="d-flex flex-column gap-y-1">
        <div class="d-flex align-center font-weight-bold text-h5">
          <VIcon
            icon="tabler-user"
            size="18"
            class="me-1"
          />
          {{ props.order.receiver_name }}
        </div>
        <div class="d-flex align-center">
          <VIcon
            icon="tabler-phone"
            size="18"
            class="me-1"
          />
          {{ props.order.receiver_phone }}
        </div>

        <!--
          <AppTextField
          v-model="sale.customer.receiver"
          placeholder="Receiver"
          label="Receiver"
          class="mb-4"
          prepend-inner-icon="tabler-user"
          />
        -->
        <!--
          <AppTextField
          v-model="sale.customer.phone"
          placeholder="Phone"
          label="Phone"
          class="mb-4"
          prepend-inner-icon="tabler-phone"
          />
        -->
      </div>
    </VCardText>
  </VCard>
</template>
