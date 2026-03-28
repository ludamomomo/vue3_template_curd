<template>
  <div class="topBar">
    <div class="left">
      <Bread></Bread>
    </div>
    <div class="right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import Bread from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<style scoped lang="scss">
.topBar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    margin-left: 20px;
    display: flex;
    align-items: center;
  }
  .right {
    display: flex;
    align-items: center;
  }
}
</style>
