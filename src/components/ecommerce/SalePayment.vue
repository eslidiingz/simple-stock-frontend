<script setup lang="ts">
import type { PaymentMethod } from '@/models/paymentMethod.model'
import { GetPaymentMethods } from '@/models/paymentMethod.model'
import { useSaleStore } from '@/stores/sale'

const sale = useSaleStore()

const { data: paymentMethodsData } = await GetPaymentMethods()

const paymentMethods = computed(() => ({
  ...paymentMethodsData.map((method: PaymentMethod) => ({
    title: method.payment_type?.name,
    value: method.payment_type?.code,
    subtitle: method.fee === 0 ? 'Free' : `฿${method.fee}`,
    desc: method.note,
  })),
}))

const selectedPayment = ref('bank_transfer')

const setPaymentMethod = () => {
  sale.paymentMethod = paymentMethodsData.find((method: PaymentMethod) => method.payment_type?.code === selectedPayment.value)
}

setPaymentMethod()

watch(selectedPayment, () => {
  setPaymentMethod()
})

watch(() => sale.paymentMethod, () => {
  if (Object.keys(sale.paymentMethod).length === 0)
    selectedPayment.value = 'bank_transfer'
})
</script>

<template>
  <VCard class="mb-6">
    <VCardText class="d-flex flex-column gap-y-6">
      <h5 class="text-h5">
        Payment
      </h5>

      <div>
        <h6 class="text-h6 mb-2">
          Method
        </h6>

        <CustomRadios
          v-model:selected-radio="selectedPayment"
          :radio-content="paymentMethods"
          :grid-column="{ sm: '6', cols: '12' }"
        />
      </div>
    </VCardText>
  </VCard>
</template>
