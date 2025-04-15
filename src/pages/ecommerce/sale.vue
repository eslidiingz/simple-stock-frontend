<template>
  <SaleSearchProduct />

  <VRow>
    <VCol cols="8">
      <!-- 👉 Order Details  -->
      <SaleOrderTable />

      <!-- 👉 Payment  -->
      <SalePayment />
    </VCol>

    <VCol cols="4">
      <!-- 👉 Customer Details  -->
      <SaleCustomerDetails />

      <!-- 👉 Shipping Address -->
      <SaleShippingAddress />

      <!-- 👉 Note -->
      <SaleNote />
    </VCol>
  </VRow>
</template>
