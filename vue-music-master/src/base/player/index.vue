<template>
  <div class="player" v-show="playList.length > 0">
    <transition name='normal' >
      <div class="normal" v-show='fullScreen'>
        <!-- 背景 -->
        <div class="bg">
          <img  :src='currentSong.img' width="100%" height="100%">
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back" @click='back'>
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle"><span v-for='i in currentSong.singer' :key='i.key'>{{i.name}} </span>{{currentSong.album}}</h2>
        </div>
        <!--cd-->
        <swiper :options="swiperOption" class="middle">
          <swiper-slide>
            <!-- 播放器 -->
            <div class="middle-l" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" :class='cdState'>
                  <img :src="currentSong.img" class="image">
                </div>
              </div>
              <!-- 歌词 -->
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{currentLrc}}</div>
              </div >
            </div>
          </swiper-slide>
          <swiper-slide>
            <!--歌词滚动-->
            <scroll class="middle-r" ref="lyriclist">
              <div class="lyric-wrapper">
                <div v-for='(i,index) in lrc.lines' ref='lrcLine'><p ref="lyricLine" class="text" :class='{current:index===currentLine}'>{{i.txt}}</p></div>
              </div>
            </scroll>
          </swiper-slide>
        </swiper>
        <!--底部按钮控制部分-->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{getCurrTime}}</span>
            <!--播放进度条-->
            <div class="progress-bar-wrapper">
              <progress-bar :percent='percent' @changePercent='nProgress'></progress-bar>
            </div>
            <span class="time time-r">{{getTime}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click='reMode'>
              <i :class='handle'></i>
            </div>
            <div class="icon i-left" @click='prev'>
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click='togglePlay'>
              <i :class='btnState'></i>
            </div>
            <div class="icon i-right" @click='next'>
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--播放页面小屏 底部-->
    <transition name="mini">
      <div class="mini-player" v-show='!fullScreen' @click='back()'>
        <div class="icon">
          <img alt="" :src='currentSong.img' width="40" height="40" :class='cdState'>
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc"></p>
        </div>
        <div class="control">
          <!--阻止冒泡-->
          <i @click.stop="togglePlay" class="icon-mini" :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop='openList'></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
    :src='currentSong.url'
    @canplay='changeIsReady'
    @error='changeIsReady'
    @timeupdate='updateTime'
    @ended='ended'>
  </audio>
  <play-list v-show='isListOpen' @isCloseChange='openList' :isListOpen='isListOpen'></play-list>
</div>
</template>

<script>
import Scroll from "@/base/scroll"
import {mapGetters,mapMutations} from 'vuex'
import ProgressBar from '@/base/progressBar'
import { Base64 } from 'js-base64';
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {getLyric} from '@/api'
import Lyric from 'lyric-parser'
import PlayList from '@/base/playList'
export default {
  data() {
    return {
      ready:false,
      currTime:'',
      lrc:{},
      currentLrc:'',
      currentLine:0,
      oldPlayList:[],
      isListOpen:false,
      swiperOption: {
        pagination: {
          el: '.dot-wrapper',
          type: 'bullets',
          bulletClass : 'dot',
          bulletActiveClass:'active',
        },
      }
    }
  },
  computed:{
    cdState:function(){
      return this.playing?'play':'pause'
    },
    btnState:function(){
      return this.playing?'icon-pause':'icon-play'
    },
    miniIcon:function(){
      return this.playing?'icon-pause-mini':'icon-play-mini'
    },
    getTime(){
      let m = this.currentSong.interval/60|0;
      let s = this.currentSong.interval%60|0;
      //判断s是否小于10
      s = s<10? `0${s}`:s
      return s == 0? `${m}:00`:`${m}:${s}`
    },
    getCurrTime(){
      let m = this.currTime/60|0;
      let s = this.currTime%60|0;
      //判断s是否小于10
      s = s<10? `0${s}`:s
      return s == 0? `${m}:00`:`${m}:${s}`
    },
    percent(){
      return this.currTime/this.currentSong.interval
    },
    handle(){
      let cl = '';
      switch (this.mode) {
        case 0:
        cl = 'icon-sequence'
        break;
        case 1:
        cl = 'icon-random'
        break;
        case 2:
        cl = 'icon-loop'
        break;
      }
      return cl
    },
    ...mapGetters([
      'playList',
      'fullScreen',
      'playing',
      'currentIndex',
      'currentSong',
      'mode'
    ])
  },
  methods: {
    back(){
      this.changeFullScreen(!this.fullScreen)
    },
    togglePlay(){
      if(!this.ready){
        return
      }
      this.changePlaying(!this.playing)
      if(this.lrc.lrc){
        this.lrc.togglePlay()
      }
    },
    next(){
      if(!this.ready){
        return
      }
      if(this.mode == 2){
        this.loop()
      }else{
        let index = this.currentIndex+1
        if( index== this.playList.length){
          index = 0;
        }
        this.changeCurrentIndex(index)
        if(!this.playing){
          this.togglePlay()
        }
        if(this.lrc.lrc){
          this.lrc.stop()
        }
      }
    this.ready = false
    },
    prev(){
      if(!this.ready){
        return
      }
      if(this.mode == 2){
        this.loop()
      }else{
        let index = this.currentIndex - 1
        if( index== -1){
          index = this.playList.length - 1;
        }
        this.changeCurrentIndex(index)
        if(!this.playing){
          this.togglePlay()
        }
        if(this.lrc.lrc){
          this.lrc.stop()
        }
      }
      this.ready = false
    },
    loop(){
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play()
      if(this.lrc.lrc){
        this.lrc.seek(0)
      }
    },
    changeIsReady(){
      this.ready = true
    },
    updateTime(e){
      this.currTime = e.target.currentTime
    },
    nProgress(val){
      this.$refs.audio.currentTime = val * this.currentSong.interval
      if(this.lrc.lrc){
        this.lrc.seek(this.$refs.audio.currentTime*1000)
      }

    },
    reMode(){
      let mode = (this.mode + 1) % 3
      this.changeMode(mode)
      let list = []
      if (mode === 1) {
        this.oldPlayList = this.playList
        list = this.randomSort(this.playList)
      } else {
        if(this.oldPlayList!=[]){
          list = this.oldPlayList
        }else{
          list = this.playList
        }
      }
      //确保在随机播放模式下，点击一个歌曲，index会发生变化（不再是原来的顺序播放的index），所以要重新在随机播放列表中去寻找这首歌的index
      this.resetCurrentIndex(list);
      this.changePlayList(list)
    },
    resetCurrentIndex(list){　　　　
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.changeCurrentIndex(index);
    },
    randomSort(arr){
      let array = arr.slice()
      array.sort(function () {
        return 0.5 - Math.random()
      })
      return array
    },
    ended(){
      switch (this.mode) {
        case 0:
        this.next();
        break;
        case 1:
        this.next();
        break
        case 2:
        this.loop();
        break
      }
      if(this.lrc.lrc){
        this.lrc.stop()
      }
    },
    onGetLyric(){
      getLyric(this.currentSong.id).then(res =>{
        this.lrc = new Lyric(Base64.decode(res.lyric),this.hanlder)
        if(this.playing){
          this.lrc.play()
        }
      })
    },
    hanlder({lineNum, txt}){
      this.currentLine = lineNum
      if(lineNum>5){
        let lineEl = this.$refs.lrcLine[lineNum - 5]
        this.$refs.lyriclist.scrollToElement(lineEl,300)
      }else{
        this.$refs.lyriclist.scrollTo(0,0,300)
      }
      this.currentLrc = txt
    },
    openList(){
      this.isListOpen = !this.isListOpen
    },
    ...mapMutations([
      'changePlaying',
      'changeFullScreen',
      'changeCurrentIndex',
      'changeMode',
      'changePlayList'
    ])
  },
  components:{
    Scroll,
    ProgressBar,
    PlayList
  },
  watch:{
    playing(val){
      this.$nextTick(()=>{
        val ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    },
    currentSong(val){
      if(val.url){
        this.$nextTick(()=>{
          if(this.lrc.lrc){
            this.lrc.stop()
          }
          this.onGetLyric()
          this.$refs.audio.play()
        })
      }
    },
  },
}
</script>

<style lang='less'>
@import "~@/assets/less/variable.less";
.player{
  .normal{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: @color-background;
    .bg{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter:blur(20px);
    }
    .top{
      position: relative;
      margin-bottom: 25px;
      .back{
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back{
          display: block;
          padding: 9px;
          font-size:@font-size-large-x;
          color: @color-theme;
          transform: rotate(-90deg);
        }
      }
      .title{
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        font-size: @font-size-large;
        color: @color-text;
      }
      .subtitle{
        line-height: 20px;
        text-align: center;
        font-size: @font-size-medium;
        color: @color-text;
      }
    }
    .middle{
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-style: 0;
      .middle-l{
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper{
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd{
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255,255,255,0.1);
            border-radius: 50%;
            &.play{
              animation: rotate 20s linear infinite;
            }
            &.pause{
              animation-play-state:paused;
            }
            .image{
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-wrapper{
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .player-lyric{
            height: 20px;
            line-height: 20px;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
        }
      }
      .middle-r{
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper{
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text{
            line-height: 32px;
            color: @color-text-l;
            font-size: @font-size-medium;
            &.current{
              color:@color-text;
            }
          }
        }
      }
    }
    .bottom{
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper{
        text-align: center;
        font-size: 0;
        .dot{
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: @color-text-l;
          &.active{
            width: 20px;
            border-radius: 5px;
            background: @color-text-ll;
          }
        }
      }
      .progress-wrapper{
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time{
          color:@color-text;
          font-style: @font-size-small;
          flex:0 0 30px;
          line-height: 30px;
          width: 48px;
          &.time-l{
            text-align: left;
          }
          &.time-r{
            text-align: right;
          }
        }
        .progress-bar-wrapper{
          flex:1;
        }
      }
      .operators{
        display: flex;
        align-items: center;
        .icon{
          flex:1;
          color:@color-theme;
          &.disable{
            color:@color-theme-d;
          }
          i{
            font-size: 30px;
          }
        }
        .i-left{
          text-align: right;
        }
        .i-center{
          padding: 0 20px;
          text-align: center;
          i{
            font-size: 40px;
          }
        }
        .i-right{
          text-align: left;
        }
        .icon-favorite{
          color:@color-sub-theme;
        }
      }
    }
  }
  .mini-player{
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: @color-highlight-background;
    &.mini-enter,&mini-leave-to{
      opacity: 0;
    }
    .icon{
      flex:0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img{
        border-radius: 50%;
        &.play{
          animation: rotate 10s linear infinite;
        }
        &.pause{
          animation-play-state: paused;
        }
      }
    }
    .text{
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name{
        margin-bottom: 2px;
        font-size: @font-size-medium;
        color:@color-text;
      }
      .desc{
        font-size: @font-size-small;
        color:@color-text-d;

      }
    }
    .control{
      flex:0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini,.icon-pause-mini,.icon-playlist{
        font-size: 30px;
        color:@color-theme-d;
      }
    }
  }
}
@keyframes rotate{
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}
.normal-enter-active,&.normal-leave-active{
  transition: all 0.4s;
  .top,.bottom{
    transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32);
  }
}
.normal-enter,&.normal-leave-to{
  opacity: 0;
  transform: translate3d(0, 100%,0);
  .top{
    transform: translate3d(0,100px,0);
  }
  .bottom{
    transform: translate3d(0,100px,0);
  }
}
</style>
