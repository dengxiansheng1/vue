<template>
  <div class="list" ref='singerlist'>
    <scroll class="list-view" ref="singerlistView" @scroll="scroll" :listenScroll=true :probeType=3>
      <ul>
        <li class="list-group" ref="listGroup" v-for="i in list" :key="i.key" >
          <h2 class="list-group-title">{{i.title}}</h2>
          <ul>
            <li class="list-group-item" v-for="b in i.items" :key="b.key" @click = "details(b.id)">
              <img alt="" class="avatar" :src="b.img">
              <span class="name">{{b.name}}</span>
            </li>
          </ul>
        </li>
      </ul>

      <!--右侧快速定位列表-->
      <div class="list-shortcut" @touchstart="touchStart" @touchmove.stop.prevent="touchMove">
        <ul>
          <li class="item" v-for="(c,index) in touchList" :key='c.key' :data-index="index" :class="{current:currentIndex == index}">{{c}}</li>
        </ul>
      </div>

      <div class="fixed" ref="fixed" v-show="fixedTitle">
        {{fixedTitle}}
      </div>

      <div class="loading" v-show="isLoading">
        <loading></loading>
      </div>
      <router-view></router-view>
    </scroll>
  </div>

</template>

<script>
import Scroll from '@/base/scroll'
import Loading from '@/base/loading'
import {myMixin} from '@/assets/js/mix'
export default {
  mixins:[myMixin],
  props:{
    list:{
      type:Array,
      default:[]
    }
  },
  data(){
    return {
      //建立一个对象存储第一次手指触摸的位置及index
      touch:{},
      currentIndex:0,
      listHeight:[],
      scrollY:0,
      isLoading:true,
    }
  },
  components:{
    Scroll,
    Loading
  },
  updated () {
    this.getLiHeight();
    this.isLoading = false
  },
  computed: {
    touchList(){
      let arr = [];
      for(let i=0; i<this.list.length;i++){
        arr.push(this.list[i].title.substring(0,1))
      }
      return arr;
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.list[this.currentIndex] ? this.list[this.currentIndex].title : ''
    }
  },
  methods:{
    refresh () {
      setTimeout(() => {
        this.$refs.singerlistView.refresh()
      }, 20)
    },
    watchPlayList(playList){
      if(playList.length>0){
        this.$refs.singerlist.style.bottom = '60px'
      }else{
        this.$refs.singerlist.style.bottom = '0'
      }
      this.refresh()
    },
    touchStart(ev){
      //获取手指点击的那个li的下标
      let cIndex = ev.target.attributes['data-index'].value
      //手指触摸时记录当前的index还有位置
      this.touch.index = cIndex
      this.touch.y1 = ev.touches[0].pageY

      this.scrollTo(cIndex)
    },
    touchMove(ev){
      //手指在滑动时也要记录滑动的位置
      this.touch.y2 = ev.touches[0].pageY
      //计算滑动的距离经过几个li，向下取整(自行百度Math.floor 和 | 0)
      let aIndex = (this.touch.y2 - this.touch.y1) / 18 | 0
      let cIndex = aIndex + parseInt(this.touch.index)

      this.scrollTo(cIndex)
    },
    scrollTo(index){
      this.scrollY = -this.listHeight[index]
      //左边的scroll也跳转至点击的cIndex
      this.$refs.singerlistView.scrollToElement(this.$refs.listGroup[index],0)
    },
    scroll(pos){
      this.scrollY = pos.y
    },
    //获取所有li单独的高度
    getLiHeight(){
      const  list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height)
      for(let i=0;i<list.length;i++){
        height += list[i].clientHeight;
        this.listHeight.push(height)
      }
    },
    details:function(id){
      this.$router.push({
        path:`/singers/${id}`
      })
    }
  },
  watch:{
    scrollY(v){
      //顶端
      if(v>0){
        this.currentIndex = 0
        return
      }
      //中间
      for(let i=0;i<this.listHeight.length;i++){
        let h1 = this.listHeight[i]
        let h2 = this.listHeight[i+1]
        //v是负数
        if(-v >= h1 && -v < h2){
          this.currentIndex = i
          return
        }
      }
      //底下
      this.currentIndex = this.listHeight.length
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/variable.less";
.list{
  position: fixed;
  width: 100%;
  top:90px;
  bottom:0;
  overflow: hidden;
  background: @color-background;
  .list-view{
    height:100%;
    .list-group{
      padding-bottom: 30px;
      .list-group-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size:@font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
      .list-group-item{
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name{
          margin-left: 20px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }
      }
    }
    .list-shortcut{
      position: absolute;
      z-index: 30;
      right: 0;
      top: 47%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: @color-background-d;
      font-family: Helvetica;
      .item{
        padding: 3px;
        line-height: 1;
        color: @color-text-l;
        font-size: @font-size-small;
        &.current{
          color: @color-theme;
        }
      }
    }
    .list-fixed{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
    }
    .fixed{
      position: absolute;
      top: 0;
      padding: 0 20px;
      width: 100%;
      height: 30px;
      line-height: 30px;
      background: @color-highlight-background;
      font-size: @font-size-small;
      color: @color-text-l
    }
    .loading{
      position: absolute;
      width: 100%;
      top:50%;
      transform: translateY(-50%);
    }
  }
}

</style>
