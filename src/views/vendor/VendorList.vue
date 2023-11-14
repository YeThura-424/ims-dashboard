<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3"> Vendor Master </span>
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
          :value="vendorStore.vendors"
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
              <el-button type="primary" :icon="CirclePlus" @click="vendorAdd"
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
          <template #empty> No Vendor found. </template>
          <Column header="#" headerStyle="width:3rem">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column field="vendor_name" header="Vendor Name"></Column>
          <Column field="vendor_code" header="Vendor Code" sortable></Column>
          <Column field="vendor_type" header="Vendor Type"></Column>
          <Column field="vendor_is_active" header="Status"></Column>
          <Column field="vendor_payment_type" header="Payment Type"></Column>
          <Column :exportable="false" style="min-width: 8rem" header="Action">
            <template #body="slotProps">
              <el-button
                type="warning"
                :icon="Edit"
                circle
                @click="editVendor(slotProps.data)"
              />

              <el-button
                type="danger"
                :icon="Delete"
                circle
                @click="deleteVendor(slotProps.data)"
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
import { ref, onMounted } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { FilterMatchMode } from "primevue/api";
import { Delete, Edit, CirclePlus, Search } from "@element-plus/icons-vue";
import router from "@/router";
import { ElNotification } from "element-plus";
import { useVendorStore } from "@/store/vendor";

const onBack = () => {
  router.push({
    name: "Dashboard",
  });
};
const vendorStore = useVendorStore();
const message = vendorStore.notification;
onMounted(() => {
  vendorStore.getVendors();
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

const editVendor = async (prod) => {
  await vendorStore.getVendor(prod.vendor_id);
  router.push({
    name: "VendorEdit",
    params: { id: prod.vendor_id },
  });
};

const deleteVendor = async (prod) => {
  const data = await vendorStore.deleteVendor(prod.vendor_id);
  ElNotification.success({
    title: "Success",
    message: data.message,
    type: "success",
  });
};

const vendorAdd = () => {
  router.push({
    name: "VendorAdd",
  });
};
</script>
<style></style>
