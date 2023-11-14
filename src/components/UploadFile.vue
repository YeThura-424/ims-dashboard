<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    :limit="1"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="handleChange"
    :on-exceed="handleExceed"
  >
    <template #trigger>
      <el-button type="primary">select file</el-button>
    </template>
    <div class="img-preview" v-if="imageUrl">
      <img v-if="imageUrl" :src="imageUrl" class="avatar upload-img-preview" />
    </div>
  </el-upload>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { genFileId } from "element-plus";
import type {
  UploadProps,
  UploadInstance,
  UploadRawFile,
  UploadFile,
} from "element-plus";

const imageUrl = ref("");
const upload = ref<UploadInstance>();
const emit = defineEmits(["update:modelValue"]);

const handleChange: UploadProps["onChange"] = (file: UploadFile) => {
  // console.log(file);
  imageUrl.value = URL.createObjectURL(file.raw!);
  emit("update:modelValue", file);
};
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
</script>
