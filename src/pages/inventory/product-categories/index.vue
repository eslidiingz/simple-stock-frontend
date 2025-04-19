<script setup lang="ts">
import type { TableOptions } from "@/interfaces/misc.interface";
import { ModeType } from "@/interfaces/misc.interface";
import {
  AddCategoryToCompany,
  DeleteProductCategory,
  type ProductCategory
} from "@/models/productCategory.model";
import { useDialogStore } from "@/stores/dialog";

const headers = [
	{ title: "Categories", key: "name", sortable: false },
	{ title: 'Products', key: '_count.products', sortable: false },
	{ title: "Status", key: "is_active", sortable: false, align: "center" },
	{ title: "Actions", key: "actions", sortable: false, align: "end" },
];

const mode = ref<ModeType>(ModeType.CREATE);
const productSelected = ref<ProductCategory>();

const searchQuery = ref<string>("");
const searchQueryDelay = ref<string>("");

// Data table options
const itemsPerPage = ref<number>(10);
const page = ref<number>(1);
const sortBy = ref<string>();
const orderBy = ref<string>();

// Modal & Notify
const dialog = useDialogStore();
const isToastVisible = ref<boolean>(false);
const toastText = ref<string>("");
const toastStatus = ref<string>("success");

const isAddProductModalOpen = ref<boolean>(false);
const isLoading = ref<boolean>(false);

// Update data table options
const updateOptions = (options: TableOptions) => {
	sortBy.value = options.sortBy[0]?.key;
	orderBy.value = options.sortBy[0]?.order;
};

const { data: categoriesData, execute: fetchCategories } = await useApi<any>(
	createUrl(`${BASE_API}/product-categories`, {
		query: {
			name: searchQueryDelay,
			page,
			limit: itemsPerPage,
			sortBy,
			orderBy,
		},
	}),
);

const categories = computed((): ProductCategory[] => categoriesData.value.data);
const totalItem = computed(() => categoriesData.value.pagination.total);

const onOpenModalCreateCategory = () => {
	mode.value = ModeType.CREATE;
	productSelected.value = undefined;
	isAddProductModalOpen.value = true;
};

const handleFormCategorySubmitted = async (
	category: ProductCategory,
): Promise<void> => {
	isLoading.value = true;

	if (mode.value === ModeType.CREATE) {
		const categoryAdded = await AddCategoryToCompany(category.id);
    const { message } = categoryAdded

    if ( !categoryAdded.success ) {
      dialog.error({ message });
      isLoading.value = false;
      return
    }

    dialog.show({ message });
	} 

  // else if (mode.value === ModeType.EDIT) {
	// 	const { message } = await UpdateProductCategory(productCategory);
	// 	dialog.show({ message });
	// }

	await fetchCategories();
	isLoading.value = false;
};

const onDelete = async (): Promise<void> => {
	if (productSelected.value?.id) {
		isLoading.value = true;

		const categoryDeleted = await DeleteProductCategory(
			productSelected.value?.id,
		);

		if (!categoryDeleted.success) {
      dialog.error({ message: categoryDeleted?.message?.data?.error });
      isLoading.value = false;
      return
    }    

    await fetchCategories();
    dialog.show({ message: categoryDeleted.message });
	}

	isLoading.value = false;
};

const openDialogConfirmDelete = async (product: ProductCategory): Promise<void> => {
	productSelected.value = product;

  dialog.showConfirm({
    message: "Are you sure you want to delete this category?",
    onConfirm: async () => {
      await onDelete()
    }
  });
};

const hasProductUsed = (productCategory: ProductCategory) => {
  if ( productCategory?._count === undefined || productCategory?._count?.products === undefined) 
    return false
  return productCategory._count.products > 0
}

let timer: any = null;

watch(searchQuery, (newValue) => {
	clearTimeout(timer);
	timer = setTimeout(() => {
		searchQueryDelay.value = newValue;
	}, 500); // 2 seconds delay
});
</script>

<template>
  <div>
    <!-- 👉 categories -->
    <VCard>
      <div class="d-flex flex-wrap gap-4 ma-6">
        <div class="d-flex align-center">
          <!-- 👉 Search  -->
          <!-- v-model="searchQuery" -->
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Category"
            style="max-inline-size: 280px; min-inline-size: 280px;"
            class="me-3"
          />
        </div>

        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
          <div class="d-flex align-center">
            <div class="text-caption me-2">Items per page:</div>
            <AppSelect
              v-model="itemsPerPage"
              :items="selectItemsPerPage"
            />
          </div>

          <VBtn
            color="primary"
            prepend-icon="tabler-plus"
            @click="onOpenModalCreateCategory"
          >
            Add Category
          </VBtn>

          <CategoryForm
            v-model:isOpen="isAddProductModalOpen"
            :mode="mode"
            :title="mode === ModeType.EDIT ? 'Edit Category' : 'Add Category'"
            :item="productSelected"
            :current-categories="categories"
            @update:submit="category => handleFormCategorySubmitted(category)"
          />
        </div>
      </div>

      <VDivider class="mt-4" />

      <!-- 👉 Datatable  -->
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="categories"
        :items-length="totalItem"
        :loading="isLoading"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <template #item.name="{ item }">
          <div class="text-capitalize">
            {{ item.name }}
          </div>
        </template>

        <!-- Active -->
        <template #item.is_active="{ item }">
          <IsActiveLabel :is-active="item.is_active" />
        </template>

        <!-- Actions -->
        
        <template #item.actions="{ item }">
          <IconBtn
            @click="openDialogConfirmDelete(item)"
            :disabled="hasProductUsed(item)"
          >
            <VIcon
            icon="tabler-trash"
            size="22"
            />
          </IconBtn>
        </template>
       

        <!-- pagination -->
        <template #bottom>
          <TablePagination
            v-model:page="page"
            :items-per-page="itemsPerPage"
            :total-items="totalItem"
          />
        </template>
      </VDataTableServer>
    </VCard>
  </div>

  <Toast
    v-model:visible="isToastVisible"
    :text="toastText"
    :status="toastStatus"
  />
</template>
