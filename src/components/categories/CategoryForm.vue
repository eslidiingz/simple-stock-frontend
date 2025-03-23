<script lang="ts" setup>
import { VForm } from 'vuetify/components/VForm'
import { ModeType } from '@/interfaces/misc.interface'
import type { ItemCategory } from '@/models/productCategory.model'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

interface Props {
  isOpen: boolean
  mode: ModeType
  title: string
  item?: ItemCategory
}

interface Emit {
  (e: 'update:isOpen', val: boolean): void
  (e: 'update:submit', itemCategory: ItemCategory): void
}

const { isOpen, mode = ModeType.CREATE, title } = toRefs(props)

// Form
const refForm = ref<VForm>()
const name = ref<string>('')
const isActive = ref<boolean | undefined>(true)

const onSave = async () => {
  const validated = await refForm.value?.validate()

  if (validated?.valid) {
    emit('update:isOpen', false)
    emit('update:submit', { id: props.item?.id, name: name.value, is_active: isActive.value })
  }
}

watch(props, () => {
  if (props.mode === ModeType.CREATE) {
    name.value = ''
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
          <AppTextField
            v-model="name"
            :value="name"
            label="Category Name"
            placeholder="Category Name"
            :rules="[requiredValidator]"
            class="mb-2"
          />

          <VSwitch
            v-if="mode === ModeType.EDIT"
            v-model="isActive"
            :label="isActive ? `Active` : `Inactive`"
          />
        </VCardText>

        <VCardText class="d-flex justify-end">
          <VBtn type="submit">
            Save
          </VBtn>
        </VCardText>
      </VForm>
    </VCard>
  </VDialog>
</template>
