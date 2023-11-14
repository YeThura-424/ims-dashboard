<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item>IMS SYSTEM</el-menu-item>
    <div class="flex-grow" />
    <el-sub-menu index="2">
      <template #title>General</template>
      <router-link to="/productmaster" class="header-link">
        <el-menu-item index="2-1">Product Management</el-menu-item>
      </router-link>
      <router-link to="/vendormaster" class="header-link">
        <el-menu-item index="2-2">Vendor Management</el-menu-item>
      </router-link>
      <router-link to="/productpricing" class="header-link">
        <el-menu-item index="2-3">Product Pricing</el-menu-item>
      </router-link>
      <router-link to="/productconverter" class="header-link">
        <el-menu-item index="2-4">Product Converter</el-menu-item>
      </router-link>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>Purchase</template>
      <router-link to="/materialreceiptnote" class="header-link">
        <el-menu-item index="3-1">Material Receive Note</el-menu-item>
      </router-link>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>Sales</template>
      <router-link to="/saleinvoice" class="header-link">
        <el-menu-item index="4-1">Sales Invoice</el-menu-item>
      </router-link>
    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title>Report</template>
      <router-link to="/saleproductanalysis" class="header-link">
        <el-menu-item index="5-1">Sale Product Analysis</el-menu-item>
      </router-link>
      <router-link to="/stockmovement" class="header-link">
        <el-menu-item index="5-2">Stock Movement</el-menu-item>
      </router-link>
      <router-link to="/stocksummary" class="header-link">
        <el-menu-item index="5-3">Stock Summary</el-menu-item>
      </router-link>
    </el-sub-menu>
    <el-dropdown class="user-avatar">
      <span class="el-dropdown-link">
        <el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>Profile</el-dropdown-item>

          <el-dropdown-item divided @click="logout">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import router from "@/router";
import { useUserStore } from "@/store/user";

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const userStore = useUserStore();
const logout = async () => {
  await userStore.logout();
  localStorage.clear();
  router.push({
    name: "Login",
  });
};
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
