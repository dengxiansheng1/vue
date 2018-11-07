<template>
  <div class="music_header">
    <div class="header_m">
      <img class="logo" src="../../assets/img/logo.png">
      <h3>Water Music</h3>
    </div>
    <span class="iconfont icon-mine"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style  lang='less' scoped>
@import "~@/assets/less/variable.less";
.music_header{
  padding: 0 10px;
  margin: 0 auto;
  height: 44px;
  display: flex;
  .header_m{
    margin: 0 auto;
    width: 140px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo{
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    h3{
      color: @color-theme;
      font-size: 16px;
    }
  }
  .icon-mine{
    line-height: 44px;
    font-size: 22px;
    color: @color-theme;
  }
}
</style>
