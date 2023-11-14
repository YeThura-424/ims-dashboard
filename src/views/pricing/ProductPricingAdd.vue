<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3">Create New Pricing</span>
      </template>
    </el-page-header>
  </div>
  <div
    class="main-container"
    v-loading="loading"
    element-loading-text="Loading..."
  >
    <div class="main-contant">
      <!-- Sale form start here  -->
      <el-card class="box-card">
        <el-form :model="pricingForm" label-width="120px" label-position="left">
          <el-form-item label="Product">
            <el-select
              v-model="pricingForm.productname"
              placeholder="Please Select Product"
              value-key="id"
            >
              <el-option
                v-for="product in pricingStore.pricing"
                :key="product.product_id"
                :label="product.product_sku"
                :value="{
                  name: product.product_sku,
                  id: product.product_id,
                }"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Buying Price">
            <el-input v-model="pricingForm.buyingprice" disabled />
          </el-form-item>
          <el-form-item label="Selling Price">
            <el-input v-model="pricingForm.sellingprice" />
          </el-form-item>
        </el-form>
      </el-card>
      <!-- Sale form end here  -->
      <el-button
        type="primary"
        round
        :icon="CirclePlus"
        class="detail-button"
        @click="addPricing"
        >Add Pricing Detail</el-button
      >

      <el-card class="box-card">
        <!-- sale detail table start -->
        <el-table
          :data="tableData.pricingItem"
          stripe
          style="width: 100%"
          border
        >
          <el-table-column prop="name" label="Product SKU" />
          <el-table-column prop="buyingprice" label="Purchase Rate" />
          <el-table-column prop="sellingprice" label="Selling Rate" />
        </el-table>
        <!-- sale detail table end -->
      </el-card>
      <el-button type="primary" @click="onSubmit" class="import-button"
        >Create</el-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { ArrowLeft, CirclePlus, Delete, Edit } from "@element-plus/icons-vue";
import router from "@/router";
import { useProductPricingStore } from "@/store/productpricing";
import { ElNotification } from "element-plus";

const loading = ref(false);
const onBack = () => {
  router.push({
    name: "ProductPricing",
  });
  localStorage.removeItem("pricingProducts");
};

const pricingStore = useProductPricingStore();
const pricingForm = reactive({
  productname: "",
  buyingprice: "",
  sellingprice: "",
  pricingItems: {},
});
onMounted(() => {
  pricingStore.getPricings();
});
const tableData = reactive({
  pricingItem: [],
});
watch(
  () => pricingForm.productname,
  (newProduct) => {
    const selectedProduct = pricingStore.pricing.find(
      (product) => product.product_sku === newProduct.name
    );
    if (selectedProduct) {
      pricingForm.buyingprice = selectedProduct.product_buying_price;
    } else {
      pricingForm.buyingprice = "";
    }
  }
);
const addPricing = () => {
  const product = {
    id: pricingForm.productname.id,
    name: pricingForm.productname.name,
    buyingprice: pricingForm.buyingprice,
    sellingprice: pricingForm.sellingprice,
  };

  const storedProducts =
    JSON.parse(localStorage.getItem("pricingProducts")) || [];

  // Check if the product already exists
  const existingProductIndex = storedProducts.findIndex(
    (storedProduct) => storedProduct.id === product.id
  );

  if (existingProductIndex > -1) {
    // You can show a message to the user indicating that the item already exists
    const updatedProduct = {
      ...storedProducts[existingProductIndex],
      ...product,
    };

    // Update the product in the stored products array
    storedProducts.splice(existingProductIndex, 1, updatedProduct);

    // Save the updated products array to localStorage
    localStorage.setItem("pricingProducts", JSON.stringify(storedProducts));
    // Update the tableData array
    tableData.pricingItem = [...storedProducts];
  } else {
    // Add the product to the stored products array
    storedProducts.push(product);

    // Save the updated products array to localStorage
    localStorage.setItem("pricingProducts", JSON.stringify(storedProducts));
    tableData.pricingItem = [...storedProducts];
    console.log("Product added:", product);
  }
  const storedProduct = localStorage.getItem("pricingProducts");
  if (storedProduct) {
    pricingForm.pricingItems = storedProduct;
  }
};

const onSubmit = async () => {
  console.log(pricingForm);
  loading.value = true;
  const res = await pricingStore.savePricing(pricingForm);

  if (res.status == 400) {
    const err = res.data;
    console.log(err);
    if (err) {
      ElNotification({
        title: "Warning",
        message: err,
        type: "warning",
      });
    }
    loading.value = false;
    router.push({
      name: "ProductPricingAdd",
    });
  } else {
    router.push({
      name: "ProductPricing",
    });
    localStorage.removeItem("pricingProducts");
  }
};
</script>
