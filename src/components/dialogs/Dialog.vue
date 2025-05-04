<script setup lang="ts">
import { useDialogStore } from '@/stores/dialog';

export interface DialogProps {
  isDialogVisible: boolean
  title?: string
  message?: string
  type?: 'success' | 'error'
}

const props = defineProps<DialogProps>()
const dialog = useDialogStore()

const iconDialog = computed(() => {
  switch (dialog.normal.type) {
    case 'info':
      return 'tabler-info-small'
    case 'error':
      return 'tabler-x'
    default:
      return 'tabler-check'
  }
})

const colorDialog = computed(() => {
  switch (dialog.normal.type) {
    case 'info':
      return 'info'
    case 'error':
      return 'error'
    default:
      return 'success'
  }
})

</script>

<template>
  <VDialog
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="dialog.hide()"
  >
    <VCard>
      <VCardText class="text-center px-10 py-6">
        <VBtn
          icon
          variant="outlined"
          :color="colorDialog"
          class="my-4"
          style=" block-size: 88px;inline-size: 88px; pointer-events: none;"
        >
          <span class="text-5xl" v-if="dialog.normal.type === 'info'">!</span>
          <VIcon
            :icon="iconDialog"
            size="38"
            v-else
          />
        </VBtn>

        <h1 class="text-h4 mb-4">
          {{ dialog.normal?.title }}
        </h1>

        <p>{{ dialog.normal.message }}</p>

        <VBtn
          :color="colorDialog"
          @click="dialog.dialogConfirm()"
        >
          Ok
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
