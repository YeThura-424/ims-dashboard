<template>
  <div class="header">
    <el-page-header :icon="ArrowLeft" @back="onBack">
      <template #content>
        <span class="text-large font-600 mr-3">Create New Sale</span>
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
        <el-form :model="saleForm" label-width="120px" label-position="left">
          <el-form-item label="Sale Date">
            <el-input v-model="saleForm.saledate" disabled />
          </el-form-item>
          <el-form-item label="Total Amount">
            <el-input v-model="saleForm.totalamount" disabled />
            <p v-if="totalamountErr" class="required-field">
              {{ totalamountErr }}
            </p>
          </el-form-item>
          <el-form-item label="Remark">
            <el-input v-model="saleForm.remark" />
          </el-form-item>
        </el-form>
      </el-card>
      <!-- Sale form end here  -->
      <el-button
        type="primary"
        round
        :icon="CirclePlus"
        class="detail-button"
        @click="showSaleDetailDialog"
        >Add Sale Detail</el-button
      >
      <!-- sale detail dialog start -->
      <el-dialog
        v-model="saleDetailDialog"
        :title="saleDetailTitle"
        width="50%"
        align-center
      >
        <!-- import detail form start -->
        <el-form
          :model="saleDetailForm"
          label-width="120px"
          label-position="top"
        >
          <el-form-item label="Product Name">
            <el-select
              v-model="saleDetailForm.productname"
              placeholder="Please Select Product"
              value-key="id"
            >
              <el-option
                v-for="product in products.saleableProduct"
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

          <el-form-item label="Remaining Qty">
            <el-input
              v-model="saleDetailForm.remaining"
              placeholder="Please type product receive qty"
              disabled
            />
            <!-- <p v-if="codeErr" class="required-field">{{ codeErr }}</p> -->
          </el-form-item>
          <el-form-item label="Sale Qty">
            <el-input
              v-model="saleDetailForm.saleqty"
              placeholder="Please type product receive qty"
            />
            <!-- <p v-if="codeErr" class="required-field">{{ codeErr }}</p> -->
          </el-form-item>
          <el-form-item label="Sale Rate">
            <el-input
              v-model="saleDetailForm.rate"
              placeholder="Please type purchase rate"
              disabled
            />
          </el-form-item>

          <el-form-item label="Total Amount">
            <el-input v-model="saleDetailForm.productamount" disabled />
          </el-form-item>
        </el-form>
        <!-- import detail form end -->
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="addProduct">
              {{ saleDetailAction }}
            </el-button>
          </span>
        </template>
      </el-dialog>
      <!-- sale detail dialog end -->
      <el-card class="box-card">
        <!-- sale detail table start -->
        <el-table
          :data="tableData.saleItem"
          stripe
          table-layout="fixed"
          style="width: 100%"
          border
        >
          <el-table-column prop="name" label="Product SKU" width="180" />
          <el-table-column prop="saleqty" label="Sale Qty" width="180" />
          <el-table-column prop="rate" label="Sale Rate" />
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
        <!-- sale detail table end -->
      </el-card>
      <el-row justify="end">
        <el-button
          type="info"
          @click="printSale"
          class="import-button print-button"
          :disabled="tableData.saleItem.length == 0"
          >Print</el-button
        >
        <el-button type="primary" @click="onSubmit" class="import-button"
          >Create</el-button
        >
      </el-row>
    </div>
  </div>
  <div class="receipt" id="receipt">
    <div class="receipt-header">
      <div class="logo">
        <h1>YTR</h1>
      </div>
      <div class="name">
        <p>GR Collection</p>
      </div>
    </div>
    <div class="receipt-mid">
      <div class="info">
        <h2>Contact Info</h2>
        <p>Address : street city, state 0000</p>
        <p>Email : JohnDoe@gmail.com</p>
        <p>Phone : 555-555-5555</p>
      </div>
    </div>
    <div class="receipt-body">
      <div id="table">
        <table>
          <tr class="service" v-for="item in tableData.saleItem">
            <tr class="tabletitle">
								<td class="item"><h2>Rate</h2></td>
								<td class="item"><h2>Item</h2></td>
								<td class="Hours"><h2>Qty</h2></td>
								<td class="Rate"><h2>Sub Total</h2></td>
							</tr>
            <td class="tableitem">
              <p class="itemtext">{{ item.saleqty }}</p>
            </td>
            <td class="tableitem">
              <p class="itemtext">{{ item.name }}</p>
            </td>
            <td class="tableitem"><p class="itemtext">{{ item.rate }}</p></td>
            <td class="tableitem"><p class="itemtext">{{item.productamount}}</p></td>
          </tr>

          <tr class="tabletitle">
            <td class="Rate" colspan="3"><h2>Total</h2></td>
            <td class="payment"><h2>{{ saleForm.totalamount }} MMK</h2></td>
          </tr>
        </table>
      </div>
      <!--End Table-->
    </div>
    <div class="receipt-footer"></div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, CirclePlus, Delete, Edit } from "@element-plus/icons-vue";
import { ref, reactive, watch, onMounted } from "vue";
import router from "@/router";
import { useProductStore } from "../../store/product";
import { useSaleStore } from "../../store/sale";
import { ElNotification } from "element-plus";

const onBack = () => {
  router.push({
    name: "SaleList",
  });
  localStorage.removeItem("saleDetailProduct");
};

const tableData = reactive({
  saleItem: [],
});
const saleStore = useSaleStore();
const products = useProductStore();
const saleDetailDialog = ref(false);

const saleDetailTitle = ref("");
const saleDetailAction = ref("");

const showSaleDetailDialog = () => {
  saleDetailDialog.value = true;
  saleDetailTitle.value = "Add New Product for Sale";
  saleDetailAction.value = "Add Product";
  products.getProducts();
};
const hideSaleDetailDialog = () => {
  saleDetailDialog.value = false;
  (saleDetailForm.productname = ""),
    (saleDetailForm.saleqty = ""),
    (saleDetailForm.rate = ""),
    (saleDetailForm.productamount = "");
};

const saleForm = reactive({
  saledate: "",
  totalamount: "",
  remark: "",
  saleItem: {},
});

const saleDetailForm = reactive({
  productname: "",
  remaining: "",
  saleqty: "",
  rate: "",
  productamount: "",
});

watch(
  [
    () => saleDetailForm.saleqty,
    () => saleDetailForm.rate,
    () => tableData.saleItem,
    () => saleDetailForm.productname,
  ],
  ([newQty, newRate, newImportItem, newProduct]) => {
    saleDetailForm.productamount = newQty * newRate;
    saleForm.totalamount = newImportItem.reduce((total, item) => {
      return total + item.productamount;
    }, 0);

    //set remaining qty and selling price of the selected product

    const selectedProduct = products.saleableProduct.find(
      (product) => product.product_sku === newProduct.name
    );
    if (selectedProduct) {
      saleDetailForm.remaining = selectedProduct.product_qty;
      saleDetailForm.rate = selectedProduct.product_selling_price;
    } else {
      saleDetailForm.remaining = "";
      saleDetailForm.rate = "";
    }
  }
);
onMounted(() => {
  const storedProduct = localStorage.getItem("saleDetailProduct");
  if (storedProduct) {
    tableData.saleItem = JSON.parse(storedProduct);
    saleForm.saleItem = storedProduct;
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  saleForm.saledate = `${year}-${month}-${day}`;
});
const addProduct = () => {
  const product = {
    id: saleDetailForm.productname.id,
    name: saleDetailForm.productname.name,
    saleqty: saleDetailForm.saleqty,
    rate: saleDetailForm.rate,
    productamount: saleDetailForm.productamount,
  };
  console.log(product);
  // Retrieve existing products from localStorage
  const storedProducts =
    JSON.parse(localStorage.getItem("saleDetailProduct")) || [];

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
    localStorage.setItem("saleDetailProduct", JSON.stringify(storedProducts));
    // Update the tableData array
    tableData.saleItem = [...storedProducts];

    hideSaleDetailDialog();
  } else {
    // Add the product to the stored products array
    storedProducts.push(product);

    // Save the updated products array to localStorage
    localStorage.setItem("saleDetailProduct", JSON.stringify(storedProducts));
    tableData.saleItem = [...storedProducts];
    console.log("Product added:", product);
    hideSaleDetailDialog();
  }
  const storedProduct = localStorage.getItem("saleDetailProduct");
  if (storedProduct) {
    saleForm.saleItem = storedProduct;
  }
};

const handleEdit = (index: number, row: User) => {
  showSaleDetailDialog();
  saleDetailTitle.value = "Edit Existing Product for Sale";
  saleDetailAction.value = "Update Product";
  console.log(index, row.id);
  saleDetailForm.productname = {
    name: row.name,
    id: row.id,
  };
  saleDetailForm.productamount = row.productamount;
  saleDetailForm.rate = row.rate;
  saleDetailForm.saleqty = row.saleqty;
};
const handleDelete = (index: number, row: User) => {
  const storedProducts =
    JSON.parse(localStorage.getItem("saleDetailProduct")) || [];
  storedProducts.splice(index, 1);
  localStorage.setItem("saleDetailProduct", JSON.stringify(storedProducts));
  tableData.saleItem = [...storedProducts];
  saleForm.saleItem = localStorage.getItem("saleDetailProduct");
};
const totalamountErr = ref("");

const loading = ref(false);
const printSale = () => {
  let contents = document.getElementById("receipt").innerHTML;
  let frame1 = document.createElement("iframe");
  frame1.name = "frame1";
  frame1.style.position = "absolute";
  frame1.style.top = "-1000000px";
  document.body.appendChild(frame1);
  let frameDoc = frame1.contentWindow
    ? frame1.contentWindow
    : frame1.contentDocument.document
    ? frame1.contentDocument.document
    : frame1.contentDocument;
  frameDoc.document.open();
  frameDoc.document.write('<html lang="en"><head><title>GR Collection</title>');
  frameDoc.document.write(
    '<link rel="stylesheet" type="text/css" href=""/>'
  );
  frameDoc.document.write("</head><body>");
  frameDoc.document.write(contents);
  frameDoc.document.write("</body></html>");
  frameDoc.document.close();
  setTimeout(function () {
    window.frames["frame1"].focus();
    window.frames["frame1"].print();
    document.body.removeChild(frame1);
  }, 500);
  return false;
};
const onSubmit = async () => {
  loading.value = true;
  totalamountErr.value = "";
  try {
    loading.value = true;
    const res = await saleStore.saveSale(saleForm);
    console.log(res);
    if (res.status == 400) {
      loading.value = false;
      const err = res.data;
      if (err.saleItem) {
        ElNotification({
          title: "Warning",
          message: err.saleItem[0],
          type: "warning",
        });
      }
      if (err.totalamount) {
        totalamountErr.value = err.totalamount[0];
      }
      router.push({
        name: "SaleAdd",
      });
      // console.log(err);
    } else {
      router.push({
        name: "SaleList",
      });
      localStorage.removeItem("saleDetailProducts");
    }
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
  console.log(saleForm);
};
</script>
