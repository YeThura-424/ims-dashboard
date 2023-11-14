<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3">Edit Existing Pricing</span>
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
            <el-input v-model="pricingForm.productname" disabled />
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

      <el-button type="primary" @click="onSubmit" class="import-button"
        >Update</el-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { ArrowLeft, CirclePlus, Delete, Edit } from "@element-plus/icons-vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { useProductPricingStore } from "@/store/productpricing";
import axios from "axios";
const loading = ref(false);
const onBack = () => {
  router.push({
    name: "ProductPricing",
  });
  localStorage.removeItem("pricingProducts");
};
const route = useRoute();
const pricingStore = useProductPricingStore();
const pricingForm = reactive({
  productname: "",
  buyingprice: "",
  sellingprice: "",
  id: "",
  _method: "put",
});
onMounted(() => {
  pricingStore.getPricing(route.params.id);
});

watch(
  () => pricingStore.currentPricing.data,
  (currentProduct) => {
    pricingForm.productname = currentProduct.product_sku;
    pricingForm.buyingprice = currentProduct.product_buying_price;
    pricingForm.sellingprice = currentProduct.product_selling_price;
    pricingForm.id = currentProduct.product_id;
  }
);

const onSubmit = async () => {
  console.log(pricingForm);
  loading.value = true;
  const res = await pricingStore.savePricing(pricingForm);

  if (res.status == 400) {
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
