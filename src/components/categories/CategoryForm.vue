<script lang="ts" setup>
import { ModeType } from '@/interfaces/misc.interface'
import type { ItemCategory, ProductCategory } from '@/models/productCategory.model'
import { GetAllCategories } from '@/models/productCategory.model'
import { VForm } from 'vuetify/components/VForm'

interface Props {
  isOpen: boolean
  mode: ModeType
  title: string
  item?: ItemCategory
  currentCategories: ProductCategory[]
}

interface Emit {
  (e: 'update:isOpen', val: boolean): void
  (e: 'update:submit', itemCategory: ItemCategory): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

// Form
const refForm = ref<VForm>()
const name = ref<string>('')
const isActive = ref<boolean | undefined>(true)

const items = ref<{ title: string, value: string }[]>([])
const selectedItem = ref()

const { data: categories } = await GetAllCategories()

const initCategories = async () => {
  const currentCategoriesIds = new Set(props.currentCategories.map((category: ProductCategory) => category.id))
  const filteredCategories = categories.filter((category: ProductCategory) => !currentCategoriesIds.has(category.id))

  items.value = filteredCategories.map((category: ProductCategory) => ({ title: category.name, value: category.id }))
}

const onSave = async () => {
  const validated = await refForm.value?.validate()

  if (validated?.valid) {
    const selectedCategoryId = selectedItem.value.value
    const category = categories.find((cate: ProductCategory) => cate.id === selectedCategoryId)

    items.value = items.value.filter(({ value }: { value: string}) => value !== selectedCategoryId)

    emit('update:isOpen', false)
    emit('update:submit', category)

    setTimeout(() => {
      selectedItem.value = ''
    }, 500)
  }
}

watch(props, async () => {  
  if (props.mode === ModeType.CREATE) {
    name.value = ''
    await initCategories()
  }
  else
    if (props.item) {
      name.value = props?.item?.name
      isActive.value = props?.item?.is_active
    }
})
</script>

<template>
  <VDialog
    max-width="500"
    :model-value="isOpen"
    @update:model-value="emit('update:isOpen', $event)"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isOpen', false)" />

    <!-- Dialog Content -->
    <VCard :title="title">
      <VForm
        ref="refForm"
        @submit.prevent="onSave"
      >
        <VCardText>
          <!--
            <AppTextField
            v-model="name"
            :value="name"
            label="Category Name"
            placeholder="Category Name"
            :rules="[requiredValidator]"
            class="mb-2"
            />
          -->

          <AppCombobox
            v-model="selectedItem"
            :items="items"
            placeholder="Type some category..."
            :rules="[requiredValidator]"
          />

          <VSwitch
            v-if="mode === ModeType.EDIT"
            v-model="isActive"
            :label="isActive ? `Active` : `Inactive`"
          />
        </VCardText>

        <VCardText class="d-flex justify-end">
          <ButtonSave type="submit" />
          <!--
            <VBtn type="submit">
            Save
            </VBtn>
          -->
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
