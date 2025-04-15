<script setup>
import { ref } from 'vue'
import { GetPaymentMethods } from '../../../models/paymentMethod.model'

// const paymentMethods = ref([
//   { id: 'transfer', label: 'โอนเงิน', fee: 0, active: true, note: 'ฟรีค่าจัดส่ง' },
//   { id: 'cod', label: 'เก็บเงินปลายทาง', fee: 50, active: true, note: 'บวกค่าขนส่ง 50 บาท' },
// ])

const shipping = ref({
  base_fee: 50,
  cod_extra: 20,
  free_shipping_over: 2000,
  default_carrier: 'Kerry',
})

const { data: paymentMethodsData } = await GetPaymentMethods()

const paymentMethods = computed(() => paymentMethodsData)

const isSettingPaymentDialogVisible = ref(false)
const selectedPaymentType = ref('')

// const addPaymentMethod = () => {
//   paymentMethods.value.push({ id: '', label: '', fee: 0, active: true, note: '' })
// }

// const removePaymentMethod = index => {
//   paymentMethods.value.splice(index, 1)
// }

// const saveSettings = () => {
//   const payload = {
//     payment_methods: paymentMethods.value,
//     shipping: shipping.value,
//   }

//   console.log('Saving settings:', payload)

//   // TODO: Replace with API call
// }

const updateSelectedPaymentType = paymentType => {
  selectedPaymentType.value = paymentType
}
</script>

<template>
  <VContainer class="py-6">
    <h2 class="text-h5 font-weight-bold mb-6">
      Payment & Shipping Settings
    </h2>

    <!-- Payment Methods -->
    <VCard class="mb-6">
      <VCardText>
        <h3 class="text-subtitle-1 font-weight-medium mb-6">
          Payment Methods
        </h3>

        <div
          v-for="(method, index) in paymentMethods"
          :key="index"
          class="d-flex align-center flex-wrap mb-4 gap-4"
        >
          <VRow>
            <VCol cols="6">
              <div class="d-flex">
                <!--
                  <VCheckbox
                  v-model="method.active"
                  class="me-2"
                  />
                -->
                <VTextField
                  v-model="method.payment_type.name"
                  label="Method"
                  variant="outlined"
                  disabled
                />
              </div>
            </VCol>

            <VCol cols="2">
              <VTextField
                v-model.number="method.fee"
                type="number"
                label="Fee"
                min="0"
              />
            </VCol>

            <VCol cols="3">
              <VTextField
                v-model="method.note"
                label="Note (Optional)"
                class="me-2"
              />
            </VCol>

            <!--
              <VCol cols="1">
              <VBtn
              icon
              color="error"
              @click="removePaymentMethod(index)"
              >
              <VIcon icon="tabler-trash" />
              </VBtn>
              </VCol>
            -->
          </VRow>

          <!--
            <VTextField
            v-model.number="method.fee"
            type="number"
            label="Fee (฿)"
            class="me-2"
            />
            <VTextField
            v-model="method.note"
            label="Note (optional)"
            class="me-2"
            />
            <VBtn
            icon
            color="error"
            @click="removePaymentMethod(index)"
            >
            <VIcon icon="tabler-trash" />
            </VBtn>
          -->
        </div>

        <!--
          <VBtn
          color="primary"
          @click="isSettingPaymentDialogVisible = true"
          >
          <VIcon
          start
          icon="tabler-plus"
          />
          Add Payment Method
          </VBtn>
        -->
      </VCardText>
    </VCard>

    <!-- Shipping Settings -->
    <VCard class="mb-6">
      <VCardText>
        <h3 class="text-subtitle-1 font-weight-medium mb-4">
          Shipping Settings
        </h3>

        <VRow>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <VTextField
              v-model.number="shipping.base_fee"
              type="number"
              label="Base Shipping Fee (฿)"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <VTextField
              v-model.number="shipping.cod_extra"
              type="number"
              label="COD Extra Fee (฿)"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <VTextField
              v-model.number="shipping.free_shipping_over"
              type="number"
              label="Free Shipping Over (฿)"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
            md="4"
          >
            <VTextField
              v-model="shipping.default_carrier"
              label="Default Carrier"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Save Button -->
    <div class="d-flex justify-end">
      <VBtn
        color="success"
        @click="saveSettings"
      >
        <VIcon
          start
          icon="tabler-device-floppy"
        />
        Save Settings
      </VBtn>
    </div>
  </VContainer>

  <SettingsPaymentDialog
    v-model:isDialogVisible="isSettingPaymentDialogVisible"
    @update:selected-payment-type="updateSelectedPaymentType"
  />
</template>
