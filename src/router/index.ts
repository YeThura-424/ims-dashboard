import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "../components/AuthLayout.vue";
import Login from "../views/auth/Login.vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import Dashboard from "../views/Dashboard.vue";
import ProductList from "../views/product/ProductList.vue";
import ProductAdd from "../views/product/ProductAdd.vue";
import ProductEdit from "../views/product/ProductEdit.vue";
import VendorList from "../views/vendor/VendorList.vue";
import VendorAdd from "../views/vendor/VendorAdd.vue";
import VendorEdit from "../views/vendor/VendorEdit.vue";
import MRNList from "../views/purchase/MRNList.vue";
import MRNAdd from "../views/purchase/MRNAdd.vue";
import MRNEdit from "../views/purchase/MRNEdit.vue";
import SaleList from "../views/sale/SaleList.vue";
import SaleAdd from "../views/sale/SaleAdd.vue";
import SaleEdit from "../views/sale/SaleEdit.vue";
import UserList from "../views/user/UserList.vue";
import ProductPricing from "../views/pricing/ProductPricing.vue";
import ProductPricingAdd from "../views/pricing/ProductPricingAdd.vue";
import ProductPricingEdit from "../views/pricing/ProductPricingEdit.vue";
import SaleProductAnalysis from "../views/report/SaleProductAnalysis.vue";
import ProductConverterList from "../views/converter/ProductConverterList.vue";
import StockMovement from "../views/report/StockMovement.vue";
import StockSummary from "../views/report/StockSummary.vue";
import { useUserStore } from "../store/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: DefaultLayout,
      meta: { requireAuth: true },
      children: [
        { path: "/dashboard", name: "Dashboard", component: Dashboard },
        { path: "/productmaster", name: "ProductList", component: ProductList },
        {
          path: "/productmaster/add",
          name: "ProductAdd",
          component: ProductAdd,
        },
        {
          path: "/productmaster/edit/:id",
          name: "ProductEdit",
          component: ProductEdit,
        },
        { path: "/vendormaster", name: "VendorList", component: VendorList },
        { path: "/vendormaster/add", name: "VendorAdd", component: VendorAdd },
        {
          path: "/vendormaster/edit/:id",
          name: "VendorEdit",
          component: VendorEdit,
        },
        { path: "/materialreceiptnote", name: "MRNList", component: MRNList },
        { path: "/materialreceiptnote/add", name: "MRNAdd", component: MRNAdd },
        {
          path: "/materialreceiptnote/edit/:id",
          name: "MRNEdit",
          component: MRNEdit,
        },
        { path: "/saleinvoice", name: "SaleList", component: SaleList },
        { path: "/saleinvoice/add", name: "SaleAdd", component: SaleAdd },
        {
          path: "/saleinvoice/edit/:id",
          name: "SaleEdit",
          component: SaleEdit,
        },
        { path: "/usermaster", name: "UserList", component: UserList },
        { path: "/login", name: "Login", component: Login },
        {
          path: "/productpricing",
          name: "ProductPricing",
          component: ProductPricing,
        },
        {
          path: "/productpricing/add",
          name: "ProductPricingAdd",
          component: ProductPricingAdd,
        },
        {
          path: "/productpricing/edit/:id",
          name: "ProductPricingEdit",
          component: ProductPricingEdit,
        },
        {
          path: "/productconverter",
          name: "ProductConverter",
          component: ProductConverterList,
        },
        {
          path: "/saleproductanalysis",
          name: "SaleProductAnalysis",
          component: SaleProductAnalysis,
        },
        {
          path: "/stockmovement",
          name: "StockMovement",
          component: StockMovement,
        },
        {
          path: "/stocksummary",
          name: "StockSummary",
          component: StockSummary,
        },
      ],
    },
    {
      path: "/auth",
      redirect: "/login",
      component: AuthLayout,
      meta: { isGuest: true },
      children: [{ path: "/login", name: "Login", component: Login }],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const store = useUserStore();

  if (to.meta.requireAuth && !store.token) {
    next({
      name: "Login",
    });
  } else if (store.token && to.meta.isGuest) {
    next({
      name: "Dashboard",
    });
  } else {
    next();
  }
});
export default router;
