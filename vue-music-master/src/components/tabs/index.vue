<template>
  <div class='tabs'>
    <router-link to="/recommend">推荐</router-link>
    <router-link to="/singers">歌手</router-link>
    <router-link to="/rank">排行</router-link>
    <router-link to="/search">搜索</router-link>
  </div>
</template>

<script>
  export default {

  }
</script>

<style  lang='less' scoped>
@import "~@/assets/less/variable.less";
.tabs{
  display:flex;
  height: 46px;
  a{
    flex:1;
    text-align: center;
    line-height: 46px;
    font-size: @font-size-small;
    color: @color-text-l;
    &.router-link-active{
      &::after{
        content:"";
        display: block;
        margin: -10px auto 0 auto;
        width: 28px;
        height: 2px;
        background: @color-theme;
      }
      color: @color-theme;
    }
  }
}
</style>
