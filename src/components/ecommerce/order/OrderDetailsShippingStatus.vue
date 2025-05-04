<script setup lang="ts">
import type { Order } from "@/models/order.model";

interface Props {
	order: Order;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:status"]);

const shippingStatusItems = ["PENDING", "PROCESSING", "PACKED", "DELIVERY", "DELIVERED", "CANCEL", "RETURNED", "COMPLETED"]
const shippingStatusSelected = ref(props.order.status);

const onStatusChanged = () => {
	emit("update:status", shippingStatusSelected.value);
};
</script>

<template>
  <VCard class="mb-6">
    <VCardItem  class="d-flex align-center justify-space-between">
      <VCardTitle>Shipping Status</VCardTitle>
      <template #append>
        <div>
          <AppSelect
            v-model="shippingStatusSelected"
            :items="shippingStatusItems"
            placeholder="Shipping Status"
            @update:model-value="onStatusChanged"
          />
        </div>
      </template>
    </VCardItem>
  </VCard>
</template>
