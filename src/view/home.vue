<template>
  <div class="home">{{title}}</div>
</template>

<script>
import { title } from '@/common/config'
export default {
  name: 'home',
  data() {
    return {
      title: title
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: black;
  width: 100%;
  height: 100%;
  background: url('~@/assets/home.jpg') no-repeat;
  background-size: cover;
}
</style>