<template>
  <div class="container">
    <div class="slider" :class="{ fold: useSettingStore.fold ? true : false }">
      <Logo></Logo>
      <el-scrollbar class="scrollBar">
        <el-menu
          background-color="#001529"
          text-color="white"
          :default-active="route.path"
          :collapse="useSettingStore.fold"
        >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="topBar" :class="{ fold: useSettingStore.fold }">
      <Topbar></Topbar>
    </div>
    <div
      class="mainContent"
      :class="{ fold: useSettingStore.fold ? true : false }"
      v-if="statusMain"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Topbar from './topbar/index.vue'
import useUserStore from '../store/modules/user'
import useLayOutSettingStore from '../store/modules/setting'
const useSettingStore = useLayOutSettingStore()
let userStore = useUserStore()
let route = useRoute()
let statusMain = ref(true)
watch(
  () => useSettingStore.refsh,
  () => {
    statusMain.value = false
    nextTick(() => {
      statusMain.value = true
    })
  },
)
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  .slider {
    width: 260px;
    height: 100vh;
    background-color: #001529;
    position: fixed;
    left: 0;
    top: 0;
    transition: width 0.3s;
    &.fold {
      width: 50px;
    }
    .scrollBar {
      width: 100%;
      height: calc(100vh - 50px);
      .el-menu {
        border-right: none;
      }
    }
  }
  .topBar {
    height: 50px;
    width: calc(100% - 260px);
    position: fixed;
    top: 0;
    left: 260px;
    transition: all 0.3s;
    &.fold {
      width: calc(100% - 50px) !important;
      left: 50px !important;
    }
  }
  .mainContent {
    width: calc(100% - 260px);
    height: calc(100vh - 50px);
    position: absolute;
    left: 260px;
    top: 50px;
    overflow: auto;
    padding: 20px;
    transition: all 0.3s;
    &.fold {
      width: calc(100% - 50px);
      left: 50px;
    }
  }
}
</style>
