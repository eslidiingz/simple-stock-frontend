<script lang="ts" setup>
const props = defineProps<Props>()

defineEmits(['update:visible'])

interface Props {
  text: string
  visible: boolean
  status?: 'success' | 'error'
}
</script>

<template>
  <VSnackbar
    :model-value="props.visible"
    location="top end"
    variant="flat"
    :color="props.status || 'success'"
    @update:model-value="$emit('update:visible', $event)"
  >
    {{ props.text }}
  </VSnackbar>
</template>
