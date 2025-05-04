<script setup lang="ts">
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@layouts/utils'
import { useTheme } from 'vuetify'
import { useDialogStore } from './stores/dialog'

import { useToastStore } from '@/stores/toast'

const { global } = useTheme()
const toast = useToastStore()
const dialog = useDialogStore()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
      <!-- <BuyNow /> -->
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>

  <Toast
    v-model:visible="toast.visible"
    :text="toast.message"
    :status="toast.status"
  />

  <ConfirmDialog
    v-model:isDialogVisible="dialog.confirm.isVisible"
    :confirmation-question="dialog.confirm.message"
  />

  <Dialog v-model:isDialogVisible="dialog.normal.isVisible" />
</template>
