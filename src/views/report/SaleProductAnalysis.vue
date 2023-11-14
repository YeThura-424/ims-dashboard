<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3"> Sale Product Analysis </span>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button
            type="primary"
            @click="exportToExcel"
            v-if="saleProduct.length !== 0"
            >Export Excel</el-button
          >
          <el-button type="primary" class="ml-2" @click="reportFilter"
            >Filter</el-button
          >
        </div>
      </template>
    </el-page-header>
    <!-- filter dialog start here  -->
    <el-dialog
      v-model="filterDialog"
      title="Report Configuration"
      width="50%"
      align-center
    >
      <!-- import detail form start -->
      <el-form
        :model="saleProductForm"
        label-width="120px"
        label-position="top"
      >
        <el-form-item label="Product SKU">
          <el-select
            v-model="saleProductForm.productsku"
            clearable
            placeholder="Please Select Product SKU"
            value-key="id"
          >
            <el-option
              v-for="product in products.products"
              :key="product.product_id"
              :label="product.product_sku"
              :value="product.product_sku"
            />
          </el-select>
          <!-- <p v-if="nameErr" class="required-field">{{ nameErr }}</p> -->
        </el-form-item>

        <el-form-item label="Sale Order No">
          <el-input
            v-model="saleProductForm.orderno"
            placeholder="Please type sale order no"
          />
          <!-- <p v-if="codeErr" class="required-field">{{ codeErr }}</p> -->
        </el-form-item>
        <el-form-item label="From Date">
          <el-date-picker
            v-model="saleProductForm.fromDate"
            type="date"
            placeholder="Please select starting date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
          <!-- <p v-if="codeErr" class="required-field">{{ codeErr }}</p> -->
        </el-form-item>
        <el-form-item label="To Date">
          <el-date-picker
            v-model="saleProductForm.toDate"
            type="date"
            placeholder="Please select ending date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <!-- import detail form end -->
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="applyFilter"> Apply </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- filter dialog ends here  -->
  </div>
  <div class="main-container">
    <div class="main-contant">
      <el-card class="box-card" v-if="saleProduct.length == 0">
        Please Select Filter Cliteria First!!
      </el-card>
      <div class="card" v-else>
        <DataTable
          class="p-datatable-sm"
          :value="saleProduct"
          showGridlines
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          stripedRows
          tableStyle="min-width: 50rem"
        >
          <template #empty> No Product found. </template>
          <Column header="No" headerStyle="width:3rem">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column field="saledate" header="Sale Date" sortable></Column>
          <Column field="orderno" header="Sale Order"></Column>
          <Column field="sku" header="Product SKU"></Column>
          <Column field="code" header="Product Code"></Column>
          <Column field="qty" header="Qty"></Column>
          <Column field="rate" header="Rate"></Column>
          <Column field="productamount" header="Product Amount"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
import { ref, onMounted, reactive } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import router from "@/router";
import { useProductStore } from "../../store/product";
import { useReportStore } from "../../store/report";
import { ElNotification } from "element-plus";
import * as XLSX from "xlsx";

const onBack = () => {
  router.push({
    name: "Dashboard",
  });
};

const saleProductForm = reactive({
  orderno: "",
  productsku: "",
  fromDate: "",
  toDate: "",
});
const filterDialog = ref(false);
const products = useProductStore();
const saleProductStore = useReportStore();
const message = ref();
const saleProduct = ref([]);
// onMounted(() => {
//   if (message) {
//     console.log(message);
//     ElNotification.success({
//       title: "Success",
//       message: message,
//       type: "success",
//     });
//   }
// });

const reportFilter = () => {
  filterDialog.value = true;
  products.getProducts();
};

const applyFilter = async () => {
  filterDialog.value = false;
  const data = await saleProductStore.getSaleProductAnalysis(saleProductForm);
  saleProduct.value = data.data;
  message.value = data.message;

  if (message) {
    console.log(message);
    ElNotification.success({
      title: "Success",
      message: message,
      type: "success",
    });
  }
};

const exportToExcel = () => {
  if (saleProduct.value.length === 0) {
    ElNotification.warning({
      title: "Warning",
      message: "No data to export.",
      type: "warning",
    });
    return;
  }

  const dataWithHeaders = saleProduct.value.map((item) => ({
    "Sale Date": item.saledate,
    "Sale Order": item.orderno,
    "Product SKU": item.sku,
    "Product Code": item.code,
    Qty: item.qty,
    Rate: item.rate,
    "Product Amount": item.productamount,
  }));

  const ws = XLSX.utils.json_to_sheet(dataWithHeaders);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SaleProductData");

  const date = new Date();
  const fileName = `SaleProductData_${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}.xlsx`;

  XLSX.writeFile(wb, fileName);
};
</script>
<style></style>
