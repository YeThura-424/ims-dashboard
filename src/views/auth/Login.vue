<template>
  <div class="login-main" v-loading="loading">
    <el-card>
      <el-row>
        <el-col :span="24">
          <div class="header">
            <h2 class="login-welcome">Login to Your Account</h2>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="picture-container">
            <img src="@/assets/phpto/inventory4.png" class="login-bg" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="login-area">
            <el-card class="box-card login-card" shadow="never">
              <el-form
                :label-position="labelPosition"
                label-width="100px"
                :model="loginForm"
                style="max-width: 460px"
              >
                <el-form-item label="Username">
                  <el-input
                    v-model="loginForm.username"
                    placeholder="Please type your username!"
                    type="name"
                  />
                </el-form-item>
                <el-form-item label="Password">
                  <el-input
                    v-model="loginForm.password"
                    placeholder="Type your password"
                    type="password"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="login">Login</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useUserStore } from "../../store/user";
import router from "../../router";
const labelPosition = ref("top");

const loading = ref(false);

const userStore = useUserStore();
const loginForm = reactive({
  username: "",
  password: "",
});

const login = async () => {
  loading.value = true;
  try {
    loading.value = true;
    const res = await userStore.login(loginForm);
    console.log(res);
    router.push({
      name: "Dashboard",
    });
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
};
</script>
