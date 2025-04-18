<script setup lang="ts">
import { useDialogStore } from '@/stores/dialog'

export interface DialogProps {
  isDialogVisible: boolean
  title?: string
  message?: string
}

const props = defineProps<DialogProps>()
const dialog = useDialogStore()
</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="500"
  >
    <VCard>
      <VCardText class="text-center px-10 py-6">
        <VBtn
          icon
          variant="outlined"
          color="success"
          class="my-4"
          style=" block-size: 88px;inline-size: 88px; pointer-events: none;"
        >
          <VIcon
            icon="tabler-check"
            size="38"
          />
        </VBtn>

        <h1 class="text-h4 mb-4">
          {{ dialog.normal?.title }}
        </h1>

        <p>{{ dialog.normal.message }}</p>

        <VBtn
          color="success"
          @click="dialog.dialogConfirm()"
        >
          Ok
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
