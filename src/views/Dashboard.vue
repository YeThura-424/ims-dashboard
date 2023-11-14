<template>
  <div class="main-container">
    <div class="main-contant">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card">
            <div class="minimum_product">
              <DataTable
                class="p-datatable-sm"
                :value="dashboardStore.minimumProduct"
                showGridlines
                paginator
                :rows="10"
                :rowsPerPageOptions="[10, 20, 30]"
                stripedRows
                scrollable
                scrollHeight="300px"
              >
                <template #header>
                  <div class="flex justify-content-end">
                    <span class="text-large font-600 mr-3">
                      Minimum Product List
                    </span>
                    <el-button type="primary" @click="productMaster"
                      >Product Master</el-button
                    >
                  </div>
                </template>
                <template #empty> No Product found. </template>
                <Column header="No" headerStyle="width:3rem">
                  <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                  </template>
                </Column>
                <Column
                  field="product_sku"
                  header="Product SKU"
                  sortable
                ></Column>
                <Column field="product_code" header="Code"></Column>
                <Column field="product_qty" header="Quantity"></Column>
              </DataTable>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div class="today_sale">
              <DataTable
                class="p-datatable-sm"
                :value="dashboardStore.todaySale"
                showGridlines
                paginator
                :rows="10"
                :rowsPerPageOptions="[10, 20, 30]"
                stripedRows
                scrollable
                scrollHeight="300px"
              >
                <template #header>
                  <div class="flex justify-content-end">
                    <span class="text-large font-600 mr-3"> Today Sales </span>
                    <el-button type="primary" @click="saleMaster"
                      >Sale Master</el-button
                    >
                  </div>
                </template>
                <template #empty> No sale found. </template>
                <Column header="No" headerStyle="width:3rem">
                  <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                  </template>
                </Column>
                <Column field="sale_code" header="Sale Code" sortable></Column>
                <Column
                  field="sale_total_amount"
                  header="Total Amount"
                ></Column>
              </DataTable>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from "../store/dashboard";
import { onMounted } from "vue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import router from "@/router";

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.getMinimumProduct();
  dashboardStore.getTodaySale();
});

const productMaster = () => {
  router.push({
    name: "ProductList",
  });
};
const saleMaster = () => {
  router.push({
    name: "SaleList",
  });
};
</script>
