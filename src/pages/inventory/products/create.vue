<script setup lang="ts">
import type { VForm } from 'vuetify/components/VForm'
import type { ProductCategory } from '@/models/productCategory.model'
import { GetProductCategories } from '@/models/productCategory.model'
import type { ProductCreate } from '@/models/product.model'
import { CreateProduct } from '@/models/product.model'

const dropZoneRef = ref<HTMLDivElement>()
interface FileData {
  file: File
  url: string
}

interface ProductFormObject {
  name: string | undefined
  category_id: string | undefined
  description?: string | undefined
  code?: string | undefined
  price?: number | undefined
  image: File | undefined
}

const categoryParams = { is_active: true }
const { data: categoriesData } = await GetProductCategories(categoryParams)
const categories = computed(() => categoriesData.map((category: ProductCategory) => ({ title: category.name[0].toLocaleUpperCase() + category.name.slice(1), value: category.id })))

const refForm = ref<VForm>()

const form = ref<ProductFormObject>({
  name: undefined,
  category_id: undefined,
  description: undefined,
  code: undefined,
  price: undefined,
  image: undefined,
})

const selectedFile = ref(null)
const selectedFileName = ref(null)

const errors = ref()

const isSnackbarVisible = ref<boolean>(false)
const snackbarText = ref<string>('')

const fileData = ref<FileData[]>([])
const { onChange } = useFileDialog({ accept: 'image/*' })

function onDrop(DroppedFiles: File[] | null) {
  DroppedFiles?.forEach(file => {
    if (file.type.slice(0, 6) !== 'image/') {
      // eslint-disable-next-line no-alert
      alert('Only image files are allowed')

      return
    }

    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? '',
    })
  },
  )
}

onChange(selectedFiles => {
  if (!selectedFiles)
    return

  for (const file of selectedFiles) {
    fileData.value.push({
      file,
      url: useObjectUrl(file).value ?? '',
    })
  }
})

useDropZone(dropZoneRef, onDrop)

const handleFileChange = event => {
  selectedFile.value = event.target.files[0]
}

const resetForm = () => {
  form.value = {
    name: '',
    category_id: undefined,
    description: undefined,
    code: undefined,
    price: undefined,
    image: undefined,
  }

  selectedFileName.value = null

  errors.value = {}
}

const handleSubmit = async () => {
  // const validated = await refForm.value?.validate()

  const data: ProductCreate = {
    ...form.value,
    price: Number(form.value.price) || 0,
    image: selectedFile.value === null ? undefined : selectedFile.value,
  }

  const created = await CreateProduct(data)

  if (created.error) {
    errors.value = {}

    const errorData = created.error.errors

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
    snackbarText.value = created.message
    isSnackbarVisible.value = true

    resetForm()
  }
}
</script>

<template>
  <ProductForm />
</template>
