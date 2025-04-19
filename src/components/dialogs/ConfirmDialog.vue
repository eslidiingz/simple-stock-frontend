<script setup lang="ts">
import { useDialogStore } from '@/stores/dialog'

interface Props {
  confirmationQuestion: string
  confirmationTitle?: string
  isDialogVisible: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const dialog = useDialogStore()
</script>

<template>
  <!-- 👉 Confirm Dialog -->
  <VDialog
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="emit('update:isDialogVisible', $event)"
  >
    <VCard>
      <VCardText class="text-center px-10 py-6">
        <VBtn
          icon
          variant="outlined"
          color="warning"
          class="my-4"
          style=" block-size: 88px;inline-size: 88px; pointer-events: none;"
        >
          <span class="text-5xl">!</span>
        </VBtn>

        <h1 class="text-h4 mb-4">
          {{ props.confirmationTitle }}
        </h1>

        <h6 class="text-lg font-weight-medium">
          {{ props.confirmationQuestion }}
        </h6>
      </VCardText>

      <VCardText class="d-flex align-center justify-center gap-2">
        <VBtn
          variant="elevated"
          @click="dialog.confirmYes()"
        >
          Confirm
        </VBtn>

        <VBtn
          color="secondary"
          variant="tonal"
          @click="dialog.confirmNo()"
        >
          Cancel
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <!--
    <VDialog
    v-model="cancelled"
    max-width="500"
    >
    <VCard>
    <VCardText class="text-center px-10 py-6">
    <VBtn
    icon
    variant="outlined"
    color="error"
    class="my-4"
    style=" block-size: 88px;inline-size: 88px; pointer-events: none;"
    >
    <span class="text-5xl font-weight-light">X</span>
    </VBtn>

    <h1 class="text-h4 mb-4">
    {{ props.cancelTitle }}
    </h1>

    <p>{{ props.cancelMsg }}</p>

    <VBtn
    color="success"
    @click="cancelled = false"
    >
    Ok
    </VBtn>
    </VCardText>
    </VCard>
    </VDialog>
  -->
</template>
