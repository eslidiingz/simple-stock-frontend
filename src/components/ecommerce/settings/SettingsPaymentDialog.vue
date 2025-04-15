<script setup lang="ts">
import type { PaymentType } from '@/models/paymentType.model'
import { GetPaymentTypesActive } from '@/models/paymentType.model'

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:selectedPaymentType', value: string): void
}
interface Props {
  isDialogVisible: boolean
  smsCode?: string
  authAppCode?: string
}

const props = withDefaults(defineProps<Props>(), {
  isDialogVisible: false,
  smsCode: '',
  authAppCode: '',
})

const emit = defineEmits<Emit>()

const { data: paymentTypesData } = await GetPaymentTypesActive()

const paymentTypes = computed(() => ({
  ...paymentTypesData.map((paymentType: PaymentType) => ({
    ...paymentType, value: paymentType.code,
  })),
}))

// const authMethods = [
//   {
//     icon: 'tabler-settings',
//     title: 'Authenticator Apps',
//     desc: 'Get code from an app like Google Authenticator or Microsoft Authenticator.',
//     value: 'authApp',
//   },
//   {
//     icon: 'tabler-message',
//     title: 'SMS',
//     desc: 'We will send a code via SMS if you need to use your backup login method.',
//     value: 'sms',
//   },
// ]

const selectedType = ref('bank_transfer')
const isAuthAppDialogVisible = ref(false)
const isSmsDialogVisible = ref(false)

const selectedPaymentType = () => {
  emit('update:selectedPaymentType', selectedType.value)
  emit('update:isDialogVisible', false)

  // if (selectedType.value === 'authApp') {
  //   isAuthAppDialogVisible.value = true
  //   isSmsDialogVisible.value = false
  //   emit('update:isDialogVisible', false)
  // }
  // if (selectedType.value === 'sms') {
  //   isAuthAppDialogVisible.value = false
  //   isSmsDialogVisible.value = true
  //   emit('update:isDialogVisible', false)
  // }
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 640"
    :model-value="props.isDialogVisible"
    @update:model-value="(val) => $emit('update:isDialogVisible', val)"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

    <VCard class="pa-2 pa-sm-10">
      <VCardText>
        <!-- 👉 Title -->
        <div class="mb-6">
          <h4 class="text-h4 text-center mb-2">
            Select Payment Method
          </h4>
          <p class="text-body-1 text-center mb-6">
            You also need to select a payment method for customer pay any orders.
          </p>
          <CustomRadios
            v-model:selected-radio="selectedType"
            :radio-content="paymentTypes"
            :grid-column="{ cols: '12' }"
          >
            <template #default="items">
              <div class="d-flex flex-column">
                <div class="d-flex gap-1 mb-2">
                  <!--
                    <VIcon
                    :icon="items.item.icon"
                    size="20"
                    class="text-high-emphasis"
                    />
                  -->
                  <h6 class="text-h6">
                    {{ items.item?.name }}
                  </h6>
                </div>
                <!--
                  <p class="text-body-2 mb-0">
                  {{ items.item.name }}
                  </p>
                -->
              </div>
            </template>
          </CustomRadios>
        </div>

        <div class="d-flex gap-4 justify-center">
          <VBtn @click="selectedPaymentType">
            select
          </VBtn>
          <VBtn
            color="secondary"
            variant="tonal"
            @click="$emit('update:isDialogVisible', false)"
          >
            Cancel
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>

  <AddAuthenticatorAppDialog
    v-model:isDialogVisible="isAuthAppDialogVisible"
    :auth-code="props.authAppCode"
  />
  <EnableOneTimePasswordDialog
    v-model:isDialogVisible="isSmsDialogVisible"
    :mobile-number="props.smsCode"
  />
</template>
