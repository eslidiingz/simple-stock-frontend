<script setup lang="ts">
import type { Order } from '@/models/order.model';

interface Props {
  order: Order
}

const props = defineProps<Props>()

const data = props.order.details
const subTotal = props.order.details.reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
const shipping = props.order.shipping
const total = props.order.grand_total

// const data = computed(() => props.order.details)
// const subTotal = computed(() => sale.items.reduce((acc, cur) => acc + cur.price * cur.quantity, 0))
// const discount = computed(() => 0)
// const shipping = computed(() => sale.paymentMethod.fee || 0)
// const total = computed(() => sale.items.reduce((acc, cur) => acc + cur.price * cur.quantity, 0) + shipping.value)

// const isToastVisible = ref<boolean>(false)
// const toastText = ref<string>('')
// const toastStatus = ref<string>('success')

// const props = defineProps({
//   orderDetails: {
//     type: Array,
//     required: true,
//   },
// })

// const data = computed(() => sale.items)

const headers = [
  { title: 'Product', key: 'product', sortable: false },
  { title: 'Price', key: 'price', sortable: false, align: 'end' },
  { title: 'Quantity', key: 'quantity', sortable: false, align: 'end' },
  { title: 'Total', key: 'total', sortable: false, align: 'end' },
]
</script>

<template>
  <VCard class="mb-6">
    <VCardItem>
      <template #title>
        <h5 class="text-h5">
          Order Details
        </h5>
      </template>
      <!-- <template #append>
        <div class="text-base font-weight-medium text-primary cursor-pointer">
          Edit
        </div>
      </template> -->
    </VCardItem>

    <VDivider />

    <VDataTable
      :headers="headers"
      :items="data"
    >
      <template #item.product="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VAvatar
            v-if="item.product.thumbnail"
            size="38"
            variant="tonal"
            rounded
            :image="imageUrl(item.product.thumbnail)"
          />

          <div class="d-flex flex-column">
            <span class="text-body-1 font-weight-medium text-high-emphasis">{{ item.name }}</span>
            <div class="text-body-2">
              <span>{{ item.productBrand }}</span>
              <span class="text-caption">{{ item.code }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #item.price="{ item }">
        {{ formatNumber(item.price) }}
      </template>

      <template #item.quantity="{ item }">
        {{ item.quantity }}
      </template>

      <template #item.total="{ item }">
        {{ formatNumber(item.price * item.quantity) }}
      </template>

      <template #item.action="{ item }">
        <IconBtn @click="sale.removeItem(item)">
          <VIcon
            icon="tabler-trash"
            color="error"
          />
        </IconBtn>
      </template>

      <template #bottom />
    </VDataTable>

    <VDivider />

    <VCardText>
      <div class="d-flex align-end flex-column">
        <table class="text-high-emphasis">
          <tbody>
            <tr>
              <td width="200px">
                Subtotal:
              </td>
              <td class="font-weight-medium text-right">
                {{ formatNumber(subTotal) }}
              </td>
            </tr>
            <!--
              <tr>
              <td class="text-high-emphasis font-weight-medium">
              Discount:
              </td>
              <td class="font-weight-medium text-right">
              {{ discount }}
              </td>
              </tr>
            -->
            <tr>
              <td>Shipping: </td>
              <td class="font-weight-medium text-right">
                {{ formatNumber(shipping) }}
              </td>
            </tr>
            <tr>
              <td class="text-high-emphasis font-weight-medium">
                Total:
              </td>
              <td class="font-weight-medium text-right">
                {{ formatNumber(total) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCardText>
  </VCard>
</template>
