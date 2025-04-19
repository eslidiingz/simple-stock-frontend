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
          :color="dialog.normal.type === 'error' ? 'error' : 'success'"
          class="my-4"
          style=" block-size: 88px;inline-size: 88px; pointer-events: none;"
        >
          <VIcon
            :icon="dialog.normal.type === 'error' ? 'tabler-x' : 'tabler-check'"
            size="38"
          />
        </VBtn>

        <h1 class="text-h4 mb-4">
          {{ dialog.normal?.title }}
        </h1>

        <p>{{ dialog.normal.message }}</p>

        <VBtn
          :color="dialog.normal.type === 'error' ? 'error' : 'success'"
          @click="dialog.dialogConfirm()"
        >
          Ok
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
