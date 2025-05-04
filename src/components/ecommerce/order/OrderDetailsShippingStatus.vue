<script setup lang="ts">
import type { Order } from "@/models/order.model";

interface Props {
	order: Order;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:status", "update:trackingCode"]);

const shippingStatusItems = ["PENDING", "PROCESSING", "PACKED", "DELIVERY", "DELIVERED", "CANCEL", "RETURNED", "COMPLETED"]
const shippingStatusSelected = ref(props.order.status);
const trackingCode = ref(props.order.tracking_code);

const onStatusChanged = () => {
	emit("update:status", shippingStatusSelected.value);
};

const onInputTrackingCode = () => {
  emit("update:trackingCode", trackingCode.value);
}
</script>

<template>
  <VCard class="mb-6">
    <VCardItem  class="d-flex align-center justify-space-between">
      <VCardTitle>Shipping Status</VCardTitle>
      <template #append>
        <div class="d-flex">
          <AppSelect
            v-model="shippingStatusSelected"
            :items="shippingStatusItems"
            placeholder="Shipping Status"
            @update:model-value="onStatusChanged"
          />
          
          <AppTextField 
            v-if="shippingStatusSelected === 'DELIVERY'"
            v-model="trackingCode" 
            placeholder="Tracking Code" 
            class="ms-4" 
            prepend-inner-icon="tabler-tag"
            style="min-inline-size: 220px;"
            @update:model-value="onInputTrackingCode"
          />

          
        </div>
      </template>
    </VCardItem>
  </VCard>
</template>
