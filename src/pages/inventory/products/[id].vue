<script setup lang="ts">
import ProductForm from '@/components/product/ProductForm.vue'
import { ModeType } from '@/interfaces/misc.interface'
import type { ProductUpdate } from '@/models/product.model'
import { FindProduct, UpdateProduct } from '@/models/product.model'

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

const route = useRoute()
const productId = computed(() => route.params.id)
const { product } = await FindProduct(productId.value)

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

  const data: ProductUpdate = {
    ...form.value,
    price: Number(form.value.price) || 0,
    image: selectedFile.value === null ? undefined : selectedFile.value,
  }

  const updated = await UpdateProduct(productId.value, data)

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
    snackbarText.value = updated.message
    isSnackbarVisible.value = true

    // resetForm()
  }
}
</script>

<template>
  <ProductForm
    :product="product"
    :mode="ModeType.EDIT"
  />
</template>
