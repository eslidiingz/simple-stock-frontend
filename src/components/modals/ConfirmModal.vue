<script lang="ts" setup>
interface Props {
  isOpen: boolean
}

interface Emit {
  (e: 'update:isOpen', val: boolean): void
  (e: 'update:submit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
</script>

<template>
  <VDialog
    max-width="500"
    :model-value="props.isOpen"
    @update:model-value="emit('update:isOpen', $event)"
  >
    <VCard>
      <VCardText class="text-center text-h5">
        Are you sure?
      </VCardText>

      <VCardText class="text-center">
        Do you really want to delete this record?
      </VCardText>

      <VCardText class="d-flex justify-center gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="emit('update:isOpen', false)"
        >
          Cancel
        </VBtn>
        <VBtn
          color="error"
          @click="emit('update:submit')"
        >
          Confirm
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
