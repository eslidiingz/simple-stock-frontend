<script setup lang="ts">
import { useSaleStore } from '@/stores/sale';

const sale = useSaleStore()
</script>

<template>
  <VCard class="mb-6">
    <VCardText class="d-flex flex-column gap-y-6">
      <h5 class="text-h5">
        Note
      </h5>

      <div class="text-body-1">
        <AppTextarea
          v-model="sale.note"
          placeholder="Reminder note"
          prepend-inner-icon="tabler-notes"
        />
      </div>
    </VCardText>
  </VCard>
</template>
