<script setup lang="ts">
import { useSaleStore } from '@/stores/sale'
import { useToastStore } from '@/stores/toast'
import { CreateSaleOrder } from '../../models/order.model'

const sale = useSaleStore()
const toast = useToastStore()

const data = computed(() => sale.items)
const subTotal = computed(() => sale.items.reduce((acc, cur) => acc + cur.price * cur.quantity, 0))
const discount = computed(() => 0)
const shipping = computed(() => sale.paymentMethod.fee || 0)
const total = computed(() => sale.items.reduce((acc, cur) => acc + cur.price * cur.quantity, 0) + shipping.value)

// const isToastVisible = ref<boolean>(false)
// const toastText = ref<string>('')
// const toastStatus = ref<string>('success')

const headers = [
  { title: 'Product', key: 'product', sortable: false },
  { title: 'Price', key: 'price', sortable: false },
  { title: 'Quantity', key: 'quantity', sortable: false },
  { title: 'Total', key: 'total', sortable: false },
  { title: 'Action', key: 'action', sortable: false },
]

const onCheckout = async () => {
  const saleOrder = sale.$state
  const saleOrderCreated = await CreateSaleOrder(saleOrder)

  if (saleOrderCreated.success) {
    toast.setMessage(saleOrderCreated.message).show()
    sale.$reset()
  }
}
</script>

<template>
  <VCard class="mb-4">
    <VCardItem>
      <template #title>
        <h5 class="text-h5">
          Order Details
        </h5>
      </template>
    </VCardItem>
    <VDivider />

    <VDataTable
      :headers="headers"
      :items="data"
    >
      <template #item.product="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VAvatar
            v-if="item.thumbnail"
            size="38"
            variant="tonal"
            rounded
            :image="imageUrl(item.thumbnail)"
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

      <template #item.quantity="{ item }">
        <AppTextField
          v-model.number="item.quantity"
          type="number"
          min="1"
          :max="item.stock"
          style="inline-size: 100px;"
        />
      </template>

      <template #item.total="{ item }">
        {{ item.price * item.quantity }}
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
                {{ subTotal }}
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
                {{ shipping }}
              </td>
            </tr>
            <tr>
              <td class="text-high-emphasis font-weight-medium">
                Total:
              </td>
              <td class="font-weight-medium text-right">
                {{ total }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCardText>

    <VDivider />

    <VCardFooter>
      <VCardItem class="d-flex justify-end">
        <VBtn @click="onCheckout">
          <VIcon
            start
            icon="tabler-shopping-cart-dollar"
          />
          Checkout
        </VBtn>
      </VCardItem>
    </VCardFooter>
  </VCard>
</template>
