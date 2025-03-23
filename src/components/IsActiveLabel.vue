<script setup lang="ts">
const props = defineProps<{ isActive: boolean }>()
</script>

<template>
  <VChip :color="props.isActive ? `success` : `error`">
    {{ props.isActive ? `Active` : `Inactive` }}
  </VChip>
</template>
