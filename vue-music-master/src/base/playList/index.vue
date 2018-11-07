<template>
  <transition name="list-fade">
    <div class="playlist">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text">{{modeTitle}}</span>
            <span class="clear" @click='clearALL()'>
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" ref='playList'>
          <transition  name="list">
            <ul>
              <li class="item" ref="listItem" v-for='(i,index) in playList' :key='i.key' @click='changeSong(index)'>
                <i class="current" :class='{"icon-play":index===currentIndex}'></i>
                <span class="text">{{i.name}}</span>
                <span class="like">
                  <i></i>
                </span>
                <span class="delete" @click.stop='del(i)'>
                  <i class="icon-delete"></i>
                </span>
              </li>
            </ul>
          </transition>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click='isClose'>
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Scroll from '@/base/scroll'
import {mapGetters,mapMutations,mapActions} from 'vuex'
import { MessageBox } from 'mint-ui';
import 'mint-ui/lib/style.css'
export default {
  props:{
    isListOpen:{
      type:Boolean,
      default:false
    }
  },
  components:{
    Scroll,
    MessageBox
  },
  computed:{
    modeTitle(){
      switch (this.mode) {
        case 0:
          return '顺序循环';
          break;
        case 1:
          return '随机播放';
          break;
        case 2:
          return '单曲循环';
          break;
      }
    },
    ...mapGetters(['mode','playList','currentIndex'])
  },
  methods:{
    isClose(){
      this.$emit('isCloseChange')
    },
    clearALL(){
      MessageBox.confirm('确定清除?').then(() => {
        this.clear();
        this.isClose();
      })
    },
    del(i){
      this.delOne(i)
    },
    changeSong(index){
      this.changeCurrentIndex(index)
    },
    ...mapActions(['delOne','clear']),
    ...mapMutations(['changeCurrentIndex'])
  },
  watch:{
    playList(val){
      setTimeout(()=>{
        this.$refs.playList.refresh()
      },20)
    },
    isListOpen(val){
      setTimeout(()=>{
        this.$refs.playList.refresh()
      },20)
    }
  }
}
</script>
<style scoped lang='less'>
@import "~@/assets/less/variable.less";
.playlist{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: @color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active{
    transition: opacity 0.3s;
    .list-wrapper{
      transition: all 0.3s;
    }
  }
  &.list-fade-enter, &.list-fade-leave-to{
    opacity: 0;
    .list-wrapper{
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: @color-highlight-background;
    .list-header{
      position: relative;
      padding: 20px 30px 10px 20px;
      .title{
        display: flex;
        align-items: center;
        .icon{
          margin-right: 10px;
          font-size: 30px;
          color: @color-theme-d;
        }
        .text{
          flex: 1;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
        .clear{
          .icon-clear{
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
      }
    }
    .list-content{
      max-height: 240px;
      overflow: hidden;
      .item{
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        &.list-enter-active, &.list-leave-active{
          transition: all 0.1s;
        }
        &.list-enter, &.list-leave-to{
          height: 0;
        }
        .current{
          flex: 0 0 20px;
          width: 20px;
          font-size: @font-size-small;
          color: @color-theme-d;
        }
        .text{
          flex: 1;
          font-size: @font-size-medium;
          color: @color-text-d
        }
        .like{
          margin-right: 15px;
          font-size: @font-size-small;
          color: @color-theme;
          .icon-favorite{
            color: @color-sub-theme;
          }
        }
        .delete{
          font-size: @font-size-small;
          color: @color-theme;
        }
      }
    }
    .list-operate{
      width: 140px;
      margin: 20px auto 30px auto;
      .add{
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid @color-text-l;
        border-radius: 100px;
        color: @color-text-l;
        .icon-add{
          margin-right: 5px;
          font-size: @font-size-small-s;
        }
        .text{
          font-size: @font-size-small;
        }
      }
    }
    .list-close{
      text-align: center;
      line-height: 50px;
      background: @color-background;
      font-size: @font-size-medium-x;
      color: @color-text-l;
    }
  }
}
</style>
