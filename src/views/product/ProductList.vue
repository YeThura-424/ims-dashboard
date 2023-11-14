<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3"> Product Master </span>
      </template>
    </el-page-header>
  </div>
  <div class="main-container">
    <div class="main-contant">
      <!-- <el-card class="box-card dashboard-card"> -->
      <div class="card">
        <DataTable
          class="p-datatable-sm"
          v-model:filters="filters"
          :value="products.products"
          showGridlines
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 20, 30]"
          stripedRows
          scrollable
          scrollHeight="400px"
          tableStyle="min-width: 50rem"
        >
          <template #header>
            <div class="flex justify-content-end">
              <el-button type="primary" :icon="CirclePlus" @click="addNew"
                >Add New</el-button
              >
              <el-input
                v-model="filters['global'].value"
                placeholder="Type something"
                :prefix-icon="Search"
                class="table-search-input"
              />
            </div>
          </template>
          <template #empty> No Product found. </template>
          <Column header="#" headerStyle="width:3rem">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column field="product_name" header="Name" sortable></Column>
          <Column field="product_code" header="Code"></Column>
          <Column header="Image">
            <template #body="slotProps">
              <img
                :src="slotProps.data.product_photo"
                :alt="slotProps.data.image"
                class="shadow-2 border-round"
                style="width: 64px"
              />
            </template>
          </Column>
          <Column field="product_uom" header="Product UOM"></Column>
          <Column field="product_sku" header="Product SKU"></Column>
          <Column field="product_qty" header="Quantity"></Column>
          <Column :exportable="false" style="min-width: 8rem" header="Action">
            <template #body="slotProps">
              <el-button
                type="warning"
                :icon="Edit"
                circle
                @click="editProduct(slotProps.data)"
              />

              <el-button
                type="danger"
                :icon="Delete"
                circle
                @click="deleteProduct(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
      <!-- </el-card> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { FilterMatchMode } from "primevue/api";
import router from "@/router";
import { Delete, Edit, CirclePlus, Search } from "@element-plus/icons-vue";
import { useProductStore } from "../../store/product";
import { ElNotification } from "element-plus";

const onBack = () => {
  router.push({
    name: "Dashboard",
  });
};
const products = useProductStore();
const message = products.notification;
onMounted(() => {
  products.getProducts();
  if (message) {
    console.log(message);
    ElNotification.success({
      title: "Success",
      message: message,
      type: "success",
    });
  }
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const addNew = () => {
  router.push({
    name: "ProductAdd",
  });
};
const editProduct = async (prod) => {
  await products.getProduct(prod.product_id);
  router.push({
    name: "ProductEdit",
    params: { id: prod.product_id },
  });
};

const deleteProduct = async (prod) => {
  const data = await products.deleteProduct(prod.product_id);
  ElNotification.success({
    title: "Success",
    message: data.message,
    type: "success",
  });
};
</script>
<style></style>
