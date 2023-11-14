<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3"> Stock Summary </span>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button
            type="primary"
            @click="exportToExcel"
            v-if="stockSummary.length !== 0"
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
        :model="stockSummaryForm"
        label-width="120px"
        label-position="top"
      >
        <el-form-item label="Product SKU">
          <el-select
            v-model="stockSummaryForm.productid"
            clearable
            placeholder="Please Select Product SKU"
            value-key="id"
          >
            <el-option
              v-for="product in products.products"
              :key="product.product_id"
              :label="product.product_sku"
              :value="product.product_id"
            />
          </el-select>
          <!-- <p v-if="nameErr" class="required-field">{{ nameErr }}</p> -->
        </el-form-item>

        <el-form-item label="Product Code">
          <el-input
            v-model="stockSummaryForm.code"
            placeholder="Please type product code"
          />
          <!-- <p v-if="codeErr" class="required-field">{{ codeErr }}</p> -->
        </el-form-item>
        <el-form-item label="From Date">
          <el-date-picker
            v-model="stockSummaryForm.fromDate"
            type="date"
            placeholder="Please select starting date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
          <!-- <p v-if="codeErr" class="required-field">{{ codeErr }}</p> -->
        </el-form-item>
        <el-form-item label="To Date">
          <el-date-picker
            v-model="stockSummaryForm.toDate"
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
      <el-card class="box-card" v-if="stockSummary.length == 0">
        Please Select Filter Cliteria First!!
      </el-card>
      <div class="card" v-else>
        <DataTable
          class="p-datatable-sm"
          :value="stockSummary"
          showGridlines
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          stripedRows
          tableStyle="min-width: 50rem"
        >
          <template #empty> No Movement found. </template>
          <Column header="No" headerStyle="width:3rem">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column field="product_sku" header="Product SKU"></Column>
          <Column field="product_code" header="Product Code"></Column>
          <Column field="product_qty" header="Closing Qty"></Column>
          <Column field="product_buying_price" header="Purchase Rate"></Column>
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

const stockSummaryForm = reactive({
  code: "",
  productid: "",
  fromDate: "",
  toDate: "",
});
const filterDialog = ref(false);
const products = useProductStore();
const stockSummaryStore = useReportStore();
const message = ref();
const stockSummary = ref([]);
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
  const data = await stockSummaryStore.getStockSummary(stockSummaryForm);
  stockSummary.value = data.data;
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
  if (stockSummary.value.length === 0) {
    ElNotification.warning({
      title: "Warning",
      message: "No data to export.",
      type: "warning",
    });
    return;
  }

  const dataWithHeaders = stockSummary.value.map((item) => ({
    "Product SKU": item.product_sku,
    "Product Code": item.product_code,
    "Closing Qty": item.product_qty,
    "Purchase Rate": item.product_buying_price,
  }));

  const ws = XLSX.utils.json_to_sheet(dataWithHeaders);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "StockSummaryData");

  const date = new Date();
  const fileName = `StockSummary${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}.xlsx`;

  XLSX.writeFile(wb, fileName);
};
</script>
<style></style>
