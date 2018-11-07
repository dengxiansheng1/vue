<template>
  <div class="progress-bar"
    ref="progressBar"
    @click='progressClick' >
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd">
        <div class="progress-btn" ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    percent:{
      type:Number,
      default:0
    }
  },
  data(){
    return {
      touch:{},
      isToucn:false
    }
  },
  methods: {
    progressClick(e){
      //点击时的x坐标
      let x = e.pageX - this.$refs.progressBar.offsetLeft
      this.changeOffset(x)
      this.rePercent()
    },
    changeOffset(x){
      this.$refs.progressBtn.style.transform = `translate(${x}px,0)`
      this.$refs.progress.style.width = `${x}px`
    },
    rePercent(){
      this.$emit('changePercent',this.$refs.progress.clientWidth/(this.$refs.progressBar.clientWidth - 16))
    },
    progressTouchStart(e){
      this.touch.x1 = e.touches[0].pageX;
      this.touch.w = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e){
      this.isToucn = true
      let oX = e.touches[0].pageX
      if( e.touches[0].pageX > this.$refs.progressBar.clientWidth + this.$refs.progressBar.offsetLeft - 8){
        oX = this.$refs.progressBar.clientWidth + this.$refs.progressBar.offsetLeft
      }
      if(e.touches[0].pageX < this.$refs.progressBar.offsetLeft){
        oX = this.$refs.progressBar.offsetLeft
      }
      this.touch.x2 = oX;
      let offset = this.touch.x2 - this.touch.x1 + this.touch.w;
      this.changeOffset(offset)
      this.rePercent()
    },
    progressTouchEnd(){
      this.isToucn = false
    }
  },
  watch:{
    percent(val){
      if(this.isToucn){
        return
      }
      let w = this.$refs.progressBar.clientWidth - 16;
      let offset = val *  w;
      this.changeOffset(offset)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/assets/less/variable.less";
.progress-bar{
  height: 30px;
  .bar-inner{
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress{
      position: absolute;
      height: 100%;
      background: @color-theme;
    }
    .progress-btn-wrapper{
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn{
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid @color-text;
        border-radius: 50%;
        background: @color-theme;
      }
    }
  }
}
</style>
