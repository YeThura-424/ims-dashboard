<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3"> Sale Invoice Master </span>
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
          :value="saleStore.sales"
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
          <template #empty> No Sale found. </template>
          <Column header="No" headerStyle="width:3rem">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column field="sale_date" header="Sale Date" sortable></Column>
          <Column field="sale_code" header="Sale Code"></Column>
          <Column field="sale_total_amount" header="Total Amount"></Column>

          <Column :exportable="false" style="min-width: 8rem" header="Action">
            <template #body="slotProps">
              <el-button
                type="warning"
                :icon="Edit"
                circle
                @click="editProduct(slotProps.data)"
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
import { useMRNStore } from "../../store/materialreceiptnote";
import { useSaleStore } from "../../store/sale";
import { ElNotification } from "element-plus";

const onBack = () => {
  router.push({
    name: "Dashboard",
  });
};
const mrnStore = useMRNStore();
const saleStore = useSaleStore();
const message = mrnStore.notification;

const storeDataInLocalStorage = (data) => {
  try {
    const sales = JSON.stringify(data);
    localStorage.setItem("sales", sales);
  } catch (error) {
    alert("Error Occured!!");
  }
};
onMounted(async () => {
  saleStore.getSales();

  const saleData = saleStore.sales;

  if (saleData.length > 0) {
    storeDataInLocalStorage(saleData);
  }
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
    name: "SaleAdd",
  });
};
const editProduct = async (prod) => {
  await saleStore.getSale(prod.sale_id);
  router.push({
    name: "SaleEdit",
    params: { id: prod.sale_id },
  });
};

// const deleteProduct = async (prod) => {
//   const data = await mrnStore.deleteImport(prod.import_id);
//   ElNotification.success({
//     title: "Success",
//     message: data.message,
//     type: "success",
//   });
// };
</script>
<style></style>
