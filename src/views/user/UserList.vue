<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3"> User Master </span>
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
          :value="products"
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
              <el-button type="primary" :icon="CirclePlus">Add New</el-button>
              <el-input
                v-model="filters['global'].value"
                placeholder="Type something"
                :prefix-icon="Search"
                class="table-search-input"
              />
            </div>
          </template>
          <template #empty> No Vendor found. </template>
          <Column field="code" header="Code" sortable></Column>
          <Column field="name" header="Name"></Column>
          <Column field="category" header="Category"></Column>
          <Column field="quantity" header="Quantity"></Column>
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
import { ElNotification as notify } from "element-plus";
import { ArrowLeft } from "@element-plus/icons-vue";
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { FilterMatchMode } from "primevue/api";
import { Delete, Edit, CirclePlus, Search } from "@element-plus/icons-vue";
const onBack = () => {
  notify("Back");
};
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const products = [
  {
    code: "00001",
    name: "Rathan",
    category: "Cate1",
    quantity: 1,
  },
  {
    code: "00002",
    name: "Product2",
    category: "Cate2",
    quantity: 2,
  },
  {
    code: "00003",
    name: "Product3",
    category: "Cate3",
    quantity: 3,
  },
];

const editProduct = (prod) => {
  console.log(prod);
};

const deleteProduct = (prod) => {
  console.log(prod);
};
</script>
<style></style>
