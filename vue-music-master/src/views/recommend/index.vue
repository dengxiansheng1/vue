<template>
  <div class="recommend_main" ref='recommend'>
    <scroll class="wrapper" ref="wrapper">
      <div class="content">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(i,index) in slide" :key="index"><img :src="i.picUrl" class="imgs"/></swiper-slide>
          <div class="swiper-pagination"  slot="pagination"></div>
        </swiper>
        <div class="container">
          <div class="title">
            <p>热门歌单推荐</p>
          </div>
          <ul class="list">
            <li v-for="i in songList" @click = "details(i.id)">
              <img :src="i.picUrl">
              <div class="r">
                <p class="author">{{i.songListAuthor}}</p>
                <p class="desc">{{i.songListDesc}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="loading" v-show="isLoading">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {getRecommend} from "@/api";
import Scroll from "@/base/scroll"
import Loading from "@/base/loading"
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {myMixin} from '@/assets/js/mix'
export default {
  mixins:[myMixin],
  data(){
    return{
      isLoading:true,
      h:0,
      slide:{},
      songList:{},
      swiperOption: {
        autoplay: {
          delay:2000,
          disableOnInteraction: false,
          stopOnLastSlide:false
        },
        speed: 1000,
        pagination : '.swiper-pagination',
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          bulletElement : 'li', //设定分页器指示器（小点）的HTML标签。
          clickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
        },
      }
    }
  },
  components: {
    swiper,
    swiperSlide,
  },
  created(){
    this.getSlide();
  },
  methods:{
    getSlide:function(){
      var _this = this;
      getRecommend().then(res=>{
        _this.slide = res.data.slider
        _this.songList = res.data.songList
        _this.isLoading = false
      })
    },
    details:function(id){
      this.$router.push({
        path:`/recommend/${id}`
      })
    },
    watchPlayList(playList){
      if(playList.length>0){
        this.$refs.recommend.style.bottom = '60px'
        this.$refs.wrapper.refresh()
      }else{
        this.$refs.recommend.style.bottom = '0'
        this.$refs.wrapper.refresh()
      }
    }
  },
  components:{
    Scroll,
    Loading
  }
}
</script>


<style lang='less' scoped>
@import "~@/assets/less/variable.less";
.recommend_main{
  position: fixed;
  top: 90px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .wrapper{
    height: 100%;
    .content{
      position: absolute;
      top:0;
      left: 0;
      width: 100%;
      height:auto;
    }
  }
}
.swiper-container{
  div{
    div{
      .imgs{
        width: 100%;
      }
    }
  }
}
.container{
  .title{
    height: 64px;
    p{
      text-align: center;
      line-height: 64px;
      font-size: 14px;
      color: #c7c232
    }
  }
}
.list{
  padding: 0 20px 20px 20px;
  li~li{
    margin-top: 20px;
  }
  li{
    height: 60px;
    display: flex;
    img{
      height: 60px;
    }
    .r{
      display: flex;
      flex-direction: column ;
      justify-content: center;
      padding: 0 20px;
      .author{
        width: 200px;
        font-size: 0.16px;
        color: #ffffff;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .desc{
        margin-top: 10px;
        font-size: 14px;
        color: #606060;
      }
    }
  }
}
.loading{
  position: absolute;
  width: 100%;
  top:50%;
  transform: translateY(-50%);
}
</style>
