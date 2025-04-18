<script setup lang="ts">
defineEmits(['click'])
</script>

<template>
  <VBtn
    color="primary"
    @click="$emit('click')"
  >
    <VIcon
      icon="tabler-device-floppy"
      size="20"
      class="me-1"
    /> Save
  </VBtn>
</template>
