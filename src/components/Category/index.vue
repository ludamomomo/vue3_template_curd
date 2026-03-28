<template>
  <el-card>
    <el-form inline="true">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          style="width: 240px"
          v-model="useStore.c1Id"
          @change="handle1Change"
          :disabled="visible === 1 ? true : false"
        >
          <el-option
            v-for="item in useStore.c1Arr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          style="width: 240px"
          v-model="useStore.c2Id"
          @change="handle2Change"
          :disabled="visible === 1 ? true : false"
        >
          <el-option
            v-for="item in useStore.c2Arr"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          style="width: 240px"
          v-model="useStore.c3Id"
          :disabled="visible === 1 ? true : false"
        >
          <el-option
            v-for="item in useStore.c3Arr"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '../../store/modules/category'
defineProps(['visible'])
let useStore = useCategoryStore()
onMounted(() => {
  getUseStoreC1()
})

const getUseStoreC1 = () => {
  useStore.getC1()
}
const handle1Change = () => {
  useStore.c2Id = ''
  useStore.c3Id = ''
  useStore.c3Arr = []
  useStore.getC2()
}
const handle2Change = () => {
  useStore.c3Id = ''
  useStore.getC3()
}
</script>

<style scoped lang="scss"></style>
