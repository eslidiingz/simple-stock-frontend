<script setup lang="ts">
import { SECOND } from '@/contants/dateTime'
import { DeleteOrder, FindOneOrder, OrderPaymentStatus, UpdateOrder, resolveOrderPaymentStatus, resolveOrderStatus } from '@/models/order.model'
import { useDialogStore } from '@/stores/dialog'

const route = useRoute('ecommerce-orders-id')
const router = useRouter()

const { id } = route.params
const { data } = await FindOneOrder(id)
const order = ref(data)

const paymentStatusSelected = ref(order.value.payment_status)
const shippingStatusSelected = ref(order.value.status)
const trackingCode = ref(order.value.tracking_code)

const dialog = useDialogStore()

const onUpdateOrder = async () => {
  const updateOrderData = {
    ...order.value,
    payment_status: paymentStatusSelected.value,
    status: shippingStatusSelected.value,
    tracking_code: trackingCode.value
  }

  const orderUpdated = await UpdateOrder(id, updateOrderData)

  if (orderUpdated?.success) {
    dialog.show({ message: orderUpdated.message })
    order.value.payment_status = paymentStatusSelected.value
    order.value.status = shippingStatusSelected.value
    order.value.tracking_code = trackingCode.value
  }
}

const onConfirmedDeleteOrder = async () => {
  const deletedOrder = await DeleteOrder(id)

  if (deletedOrder.success) {
    dialog.show({ message: 'Order deleted successfully' })

    setTimeout(() => {
      router.push({ name: 'ecommerce-orders' })
    }, 2 * SECOND)
  }
}

const onDeleteOrder = async () => {
  dialog.showConfirm({
    title: 'Delete Order',
    message: 'Are you sure to delete this order?',
    onConfirm: onConfirmedDeleteOrder,
  })
}
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
      <div>
        <div class="d-flex gap-2 align-center mb-2 flex-wrap">
          <h5 class="text-h5">
            Order #{{ order?.code }}
          </h5>
          <div class="d-flex gap-x-2">
            <VChip
              v-bind="resolveOrderPaymentStatus(order?.payment_status)"
              variant="tonal"
              label
              size="small"
            >
              {{ order?.payment_status }}
            </VChip>
            <VChip
              v-bind="resolveOrderStatus(order?.status)"
              variant="tonal"
              label
              size="small"
            >
              {{ order?.status }}
            </VChip>

            <VChip
              v-if="order?.tracking_code"
              variant="tonal"
              label
              size="small"
            >
              {{ order?.tracking_code }}
            </VChip>
          </div>
        </div>
        <div class="text-body-1">
          {{ formatDate(order.created_at) }}
        </div>
      </div>

      <div>
        <VBtn
          variant="text"
          color="error"
          class="me-2"
          @click="onDeleteOrder"
          v-if="order.payment_status !== OrderPaymentStatus.PAID"
        >
          Delete Order
        </VBtn>

        <ButtonSave @click="onUpdateOrder" />
      </div>
    </div>

    <VRow>
      <VCol
        cols="12"
        md="8"
      >
        <!-- 👉 Order Details -->
        <OrderDetailsTable :order="order" />

        <!-- 👉 Order Payment -->
        <OrderDetailsPayment
          :order="order"
          @update:status="paymentStatusSelected = $event"
        />

        <!-- 👉 Shipping Activity -->
        <OrderDetailsShippingStatus
          :order="order"
          @update:status="shippingStatusSelected = $event"
          @update:tracking-code="trackingCode = $event"
        />

         
        <!--
          <VCard title="Shipping Activity">
          <VCardText>
          <VTimeline
          truncate-line="both"
          line-inset="9"
          align="start"
          side="end"
          line-color="primary"
          density="compact"
          >
          <VTimelineItem
          dot-color="primary"
          size="x-small"
          >
          <div class="d-flex justify-space-between align-center">
          <div class="app-timeline-title">
          Order was placed (Order ID: #32543)
          </div>
          <div class="app-timeline-meta">
          Tuesday 10:20 AM
          </div>
          </div>
          <p class="app-timeline-text mb-0 mt-3">
          Your order has been placed successfully
          </p>
          </VTimelineItem>

          <VTimelineItem
          dot-color="primary"
          size="x-small"
          >
          <div class="d-flex justify-space-between align-center">
          <span class="app-timeline-title">Pick-up</span>
          <span class="app-timeline-meta">Wednesday 11:29 AM</span>
          </div>
          <p class="app-timeline-text mb-0 mt-3">
          Pick-up scheduled with courier
          </p>
          </VTimelineItem>

          <VTimelineItem
          dot-color="primary"
          size="x-small"
          >
          <div class="d-flex justify-space-between align-center">
          <span class="app-timeline-title">Dispatched</span>
          <span class="app-timeline-meta">Thursday 8:15 AM</span>
          </div>
          <p class="app-timeline-text mb-0 mt-3">
          Item has been picked up by courier.
          </p>
          </VTimelineItem>

          <VTimelineItem
          dot-color="primary"
          size="x-small"
          >
          <div class="d-flex justify-space-between align-center">
          <span class="app-timeline-title">Package arrived</span>
          <span class="app-timeline-meta">Saturday 15:20 AM</span>
          </div>
          <p class="app-timeline-text mb-0 mt-3">
          Package arrived at an Amazon facility, NY
          </p>
          </VTimelineItem>

          <VTimelineItem
          dot-color="primary"
          size="x-small"
          >
          <div class="d-flex justify-space-between align-center">
          <span class="app-timeline-title">Dispatched for delivery</span>
          <span class="app-timeline-meta">Today 14:12 PM</span>
          </div>
          <p class="app-timeline-text mb-0 mt-3">
          Package has left an Amazon facility , NY
          </p>
          </VTimelineItem>

          <VTimelineItem
          dot-color="secondary"
          size="x-small"
          >
          <div class="d-flex justify-space-between align-center">
          <span class="app-timeline-title">Delivery</span>
          </div>
          <p class="app-timeline-text mb-4 mt-3">
          Package will be delivered by tomorrow
          </p>
          </VTimelineItem>
          </VTimeline>
          </VCardText>
          </VCard>
        -->
      </VCol>

      <VCol
        cols="12"
        md="4"
      >
        <!-- 👉 Customer Details  -->
        <OrderDetailsCustomer :order="order" />

        <!-- 👉 Shipping Address -->
        <OrderDetailsShippingAddress :order="order" />

        <!-- 👉 Reminder Note -->
        <OrderDetailsNote :order="order" />

        <!-- 👉 Billing Address -->
        <!--
          <VCard>
          <VCardText>
          <div class="d-flex align-center justify-space-between mb-2">
          <h5 class="text-h5">
          Billing Address
          </h5>
          <div
          class="text-base font-weight-medium text-primary cursor-pointer"
          @click="isEditAddressDialogVisible = !isEditAddressDialogVisible"
          >
          Edit
          </div>
          </div>
          <div>
          45 Rocker Terrace <br> Latheronwheel <br> KW5 8NW, London <br> UK
          </div>

          <div class="mt-6">
          <h5 class="text-h5 mb-1">
          Mastercard
          </h5>
          <div class="text-body-1">
          Card Number: ******4291
          </div>
          </div>
          </VCardText>
          </VCard>
        -->
      </VCol>
    </VRow>
  </div>

  <!--
    <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    confirmation-question="Are you sure to delete this order?"
    confirmation-title="Confirm Delete"
    cancel-msg="Order cancelled!!"
    cancel-title="Cancelled"
    confirm-msg="Your order cancelled successfully."
    confirm-title="Cancelled!"
    />
  -->
</template>
