<template>
  <el-button :icon="Refresh" circle @click="handleRsh" />
  <el-button :icon="FullScreen" circle @click="handleFull" />
  <el-button :icon="Setting" circle />
  <img
    src="../../../../public/logo.png"
    alt=""
    style="width: 30px; height: 30px; margin-left: 10px"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      admin
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Refresh, FullScreen, Setting } from '@element-plus/icons-vue'
import useLayOutSettingStore from '../../../store/modules/setting'
import useUserStore from '../../../store/modules/user'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const SettingStore = useLayOutSettingStore()
const handleRsh = () => {
  SettingStore.refsh = true
}
const handleFull = () => {
  const isFull = document.fullscreenElement
  if (!isFull) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
const logOut = async () => {
  await userStore.userLogOut()
  router.push({ path: '/login', query: { redirect: route.path } })
}
</script>

<style scoped lang="scss"></style>
