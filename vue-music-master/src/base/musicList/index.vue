<template>
  <div class="details" ref='playList'>

    <div class="title">
      <span class="icon-back" @click="back"></span>
      <p>{{title}}</p>
    </div>

    <div class="header" ref="hd" :style='bgStyle'>
      <div class="random" ref='bt' v-show='!isLoading'>
        <span><span class="icon-play" @click='playAll()'></span>随机播放全部</span>
      </div>
    </div>

    <div class="bg-layer" ref="layer"></div>
      <scroll ref='list' class="list" @scroll='scroll' :listenScroll=true :probeType = 3>
        <ul>
          <li v-for='(i,Index) in songList'
            :key="i.key"
            @click='addPlayerList(i,Index)'>
            <div class="rank">
              {{Index+1}}
            </div>
            <div class="r">
              <p>{{i.name}}</p>
              <p><span v-for="b in i.singer">{{b.name}} . </span>{{i.album}}</p>
            </div>
          </li>
        </ul>
      </scroll>

    <div class="loading" v-show="isLoading">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import Scroll from "@/base/scroll";
import Loading from "@/base/loading"
import {mapActions,mapGetters,mapMutations} from 'vuex'
import {myMixin} from '@/assets/js/mix'
export default {
  mixins:[myMixin],
  props:{
    title:{
      type:String,
      default:''
    },
    bgUrl:{
      type:String,
      default:''
    },
    songList:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      scrollY : 0,
      isLoading:true
    }
  },
  mounted(){
    //给定一个变量h来储存scroll的高度
    this.h = this.$refs.hd.clientHeight;
    this.$refs.list.$el.style.top = `${this.h}px`;
    this.ty = - this.h + 44
  },
  methods: {
    back:function(){
      this.$router.back();
    },
    scroll:function(pos){
      this.scrollY = pos.y
    },
    addPlayerList(i,index){
       this.addPlayer({
         list:this.songList,
         index:index
       })
    },
    playAll(){
      this.changeMode(1)
      this.addPlayer({
        list:this.songList,
        index:0
      })
    },
    refresh () {
      setTimeout(() => {
        this.$refs.list.refresh()
      }, 20)
    },
    watchPlayList(playList){
      if(playList.length>0){
        this.$refs.playList.style.bottom = '60px'
        this.$refs.list.$el.style.bottom = '60px'
        this.refresh()
      }else{
        this.$refs.playList.style.bottom = '0'
        this.$refs.list.$el.style.bottom = '0'
        this.refresh()
      }
    },
    ...mapActions(['addPlayer']),
    ...mapMutations(['changeMode'])
  },
  components:{
    Scroll,
    Loading
  },
  updated(){
    this.isLoading = false
  },
  computed:{
    bgStyle () {
      return `background-image: url(${this.bgUrl})`
    },
    ...mapGetters([
      'playList',
      'fullScreen',
      'playing',
      'currentIndex',
      'currentSong',
    ])
  },
  watch:{
    scrollY(v){
      let translateY = Math.max(this.ty,v)
      let zIndex = 0;
      let scale = 1;
      const p = Math.abs(v/this.h)
      if(v>0){
        zIndex = 10
        scale = 1 + p
      }
      this.$refs.layer.style['transform'] = `translate(0,${translateY}px)`
      if(v<this.ty){
        zIndex = 10
        this.$refs.hd.style.paddingTop = 0
        this.$refs.hd.style.height = '44px'
        this.$refs.bt.style.display = 'none'
      }else{
        this.$refs.hd.style.paddingTop = '70%'
        this.$refs.hd.style.height = 0
        this.$refs.bt.style.display = 'block'
      }
      this.$refs.hd.style.zIndex=zIndex
      this.$refs.hd.style.transform= `scale(${scale})`
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/assets/less/variable.less";


.details{
  position:fixed;
  width: 100%;
  top:0;
  bottom:0;
  overflow: hidden;
  background: @color-background;
  z-index:100;
  .title{
    position: absolute;
    top:0;
    width: 100%;
    left: 0;
    z-index:20;
    height:40px;
    p{
      width: 100%;
      text-align: center;
      line-height: 40px;
      font-size: @font-size-large;
    }
    .icon-back{
      position: absolute;
      top:10px;
      left: 20px;
      font-size: 20px;
      color:@color-theme;
    }
  }
  .header{
    position: relative;
    top:0;
    width: 100%;
    padding-top: 70%;
    background-repeat: no-repeat;
    background-size: 100%;
    .random{
      position: absolute;
      bottom:20px;
      left:50%;
      margin-left:-66px;
      width: 132px;
      border: 1px solid @color-theme;
      border-radius: 25px;
      font-size:@font-size-medium;
      padding: 7px 0;
      span{
        display: flex;
        align-items: center;
        justify-content: center;
        color:@color-theme;
      }
      .icon-play{
        margin-right: 6px;
        font-size: @font-size-medium-x;
      }
    }
  }
  .bg-layer{
    position: relative;
    height: 100%;
    background-color: @color-background
  }
  .list{
    position: fixed;
    top:0;
    bottom:0;
    /* overflow: hidden; */
    width: 100%;
    background: @color-background;
    font-size: @font-size-small;
    transition:  all 0.5s;
    ul{
      padding: 33px 30px;
      li{
        display: flex;
        .rank{
          width: 25px;
          margin-right: 30px;
          color: @color-theme ;
          text-align:center;
          font-size: @font-size-medium-x;
        }
        .r{
          overflow: hidden;
          p{
            font-size:@font-size-small;
            text-overflow:ellipsis;
            overflow:hidden;
            white-space:nowrap;
          }
          p:nth-child(2){
            margin-top: 12px;
            color:@color-text-d;
          }
        }
      }
      li~li{
        margin-top: 33px;
      }
    }
  }
  .loading{
    position: absolute;
    width: 100%;
    top:50%;
    transform: translateY(-50%);
  }
}
</style>
