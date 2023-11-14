<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3">Product Converter </span>
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
          :value="conversionStore.conversion"
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
              <el-button
                type="primary"
                :icon="CirclePlus"
                @click="productConversion"
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
          <template #empty> No Conversion found. </template>
          <Column header="No" headerStyle="width:3rem">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column field="created_at" header="Converted Date"></Column>
          <Column
            field="source_product.product_sku"
            header="Source Product"
          ></Column>
          <Column field="to_convert_qty" header="To Convert Qty"></Column>
          <Column
            field="destination_product.product_sku"
            header="Destination Product"
          ></Column>
          <Column field="converted_qty" header="Converted Qty"></Column>
        </DataTable>
      </div>
      <!-- </el-card> -->
    </div>
  </div>
  <!-- product conversion dialog starts here  -->
  <el-dialog
    v-model="conversionDialog"
    title="Conversion Detail"
    width="50%"
    align-center
  >
    <!-- import detail form start -->
    <el-form
      :model="conversionForm"
      label-width="120px"
      label-position="top"
      v-loading="loading"
      element-loading-text="Loading..."
    >
      <div class="source_product">
        <el-button type="primary" round :icon="Select" class="conversion_buttom"
          >Source Product</el-button
        >
        <el-form-item label="Source Product SKU">
          <el-select
            v-model="conversionForm.sourceProduct"
            placeholder="Please Select Source Product"
            filterable
            clearable
            value-key="id"
          >
            <el-option
              v-for="product in productStore.products"
              :key="product.product_id"
              :label="product.product_sku"
              :value="product.product_id"
            />
          </el-select>
          <p v-if="sourceProduct_err" class="required-field">
            {{ sourceProduct_err }}
          </p>
        </el-form-item>
        <el-form-item label="Available Qty">
          <el-input v-model="conversionForm.sourceAvailableQty" disabled />
        </el-form-item>
        <el-form-item label="To Convert Qty">
          <el-input
            v-model="conversionForm.toConvertQty"
            placeholder="Please type product receive qty"
          />
          <p v-if="toConvertQty_err" class="required-field">
            {{ toConvertQty_err }}
          </p>
        </el-form-item>
      </div>
      <div class="destination_product">
        <el-button
          type="primary"
          round
          :icon="Star"
          class="destination_conversion_buttom"
          >Destination Product</el-button
        >
        <el-form-item label="Destination Product SKU">
          <el-select
            v-model="conversionForm.destinationProduct"
            placeholder="Please Select Destination Product"
            filterable
            clearable
            value-key="id"
          >
            <el-option
              v-for="product in destinationProducts"
              :key="product.product_id"
              :label="product.product_sku"
              :value="product.product_id"
            />
          </el-select>
          <p v-if="destinationProduct_err" class="required-field">
            {{ destinationProduct_err }}
          </p>
        </el-form-item>
        <el-form-item label="Available Qty">
          <el-input v-model="conversionForm.destinationAvailableQty" disabled />
        </el-form-item>
        <el-form-item label="Converted Qty">
          <el-input
            v-model="conversionForm.convertedQty"
            placeholder="Please type product receive qty"
          />
          <p v-if="convertedQty_err" class="required-field">
            {{ convertedQty_err }}
          </p>
        </el-form-item>
      </div>
    </el-form>
    <!-- import detail form end -->
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="addConversion">
          Convert Product
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- product conversion dialog ends here  -->
</template>
<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
import { ref, onMounted, reactive, watch } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { FilterMatchMode } from "primevue/api";
import { Star, Select, Search, CirclePlus } from "@element-plus/icons-vue";
import router from "@/router";
import { ElNotification } from "element-plus";
import { useProductStore } from "@/store/product";
import { useConversionStore } from "@/store/conversion";
const onBack = () => {
  router.push({
    name: "Dashboard",
  });
};
const loading = ref(false);

const destinationProducts = ref([]);
const conversionForm = reactive({
  sourceProduct: "",
  toConvertQty: "",
  sourceAvailableQty: "",
  destinationProduct: "",
  convertedQty: "",
  destinationAvailableQty: "",
});
const conversionDialog = ref(false);

const showConversionDialog = () => {
  conversionDialog.value = true;
};
const hideConversionDialog = () => {
  conversionDialog.value = false;
  conversionForm.sourceProduct = "";
  conversionForm.toConvertQty = "";
  conversionForm.sourceAvailableQty = "";
  conversionForm.destinationProduct = "";
  conversionForm.convertedQty = "";
  conversionForm.destinationAvailableQty = "";
};
const productStore = useProductStore();
const conversionStore = useConversionStore();
const message = conversionStore.notification;
onMounted(() => {
  productStore.getProducts();
  conversionStore.getConversions();
  if (message) {
    console.log(message);
    ElNotification.success({
      title: "Success",
      message: message,
      type: "success",
    });
  }
});
watch(
  [() => conversionForm.sourceProduct, () => conversionForm.destinationProduct],
  ([sourceProduct, destinationProduct]) => {
    const selectedSourceProduct = productStore.products.find(
      (product) => product.product_id === sourceProduct
    );
    if (selectedSourceProduct) {
      conversionForm.sourceAvailableQty = selectedSourceProduct.product_qty;
      const filteredDestinationProducts = productStore.products.filter(
        (product) =>
          product.product_name.includes(selectedSourceProduct.product_name)
      );
      destinationProducts.value = filteredDestinationProducts;
    } else {
      conversionForm.sourceAvailableQty = "";
      destinationProducts.value = [];
    }

    const selectedDestinationProduct = productStore.products.find(
      (product) => product.product_id === destinationProduct
    );
    if (selectedDestinationProduct) {
      conversionForm.destinationAvailableQty =
        selectedDestinationProduct.product_qty;
    } else {
      conversionForm.destinationAvailableQty = "";
    }
  }
);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const productConversion = () => {
  showConversionDialog();
};
const sourceProduct_err = ref("");
const toConvertQty_err = ref("");
const destinationProduct_err = ref("");
const convertedQty_err = ref("");

const addConversion = async () => {
  loading.value = true;
  sourceProduct_err.value = "";
  toConvertQty_err.value = "";
  destinationProduct_err.value = "";
  convertedQty_err.value = "";

  try {
    loading.value = true;
    const res = await conversionStore.saveConversion(conversionForm);
    console.log(res);

    if (res.status == 400) {
      loading.value = false;
      const err = res.data;
      if (err.sourceProduct) {
        sourceProduct_err.value = err.sourceProduct[0];
      }
      if (err.toConvertQty) {
        toConvertQty_err.value = err.toConvertQty[0];
        console.log(err.toConvertQty[0]);
      }
      if (err.destinationProduct) {
        destinationProduct_err.value = err.destinationProduct[0];
        console.log(err.destinationProduct[0]);
      }
      if (err.convertedQty) {
        convertedQty_err.value = err.convertedQty[0];
        console.log(err.convertedQty[0]);
      }
    } else {
      console.log(conversionForm);
      hideConversionDialog();
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
<style></style>
