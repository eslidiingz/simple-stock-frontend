<script lang="ts" setup>
import { VForm } from 'vuetify/components/VForm'
import { ModeType } from '@/interfaces/misc.interface'
import type { Product, ProductCreate, ProductUpdate } from '@/models/product.model'
import { CreateProduct, UpdateProduct } from '@/models/product.model'
import type { ProductCategory } from '@/models/productCategory.model'
import { GetProductCategories } from '@/models/productCategory.model'

interface Props {
  mode?: ModeType
  product?: Product
}

const props = defineProps<Props>()

const product = ref(props.product || {} as Product)

// const product = computed(() => props.product)
const mode = computed(() => props.mode || ModeType.CREATE)

interface ProductFormObject {
  name: string | undefined
  category_id: string | undefined
  description?: string | undefined
  code?: string | undefined
  price?: number | undefined
  image: File | undefined
  is_active?: boolean
}

const refForm = ref<VForm | null>(null)

const form = ref<ProductFormObject>({
  name: product.value?.name || undefined,
  category_id: product.value?.category_id || undefined,
  description: product.value?.description || undefined,
  code: product.value?.code || undefined,
  price: product.value?.price || undefined,
  image: product.value?.image || undefined,
  is_active: product.value ? product.value?.is_active : true,
})

const selectedFile = ref(null)
const selectedFileName = ref(null)

const categoryParams = { is_active: true }
const { data: categoriesData } = await GetProductCategories(categoryParams)
const categories = computed(() => categoriesData.map((category: ProductCategory) => ({ title: category.name[0].toLocaleUpperCase() + category.name.slice(1), value: category.id })))

const errors = ref()

const isToastVisible = ref<boolean>(false)
const toastText = ref<string>('')
const toastStatus = ref<string>('success')

/** Handler functions */
const handleFileChange = event => {
  selectedFile.value = event.target.files[0]
}

const resetForm = () => {
  form.value = {
    name: undefined,
    category_id: undefined,
    description: undefined,
    code: undefined,
    price: undefined,
    image: undefined,
  }

  selectedFileName.value = null

  errors.value = {}
}

const handleCreateProduct = async () => {
  const data: ProductCreate = {
    ...form.value,
    price: Number(form.value.price) || 0,
    image: selectedFile.value === null ? undefined : selectedFile.value,
  }

  const created = await CreateProduct(data)

  console.log('%c%s', 'background: #04b8f4; color: #000000', '🚀 ~ handleCreateProduct ~ created:', created)
  if (created.error) {
    errors.value = {}

    const errorData = created.error.data.errors

    const _errors = {}

    errorData.forEach(({ path, schema, summary }) => {
      const key = path.substr(1, path.length)
      const text = summary

      if (schema?.default === undefined) {
        if (!_errors[key])
          _errors[key] = text
      }
    })

    errors.value = _errors
  }

  if (created.success) {
    toastText.value = created.message
    isToastVisible.value = true

    resetForm()
  }
}

const handleUpdateProduct = async () => {
  const data: ProductUpdate = {
    ...form.value,
    price: Number(form.value.price) || 0,
    image: selectedFile.value === null ? undefined : selectedFile.value,
  }

  const updated = await UpdateProduct(product.value.id, data)

  if (updated.error) {
    errors.value = {}

    const errorData = updated.error.errors

    const _errors = {}

    errorData.forEach(({ path, schema, summary }) => {
      const key = path.substr(1, path.length)
      const text = summary

      if (schema?.default === undefined) {
        if (!_errors[key])
          _errors[key] = text
      }
    })

    errors.value = _errors
  }

  if (updated.success) {
    toastText.value = updated.message
    isToastVisible.value = true
  }
}

const handleSubmit = async () => {
  if (mode.value === ModeType.EDIT)
    await handleUpdateProduct()
  else
    await handleCreateProduct()
}
</script>

<template>
  <VForm
    ref="refForm"
    @submit.prevent="handleSubmit"
  >
    <div>
      <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
        <div class="d-flex flex-column justify-center">
          <h4 class="text-h4 font-weight-medium">
            {{ mode === ModeType.CREATE ? 'Add new' : 'Edit' }} a product
          </h4>
          <div class="text-body-1">
            Orders placed across your store
          </div>
        </div>

        <div class="d-flex gap-4 align-center flex-wrap">
          <VBtn
            variant="tonal"
            color="secondary"
            @click="$router.push('/inventory/products')"
          >
            Discard
          </VBtn>
          <VBtn type="submit">
            <VIcon
              icon="tabler-device-floppy"
              size="20"
              class="me-1"
            />
            Save
          </VBtn>
        </div>
      </div>

      <VRow>
        <VCol md="8">
          <!-- 👉 Product Information -->
          <VCard
            class="mb-6"
            title="Product Information"
          >
            <VCardText>
              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="form.name"
                    label="Name"
                    placeholder="Product name"
                    required
                    :error-messages="errors?.name"
                  />
                </VCol>
                <!--
                  <VCol
                  cols="12"
                  md="6"
                  >
                  <AppTextField
                  label="SKU"
                  placeholder="FXSK123U"
                  />
                  </VCol>
                -->

                <VCol
                  cols="12"
                  md="6"
                >
                  <!-- Category filter -->
                  <AppSelect
                    v-model="form.category_id"
                    label="Category"
                    placeholder="Category"
                    :items="categories"
                    clearable
                    clear-icon="tabler-x"
                    required
                    :error-messages="errors?.category_id"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.code"
                    label="Barcode"
                    placeholder="01234567890"
                  />
                </VCol>
                <VCol>
                  <span class="mb-1">Description (optional)</span>
                  <ProductDescriptionEditor
                    v-model="form.description"
                    placeholder="Product Description"
                    class="border rounded"
                  />
                </VCol>

                <VCol cols="12">
                  <div class="mb-3">
                    <VAvatar
                      v-if="product?.image"
                      size="128"
                      variant="tonal"
                      rounded
                      :image="imageUrl(product?.image)"
                    />
                  </div>

                  <AppTextField
                    v-model="selectedFileName"
                    type="file"
                    label="Image"
                    accept="image/jpg, image/jpeg, image/png, image/webp"
                    @change="handleFileChange"
                  />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>

        <VCol
          md="4"
          cols="12"
        >
          <!-- 👉 Pricing -->
          <VCard
            title="Pricing"
            class="mb-6"
          >
            <VCardText>
              <AppTextField
                v-model="form.price"
                label="Best Price"
                placeholder="Price"
                class="mb-6"
              />

              <VSwitch
                v-model="form.is_active"
                :label="form.is_active ? `Active` : `Inactive`"
              />

              <!--
                <AppTextField
                label="Discounted Price"
                placeholder="$499"
                class="mb-6"
                />
              -->

              <!--
                <VCheckbox
                v-model="isTaxChargeToProduct"
                label="Charge Tax on this product"
                />

                <VDivider class="my-2" />

                <div class="d-flex flex-raw align-center justify-space-between ">
                <span>In stock</span>
                <VSwitch density="compact" />
                </div>
              -->
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VForm>

  <Toast
    v-model:visible="isToastVisible"
    :text="toastText"
    :status="toastStatus"
  />
</template>

<style lang="scss" scoped>
  .drop-zone {
    border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
    border-radius: 6px;
  }
</style>

<style lang="scss">
.inventory-card {
  .v-tabs.v-tabs-pill {
    .v-slide-group-Product--active.v-tab--selected.text-primary {
      h6 {
        color: #fff !important;
      }
    }
  }

  .v-radio-group,
  .v-checkbox {
    .v-selection-control {
      align-products: start !important;
    }

    .v-label.custom-input {
      border: none !important;
    }
  }
}
</style>
