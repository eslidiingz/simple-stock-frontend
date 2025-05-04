<template>
  <div class="d-flex justify-space-between align-baseline">
    <div>
      <h2>Stock Movement</h2>
      <div class="text-caption mt-2">
        Inventory movement list, show product stock in/out history.
      </div>
    </div>
    <VBtn
      prepend-icon="tabler-cube-plus"
      color="primary"
      :to="{ name: 'inventory-stock-movements-import' }"
    >
      Import product
    </vbtn>
  </div>
</template>
