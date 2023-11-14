<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3"> Add New Product </span>
      </template>
    </el-page-header>
  </div>
  <div class="main-container" v-loading="loading">
    <div class="main-contant">
      <el-card class="box-card">
        <el-form :model="productForm" label-width="120px" label-position="left">
          <el-row>
            <el-col :span="11">
              <el-form-item label="Product name">
                <el-input
                  v-model="productForm.name"
                  placeholder="Please type product name"
                />
                <p v-if="nameErr" class="required-field">{{ nameErr }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="Product Code">
                <el-input
                  v-model="productForm.code"
                  placeholder="Please type product code"
                />
                <p v-if="codeErr" class="required-field">{{ codeErr }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="Product UOM">
                <el-select
                  v-model="productForm.uom"
                  placeholder="Please Select Product UOM"
                >
                  <el-option label="BOT" value="BOT" />
                  <el-option label="BOX" value="BOX" />
                  <el-option label="CAN" value="CAN" />
                  <el-option label="CARD" value="CARD" />
                  <el-option label="PCS" value="PCS" />
                  <el-option label="PKT" value="PKT" />
                  <el-option label="TIN" value="TIN" />
                </el-select>
                <p v-if="uomErr" class="required-field">{{ uomErr }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="Product Qty">
                <el-input
                  v-model="productForm.qty"
                  placeholder="Please type product quantity"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="Product Photo">
                <el-tabs v-model="activeName" class="demo-tabs">
                  <el-tab-pane label="New Photo" name="first">
                    <FileUpload
                      v-model="productForm.photo"
                      @update:modelValue="handleChange"
                    />
                  </el-tab-pane>
                  <el-tab-pane label="Old Photo" name="second">
                    <div class="img-preview" v-if="productForm.oldPhoto">
                      <img
                        v-if="productForm.oldPhoto"
                        :src="productForm.oldPhoto"
                        class="avatar upload-img-preview"
                      />
                    </div>
                  </el-tab-pane>
                </el-tabs>

                <p v-if="photoErr" class="required-field">{{ photoErr }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="Product SKU ">
                <el-input v-model="productForm.sku" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="submit-buttom-area">
            <el-button type="primary" @click="onSubmit">Update</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
import { ref, reactive, watch, onMounted } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import FileUpload from "../../components/UploadFile.vue";
import type { UploadProps, UploadFile } from "element-plus";
import { useProductStore } from "../../store/product";

const activeName = ref("first");
const route = useRoute();
const onBack = () => {
  router.push({
    name: "ProductList",
  });
};

const loading = ref(false);

const codeErr = ref("");
const nameErr = ref("");
const photoErr = ref("");
const uomErr = ref("");

const productForm = reactive({
  name: "",
  code: "",
  uom: "",
  qty: "",
  sku: "",
  photo: "",
  oldPhoto: "",
  id: "",
  _method: "put",
});
const handleChange: UploadProps["onChange"] = (file: UploadFile) => {
  productForm.photo = file.raw;
};
const products = useProductStore();
console.log(products.currentProduct);

watch(
  [
    () => productForm.name,
    () => productForm.uom,
    () => products.currentProduct.data,
  ],
  ([newName, newUOM, currentProduct]) => {
    productForm.name = currentProduct.product_name;
    productForm.code = currentProduct.product_code;
    productForm.qty = currentProduct.product_qty;
    productForm.uom = currentProduct.product_uom;
    productForm.oldPhoto = currentProduct.product_photo;
    productForm.id = currentProduct.product_id;
    productForm.sku = `${newName}-${newUOM}`;
  }
);
onMounted(() => {
  products.getProduct(route.params.id);
});
const onSubmit = async () => {
  loading.value = true;
  codeErr.value = "";
  nameErr.value = "";
  photoErr.value = "";
  uomErr.value = "";
  try {
    loading.value = true;
    const res = await products.addProduct(productForm);
    console.log(res);
    if (res.status == 400) {
      loading.value = false;
      const err = res.data;
      if (err.code) {
        codeErr.value = err.code[0];
      }
      if (err.name) {
        nameErr.value = err.name[0];
      }
      if (err.photo) {
        photoErr.value = err.photo[0];
      }
      if (err.uom) {
        uomErr.value = err.uom[0];
      }
      router.push({
        name: "ProductAdd",
      });
      // console.log(err);
    } else {
      router.push({
        name: "ProductList",
      });
    }
  } catch (error) {
    console.log(error);
  }
  console.log(productForm);
};
</script>
<style></style>
