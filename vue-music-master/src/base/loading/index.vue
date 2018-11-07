<template>
  <div class="loading">
     <img width="64" height="64" src="./loading.gif" alt="">
     <p class="desc">{{title}}</p>
   </div>
</template>

<script>
  export default {
    props:{
      title:{
        type:String,
        default:"loading..."
      }
    },
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

<style lang='less' scoped>
@import "~@/assets/less/variable.less";
.loading{
  width: 100%;
  text-align: center;
  img{
    width: 24px;
    height:24px;
  }
  .desc{
    line-height: 20px;
    font-size:@font-size-small;
    color: @color-text-l;
  }
}

</style>
