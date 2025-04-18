<script setup lang="ts">
import type { Order } from '@/models/order.model'
import type { PaymentMethod } from '@/models/paymentMethod.model'
import { GetPaymentMethods } from '@/models/paymentMethod.model'

interface Props {
  order: Order
}

const props = defineProps<Props>()
const emit = defineEmits(['update:status'])

const { data: paymentMethodsData } = await GetPaymentMethods()

const paymentMethods = computed(() =>
  paymentMethodsData.map((method: PaymentMethod) => ({
    title: method.payment_type?.name,
    value: method.payment_type?.code,
    subtitle: method.fee === 0 ? 'Free' : `฿${method.fee}`,
    desc: method.note,
  })),
)

const paymentSelected = computed(() => paymentMethods.value?.find((method: any) => method.value === props.order.payment_code))

const paymentStatusItems = ['UNPAID', 'PAID', 'REFUNDED']
const paymentStatusSelected = ref(props.order.payment_status)

const onStatusChanged = () => {
  emit('update:status', paymentStatusSelected.value)
}
</script>

<template>
  <VCard class="mb-6">
    <VCardItem>
      <VCardTitle>Payment</VCardTitle>
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
      <VRow>
        <VCol
          cols="12"
          sm="7"
          md="8"
        >
          <h6 class="text-h6 mb-2">
            Method
          </h6>

          <div>
            <div class="text-h6">
              {{ paymentSelected?.title }}
            </div>
            <small>{{ paymentSelected?.desc }}</small>
          </div>
        </VCol>

        <VCol
          cols="12"
          sm="5"
          md="4"
        >
          <h6 class="text-h6 mb-2">
            Status
          </h6>

          <div>
            <AppSelect
              v-model="paymentStatusSelected"
              :items="paymentStatusItems"
              placeholder="Payment Status"
              @update:model-value="onStatusChanged"
            />
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
