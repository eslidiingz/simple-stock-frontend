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
      <VCardTitle>Note</VCardTitle>
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

    <VCardText class="d-flex flex-column gap-y-6">
      <div class="text-body-1">
        {{ props.order.note }}
        <!--
          <AppTextarea
          v-model="sale.note"
          placeholder="Reminder note"
          prepend-inner-icon="tabler-notes"
          />
        -->
      </div>
    </VCardText>
  </VCard>
</template>
