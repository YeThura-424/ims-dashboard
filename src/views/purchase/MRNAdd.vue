<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3"> Add New MRN </span>
      </template>
    </el-page-header>
  </div>
  <div
    class="main-container"
    v-loading="loading"
    element-loading-text="Loading..."
  >
    <div class="main-contant">
      <!-- MRN form start here  -->
      <el-card class="box-card">
        <el-form :model="importForm" label-width="120px" label-position="left">
          <el-row>
            <el-col :span="11">
              <el-form-item label="MRN Date">
                <el-input
                  v-model="importForm.date"
                  placeholder="Please type product name"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="Invoice Date">
                <el-date-picker
                  v-model="importForm.invoicedate"
                  type="date"
                  placeholder="Pick invoice date"
                  format="YYYY/MM/DD"
                  value-format="YYYY-MM-DD"
                />
                <p v-if="invoicedateErr" class="required-field">
                  {{ invoicedateErr }}
                </p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="Vendor">
                <el-select
                  v-model="importForm.vendor"
                  placeholder="Please Select Product UOM"
                  value-key="id"
                >
                  <el-option
                    v-for="vendor in vendorStore.vendors"
                    :label="vendor.vendor_name"
                    :value="vendor.vendor_id"
                    :key="vendor.vendor_id"
                  />
                </el-select>
                <p v-if="vendorErr" class="required-field">{{ vendorErr }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="Invoice No">
                <el-input
                  v-model="importForm.invoiceno"
                  placeholder="Please type product code"
                />
                <p v-if="invoicenoErr" class="required-field">
                  {{ invoicenoErr }}
                </p>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="Product Photo">
                <FileUpload
                  v-model="importForm.photo"
                  @update:modelValue="handleChange"
                />
                <p v-if="photoErr" class="required-field">{{ photoErr }}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Total Amount">
            <el-input v-model="importForm.totalamount" disabled />
            <p v-if="totalamountErr" class="required-field">
              {{ totalamountErr }}
            </p>
          </el-form-item>
          <el-form-item label="Remark">
            <el-input v-model="importForm.remark" />
          </el-form-item>
        </el-form>
      </el-card>
      <!-- MRN form end here  -->
      <el-button
        type="primary"
        round
        :icon="CirclePlus"
        class="detail-button"
        @click="showImportDetailDialog"
        >Add Import Detail</el-button
      >
      <!-- import detail dialog start -->
      <el-dialog
        v-model="importDetailDialog"
        :title="importDetailTitle"
        width="50%"
        align-center
      >
        <!-- import detail form start -->
        <el-form
          :model="importDetailForm"
          label-width="120px"
          label-position="top"
        >
          <el-form-item label="Product Name">
            <el-select
              v-model="importDetailForm.productname"
              placeholder="Please Select Product"
              value-key="id"
            >
              <el-option
                v-for="product in products.products"
                :key="product.product_id"
                :label="product.product_sku"
                :value="{
                  name: product.product_sku,
                  id: product.product_id,
                }"
              />
            </el-select>
            <!-- <p v-if="nameErr" class="required-field">{{ nameErr }}</p> -->
          </el-form-item>

          <el-form-item label="Receive Qty">
            <el-input
              v-model="importDetailForm.receiveqty"
              placeholder="Please type product receive qty"
            />
            <!-- <p v-if="codeErr" class="required-field">{{ codeErr }}</p> -->
          </el-form-item>

          <el-form-item label="Purchase Rate">
            <el-input
              v-model="importDetailForm.rate"
              placeholder="Please type purchase rate"
            />
          </el-form-item>

          <el-form-item label="Total Amount">
            <el-input v-model="importDetailForm.productamount" disabled />
          </el-form-item>
        </el-form>
        <!-- import detail form end -->
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="addProduct">
              {{ importDetailAction }}
            </el-button>
          </span>
        </template>
      </el-dialog>
      <!-- import detail dialog end -->
      <el-card class="box-card">
        <!-- import detail table start -->
        <el-table
          :data="tableData.importItem"
          stripe
          table-layout="fixed"
          style="width: 100%"
          border
        >
          <el-table-column prop="name" label="Product SKU" width="180" />
          <el-table-column prop="receiveqty" label="Receive Qty" width="180" />
          <el-table-column prop="rate" label="Purchase Rate" />
          <el-table-column prop="productamount" label="Product Amount" />
          <el-table-column label="Operations">
            <template #default="scope">
              <el-button
                type="warning"
                :icon="Edit"
                @click="handleEdit(scope.$index, scope.row)"
                circle
              />
              <el-button
                type="danger"
                :icon="Delete"
                @click="handleDelete(scope.$index, scope.row)"
                circle
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- import detail table end -->
      </el-card>
      <el-button type="primary" @click="onSubmit" class="import-button"
        >Create</el-button
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowLeft, CirclePlus, Delete, Edit } from "@element-plus/icons-vue";
import { ref, reactive, watch, onMounted, computed } from "vue";
import router from "@/router";
import FileUpload from "../../components/UploadFile.vue";
import type { UploadProps, UploadFile } from "element-plus";
import { useProductStore } from "../../store/product";
import { useVendorStore } from "../../store/vendor";
import { useMRNStore } from "../../store/materialreceiptnote";
const onBack = () => {
  router.push({
    name: "MRNList",
  });
  localStorage.removeItem("importDetailProducts");
};

const tableData = reactive({
  importItem: [],
});
const mrnStore = useMRNStore();
const products = useProductStore();
const vendorStore = useVendorStore();
const importDetailDialog = ref(false);

const importDetailTitle = ref("");
const importDetailAction = ref("");

const showImportDetailDialog = () => {
  importDetailDialog.value = true;
  importDetailTitle.value = "Add New Product for MRN";
  importDetailAction.value = "Add Product";
  products.getProducts();
};
const hideImportDetailDialog = () => {
  importDetailDialog.value = false;
  (importDetailForm.productname = ""),
    (importDetailForm.receiveqty = ""),
    (importDetailForm.rate = ""),
    (importDetailForm.productamount = "");
};

const importForm = reactive({
  date: "",
  invoicedate: "",
  vendor: "",
  invoiceno: "",
  totalamount: "",
  remark: "",
  photo: "",
  importItem: {},
});

const importDetailForm = reactive({
  productname: "",
  receiveqty: "",
  rate: "",
  productamount: "",
});

watch(
  [
    () => importDetailForm.receiveqty,
    () => importDetailForm.rate,
    () => tableData.importItem,
  ],
  ([newQty, newRate, newImportItem]) => {
    importDetailForm.productamount = newQty * newRate;
    importForm.totalamount = newImportItem.reduce((total, item) => {
      return total + item.productamount;
    }, 0);
  }
);
onMounted(() => {
  vendorStore.getVendors();
  const storedProduct = localStorage.getItem("importDetailProducts");
  if (storedProduct) {
    tableData.importItem = JSON.parse(storedProduct);
    importForm.importItem = storedProduct;
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  importForm.date = `${year}-${month}-${day}`;
});
const addProduct = () => {
  const product = {
    id: importDetailForm.productname.id,
    name: importDetailForm.productname.name,
    receiveqty: importDetailForm.receiveqty,
    rate: importDetailForm.rate,
    productamount: importDetailForm.productamount,
  };
  console.log(product);
  // Retrieve existing products from localStorage
  const storedProducts =
    JSON.parse(localStorage.getItem("importDetailProducts")) || [];

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
    localStorage.setItem(
      "importDetailProducts",
      JSON.stringify(storedProducts)
    );
    // Update the tableData array
    tableData.importItem = [...storedProducts];

    hideImportDetailDialog();
  } else {
    // Add the product to the stored products array
    storedProducts.push(product);

    // Save the updated products array to localStorage
    localStorage.setItem(
      "importDetailProducts",
      JSON.stringify(storedProducts)
    );
    tableData.importItem = [...storedProducts];
    console.log("Product added:", product);
    hideImportDetailDialog();
  }
  const storedProduct = localStorage.getItem("importDetailProducts");
  if (storedProduct) {
    importForm.importItem = storedProduct;
  }
};
const handleChange: UploadProps["onChange"] = (file: UploadFile) => {
  importForm.photo = file.raw;
};

const handleEdit = (index: number, row: User) => {
  showImportDetailDialog();
  importDetailTitle.value = "Edit Existing Product for MRN";
  importDetailAction.value = "Update Product";
  console.log(index, row.id);
  importDetailForm.productname = {
    name: row.name,
    id: row.id,
  };
  importDetailForm.productamount = row.productamount;
  importDetailForm.rate = row.rate;
  importDetailForm.receiveqty = row.receiveqty;
};
const handleDelete = (index: number, row: User) => {
  console.log(index, row);
};
const invoicedateErr = ref("");
const vendorErr = ref("");
const invoicenoErr = ref("");
const photoErr = ref("");
const totalamountErr = ref("");
const importitemErr = ref("");

const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;
  invoicedateErr.value = "";
  vendorErr.value = "";
  invoicenoErr.value = "";
  photoErr.value = "";
  totalamountErr.value = "";
  importitemErr.value = "";
  try {
    loading.value = true;
    const res = await mrnStore.saveImport(importForm);
    console.log(res);
    if (res.status == 400) {
      loading.value = false;
      const err = res.data;
      if (err.invoicedate) {
        invoicedateErr.value = err.invoicedate[0];
      }
      if (err.vendor) {
        vendorErr.value = err.vendor[0];
      }
      if (err.photo) {
        photoErr.value = err.photo[0];
      }
      if (err.invoiceno) {
        invoicenoErr.value = err.invoiceno[0];
      }
      if (err.totalamount) {
        totalamountErr.value = err.totalamount[0];
      }
      if (err.importItem) {
        importitemErr.value = err.importItem[0];
      }
      router.push({
        name: "MRNAdd",
      });
      // console.log(err);
    } else {
      router.push({
        name: "MRNList",
      });
      localStorage.removeItem("importDetailProducts");
    }
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
  console.log(importForm);
};
</script>
<style></style>
