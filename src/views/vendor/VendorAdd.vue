<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3"> Add New Vendor </span>
      </template>
    </el-page-header>
  </div>
  <div
    class="main-container"
    v-loading="loading"
    element-loading-text="Loading..."
  >
    <div class="main-contant">
      <el-card class="box-card">
        <el-form :model="vendorForm" label-width="120px" label-position="left">
          <el-form-item label="Vendor name">
            <el-input
              v-model="vendorForm.name"
              placeholder="Please type vendor name"
            />
            <p v-if="nameErr" class="required-field">{{ nameErr }}</p>
          </el-form-item>

          <el-form-item label="Vendor Code">
            <el-input
              v-model="vendorForm.code"
              placeholder="Please type vendor code"
            />
            <p v-if="codeErr" class="required-field">{{ codeErr }}</p>
          </el-form-item>

          <el-form-item label="Vendor Type">
            <el-select
              v-model="vendorForm.type"
              placeholder="Please Select Vendor Type"
            >
              <el-option label="Distribution" value="Distribution" />
              <el-option label="Manufacturing" value="Manufacturing" />
              <el-option label="Transport Company" value="Transport Company" />
            </el-select>
            <p v-if="vendortypeErr" class="required-field">
              {{ vendortypeErr }}
            </p>
          </el-form-item>

          <el-form-item label="Vendor Status">
            <el-switch v-model="vendorForm.status" />
          </el-form-item>

          <el-form-item label="Payment Type">
            <el-select
              v-model="vendorForm.paymenttype"
              placeholder="Please Select Payment Method"
            >
              <el-option label="Cash" value="Cash" />
              <el-option label="Credit" value="Credit" />
              <el-option label="Consignment" value="Consignment" />
            </el-select>
            <p v-if="paymenttypeErr" class="required-field">
              {{ paymenttypeErr }}
            </p>
          </el-form-item>

          <el-form-item class="submit-buttom-area">
            <el-button type="primary" @click="onSubmit">Create</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import router from "@/router";
import { useVendorStore } from "../../store/vendor";

const onBack = () => {
  router.push({
    name: "VendorList",
  });
};

const loading = ref(false);

const codeErr = ref("");
const nameErr = ref("");
const vendortypeErr = ref("");
const paymenttypeErr = ref("");

const vendorForm = reactive({
  name: "",
  code: "",
  type: "",
  status: false,
  paymenttype: "",
});
const vendorStore = useVendorStore();

const onSubmit = async () => {
  loading.value = true;
  codeErr.value = "";
  nameErr.value = "";
  vendortypeErr.value = "";
  paymenttypeErr.value = "";

  try {
    loading.value = true;
    const data = await vendorStore.saveVendor(vendorForm);
    if (data.status == 400) {
      loading.value = false;
      const err = data.data;
      if (err.code) {
        codeErr.value = err.code[0];
      }
      if (err.name) {
        nameErr.value = err.name[0];
      }
      if (err.paymenttype) {
        paymenttypeErr.value = err.paymenttype[0];
      }
      if (err.type) {
        vendortypeErr.value = err.type[0];
      }
      router.push({
        name: "VendorAdd",
      });
      // console.log(err);
    } else {
      router.push({
        name: "VendorList",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
<style></style>
