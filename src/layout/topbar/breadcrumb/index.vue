<template>
  <el-icon @click="handleClick">
    <component :is="useSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight" style="margin-left: 10px">
    <el-breadcrumb-item
      v-for="item in route.matched"
      :to="item.path"
      v-show="item.meta.title"
    >
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import useLayOutSettingStore from '../../../store/modules/setting'
const route = useRoute()
const useSettingStore = useLayOutSettingStore()
const handleClick = () => {
  useSettingStore.fold = !useSettingStore.fold
}
</script>

<style scoped lang="scss"></style>
