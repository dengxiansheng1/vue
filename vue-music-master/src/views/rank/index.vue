<template>
  <div class="rank" ref='rank'>
    <scroll class="topList" ref="rankWarpper">
      <ul>
        <li v-for='(i,index) in list' :key="i.key" @click = "details(i.id)">
          <img :src="i.picUrl">
          <div class="r" >
            <p v-for='(j,Index) in i.songList'>{{Index+1}} {{j.songname}}-{{j.singername}}</p>
          </div>
        </li>
      </ul>
    </scroll>
    <div class="loading" v-show="isLoading">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from '@/base/scroll'
import Loading from '@/base/loading'
import {getRankList} from '@/api'
import {myMixin} from '@/assets/js/mix'
export default {
  mixins:[myMixin],
  data () {
    return {
      list:[],
      isLoading:true,
    }
  },
  created(){
    this.getRank();
  },
  methods:{
    getRank:function(){
      getRankList().then((res)=>{
        this.list = res.data.topList
        this.isLoading = false
      })
    },
    details:function(id){
      this.$router.push({
        path:`/rank/${id}`
      })
    },
    refresh () {
      setTimeout(() => {
        this.$refs.rankWarpper.refresh()
      }, 20)
    },
    watchPlayList(playList){
      if(playList.length > 0){
        this.$refs.rank.style.bottom = '60px'
        this.refresh()
      }else{
        this.$refs.rank.style.bottom = '0'
        this.refresh()
      }
    }
  },
  components:{
    Scroll,
    Loading
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import "~@/assets/less/variable.less";
.rank{
  position:fixed;
  width:100%;
  top:90px;
  bottom:0;
  overflow: hidden;
  .topList{
    height: 100%;
    ul{
      padding: 20px 0;
      li~li{
        margin-top: 20px;
      }
      li{
        display: flex;
        padding: 0 20px;
        img{
          width: 100px;
          height:100px;
        }
        .r{
          flex:1;
          padding: 0 20px;
          height:100px;
          display:flex;
          justify-content:center;
          flex-direction:column;
          background: @color-highlight-background;
          font-size: @font-size-small;
          color: @color-text-d;
          overflow: hidden;
          p{
            text-overflow:ellipsis;
            overflow:hidden;
            white-space:nowrap;
            line-height:26px;
          }
        }
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
