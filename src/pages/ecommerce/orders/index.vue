<script setup lang="ts">
import { resolveOrderPaymentStatus, resolveOrderStatus } from '@/models/order.model'
import type { Order } from '@db/apps/ecommerce/types'
import masterCardDark from '@images/icons/payments/img/master-dark.png'
import masterCardLight from '@images/icons/payments/img/mastercard.png'
import paypalDark from '@images/icons/payments/img/paypal-dark.png'
import paypalLight from '@images/icons/payments/img/paypal-light.png'

// import { formatNumber } from '../../utils/number'
// import { formatDate } from '../../utils/date'

// Data table options
const searchQuery = ref('')
const itemsPerPage = ref<number>(10)
const page = ref<number>(1)
const sortBy = ref<string>()
const orderBy = ref<string>()

// Fetch Orders
const { data: ordersData, execute: fetchOrders } = await useApi<any>(createUrl(`${BASE_API}/orders`, {
  query: {
    q: searchQuery,
    page,
    limit: itemsPerPage,
    sortBy,
    orderBy,
  },
}))

const orders = computed((): Order[] => ordersData.value.data)
const totalItem = computed(() => ordersData.value.pagination.total)

const widgetData = ref([
  { title: 'Pending Payment', value: 56, icon: 'tabler-calendar-stats' },
  { title: 'Completed', value: 12689, icon: 'tabler-checks' },
  { title: 'Refunded', value: 124, icon: 'tabler-wallet' },
  { title: 'Failed', value: 32, icon: 'tabler-alert-octagon' },
])

const mastercard = useGenerateImageVariant(masterCardLight, masterCardDark)
const paypal = useGenerateImageVariant(paypalLight, paypalDark)

// Data table Headers
const headers = [
  { title: 'Order', key: 'order' },
  { title: 'Product', key: 'product' },
  { title: 'Price', key: 'grand_total' },
  { title: 'Customers', key: 'customers' },
  { title: 'Payment', key: 'payment', sortable: false },
  { title: 'Status', key: 'status' },
  { title: 'Method', key: 'method', sortable: false },

  // { title: 'Action', key: 'actions', sortable: false },
]

// Update data table options
const updateOptions = (options: any) => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Delete Orders
const deleteOrder = async (id: number) => {
  await $api(`/apps/ecommerce/orders/${id}`, {
    method: 'DELETE',
  })
  fetchOrders()
}
</script>

<template>
  <div>
    <VCard class="mb-6">
      <!-- 👉 Widgets  -->
      <VCardText>
        <VRow>
          <template
            v-for="(data, id) in widgetData"
            :key="id"
          >
            <VCol
              cols="12"
              sm="6"
              md="3"
              class="px-6"
            >
              <div
                class="d-flex justify-space-between"
                :class="$vuetify.display.xs
                  ? id !== widgetData.length - 1 ? 'border-b pb-4' : ''
                  : $vuetify.display.sm
                    ? id < (widgetData.length / 2) ? 'border-b pb-4' : ''
                    : ''"
              >
                <div class="d-flex flex-column">
                  <h4 class="text-h4">
                    {{ data.value }}
                  </h4>

                  <div class="text-body-1">
                    {{ data.title }}
                  </div>
                </div>

                <VAvatar
                  variant="tonal"
                  rounded
                  size="42"
                >
                  <VIcon
                    :icon="data.icon"
                    size="26"
                    class="text-high-emphasis"
                  />
                </VAvatar>
              </div>
            </VCol>
            <VDivider
              v-if="$vuetify.display.mdAndUp ? id !== widgetData.length - 1
                : $vuetify.display.smAndUp ? id % 2 === 0
                  : false"
              vertical
              inset
              length="60"
            />
          </template>
        </VRow>
      </VCardText>
    </VCard>

    <VCard>
      <!-- 👉 Filters -->
      <VCardText>
        <div class="d-flex justify-sm-space-between justify-start flex-wrap gap-4">
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Order"
            style=" max-inline-size: 200px; min-inline-size: 200px;"
          />

          <div class="d-flex gap-x-4 align-center">
            <AppSelect
              v-model="itemsPerPage"
              style="min-inline-size: 6.25rem;"
              :items="[5, 10, 20, 50, 100]"
            />
            <VBtn
              variant="tonal"
              color="secondary"
              prepend-icon="tabler-upload"
              text="Export"
            />
          </div>
        </div>
      </VCardText>

      <VDivider />

      <!-- 👉 Order Table -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="orders"
        item-value="order"
        :items-length="totalItem"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- Order ID -->
        <template #item.order="{ item }">
          <RouterLink :to="{ name: 'ecommerce-orders-id', params: { id: item.id } }">
            {{ item.code }}
          </RouterLink>
          <small class="d-block">
            {{ formatDate(item.created_at) }}
          </small>
        </template>

        <!-- Date -->
        <template #item.product="{ item }">
          <small class="d-block">{{ item.product_count }} Product</small>
          <small class="d-block">{{ item.product_count_items }} Items</small>
        </template>

        <!-- Order price -->
        <template #item.price="{ item }">
          {{ formatNumber(item.grand_total) }}
        </template>

        <!-- Customers  -->
        <template #item.customers="{ item }">
          <div class="d-flex align-center gap-x-3">
            <div class="d-flex flex-column">
              <div class="text-body-1 font-weight-black">
                <VIcon
                  icon="tabler-user"
                  size="16"
                /> {{ item.receiver_name }}
              </div>
              <div class="text-body-2">
                <VIcon
                  icon="tabler-phone"
                  size="16"
                /> {{ item.receiver_phone }}
              </div>
            </div>
          </div>
        </template>

        <!-- Payments -->
        <template #item.payment="{ item }">
          <div
            :class="`text-${resolveOrderPaymentStatus(item.payment_status)?.color}`"
            class="font-weight-medium d-flex align-center gap-x-2"
          >
            <VIcon
              icon="tabler-circle-filled"
              size="10"
            />
            <div style="line-height: 22px;">
              {{ resolveOrderPaymentStatus(item.payment_status)?.text }}
            </div>
          </div>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip
            v-bind="resolveOrderStatus(item.status)"
            label
            size="small"
          />
        </template>

        <!-- Method -->
        <template #item.method="{ item }">
          <div class="d-flex align-center">
            {{ item.payment_code }}
          </div>
        </template>

        <!-- Actions -->
        <!--
          <template #item.actions="{ item }">
          <IconBtn>
          <VIcon icon="tabler-dots-vertical" />
          <VMenu activator="parent">
          <VList>
          <VListItem
          value="view"
          :to="{ name: 'apps-ecommerce-order-details-id', params: { id: item.order } }"
          >
          View
          </VListItem>
          <VListItem
          value="delete"
          @click="deleteOrder(item.id)"
          >
          Delete
          </VListItem>
          </VList>
          </VMenu>
          </IconBtn>
          </template>
        -->

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalOrder"
          />
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
.customer-title:hover {
  color: rgba(var(--v-theme-primary)) !important;
}

.product-widget {
  border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}
</style>
