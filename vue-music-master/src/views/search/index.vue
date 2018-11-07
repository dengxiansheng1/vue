<template>
  <div class="search" ref='search'>

    <div class="search_box">
      <div class="in">
        <span class="icon-search"></span>
        <input type="text" placeholder="搜索歌曲、歌手" v-model="keyWords">
        <span class="icon-dismiss" v-show='isShowBack' @click='close'></span>
      </div>
    </div>

    <scroll class="scroll"  ref='scroll'>
      <div class="list">
        <div class="hot" v-show='isShowHot'>
          <h3>热门搜索</h3>
          <div class="hot_s">
            <p class="i"
            v-for='(i,index) in hotkey'
            :key='i.key'
            @click="details(i.k)">{{i.k}}</p>
          </div>
        </div>
      </div>

      <div class="search_details" v-show='isShowView' ref='search_details'>
        <div class="lists" ref="listsbscroll" >
          <ul ref='list'>
            <li v-for='(i,index) in list' :key='i.key' @click='addSong(i,index)'>
              <span class="icon-music"></span><p>{{i.name}}-<span v-for='(j,Index) in i.singer'>{{j.name}}</span></p>
            </li>
            <li class="loading" v-show="isShowFixedL" ><loading></loading></li>
          </ul>
          <div class="no-result" v-show='isShowNotFound||!list.length'>
            <div class="no-result-icon"></div>
            <p class="no-result-text">抱歉，暂无搜索结果</p>
          </div>
        </div>
        <div class="loading" v-show="iSLoading">
          <loading></loading>
        </div>
      </div>

    </scroll>

    <div class="loading" v-show="isLoading">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import  Loading from '@/base/loading'
import  Scroll from '@/base/scroll'
import  {getHotKey} from '@/api'
import {search} from '@/api'
import {myMixin} from '@/assets/js/mix'
import {mapActions} from 'vuex'
export default {
  mixins:[myMixin],
  data () {
    return {
      keyWords:'',
      hotkey:[],
      songList:[],
      pullUp: true,
      isLoading:true,
      isShowHot:true,
      isShowBack:false,
      isShowView:false,
      iSLoading:true,
      isShowFixedL:false,
      isShowNotFound:false,
      refreshDelay: 100,
      maxP:1,
      p:0,
      n:20,
      list:[],
      maxP:0
    }
  },
  created(){
    this.getHotKeyList()
  },
  mounted(){
    this.scrollFn()
  },
  methods:{
    getHotKeyList:function(){
      getHotKey().then((res)=>{
        let arr = [];
        for(var i in res.data.hotkey){
          if(i<10){
            arr.push(res.data.hotkey[i])
          }
        }
        this.hotkey = arr;
        this.isLoading = false
      })
    },
    details:function(i){
      this.keyWords = i;
    },
    close:function(){
      this.keyWords = ''
      this.isShowHot = true
      this.isShowBack = false
      this.isShowView = false
      this.k = 1;
      this.maxP = 0;
    },
    history:function(){
      this.isShowHistry = false;
    },
    searchMore() {
      if(this.p == this.maxP){
        this.isShowFixedL = true
        return
      }else{
        this.p ++
        search(this.keyWords, this.p, this.n).then(res => {
          if (res.code === 0) {
            console.log(this.p)
            this.list = this.list.concat(res.data.song.list)
            this.isShowFixedL = false;
            this.scroll.refresh()
          }
        })
      }
    },
    scrollFn(){
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.listsbscroll, {
            click:false,
            tap:false,
            probeType: 3
          });
        }else{
          this.scroll.refresh();
        }
        this.scroll.on('touchEnd', (pos) => {
          const _this = this
          if(this.scroll.maxScrollY >pos.y){
            this.isShowFixedL = true
            this.scroll.refresh()
            setTimeout(function(){
              _this.searchMore()
            },6000);
          }
        })
      });
    },
    refresh () {
      setTimeout(() => {
        this.scroll.refresh()
      }, 20)
    },
    watchPlayList(playList){
      if(playList.length>0){
        this.$refs.search.style.bottom = '60px'
        this.$refs.scroll.refresh()
        this.$refs.search_details.style.bottom = '60px'
        this.refresh()
      }else{
        this.$refs.search.style.bottom = '0'
        this.$refs.scroll.refresh()
        this.$refs.search_details.style.bottom = '0'
        this.refresh()
      }
    },
    addSong(item,index){
      console.log(item)
      let arr = {
        id:item.id,
        mid:item.mid,
        name:item.name,
        album:item.album.name,
        interval:item.interval,
        img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.album.mid}.jpg?max_age=2592000`,
        url:`http://dl.stream.qqmusic.qq.com/C400${item.mid}/${item.id}.m4a?guid=983915916&fromtag=66`,
        singer:item.singer
      }
      this.songList.push(arr)
      this.addPlayer({
        list:this.songList,
        index:index
      })
    },
    ...mapActions(['addPlayer'])
  },
  components:{
    Loading,
    Scroll,
  },
  watch:{
    keyWords(k){
      if(!this.keyWords){
        return
      }
      this.isShowHot = false
      this.isShowBack = true
      this.isShowView = true
      this.iSLoading = true
      search(this.keyWords,this.p,this.n).then(
        res=>{
          // this.list = this.list.concat(res.data.song.list)
          this.maxP = res.data.song.totalnum/this.n;
          search(this.keyWords,this.p,this.n).then(
            res=>{
              if (res.code == 0||!res.code.ok){
                this.list = res.data.song.list
                this.iSLoading = false;
                this.isShowNotFound = false;
              }else{
                this.isShowNotFound = true;
              }
            }
          )
        })
      }
    }
  }
  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style lang='less' scoped>
  @import "~@/assets/less/variable.less";
  .search{
    position:fixed;
    width:100%;
    top:90px;
    bottom:0;
    overflow: hidden;
    .scroll{
      height: auto;
    }
    .search_box{
      margin: 20px;
      .in{
        display:flex;
        align-items:center;
        padding: 0 8px;
        height: 40px;
        border-radius:6px;
        background: @color-highlight-background;
        .icon-search{
          font-size: @font-size-large-x;
          color: @color-background;
        }
        input{
          flex: 1;
          margin: 0 6px;
          line-height: @font-size-large;
          background:@color-highlight-background;
          border: 0;
          outline: 0;
          font-size: @font-size-medium;
          color: @color-text;
        }
        .icon-dismiss{
          font-size: @font-size-medium-x ;
          color:@color-background;
        }
      }
    }
    .hot{
      padding: 10px 20px;
      h3{
        margin-bottom:20px;
        font-size:@font-size-medium;
        color:@color-text-l;
      }
      .hot_s{
        display: flex;
        flex-wrap: wrap;
        .i{
          padding:5px 10px;
          margin:0 20px 10px 0;
          background: @color-highlight-background ;
          font-size: @font-size-medium;
          color: @color-text-d ;
          border-radius: 6px;
        }
      }
    }
    .search_details{
      position:fixed;
      width:100%;
      top:176px;
      bottom:0;
      overflow: hidden;
      .lists{
        height: 100%;
        overflow: hidden;
        ul{
          padding: 0 30px;
          li{
            display: flex;
            overflow: hidden;
            margin-bottom: 20px;
            .icon-music{
              font-size:@font-size-medium ;
              color:@color-text-d ;
              margin-right: 20px;
            }
            p{
              text-overflow:ellipsis;
              white-space:nowrap;
              overflow: hidden;
              font-size:@font-size-medium;
              color:@color-text-d;
            }
          }
        }
        .no-result{
          text-align: center;
          .no-result-icon{
            width: 86px;
            height: 90px;
            margin: 0 auto;
            background: url('no-result@2x.png');
            background-size: 86px 90px;
          }
          .no-result-text{
            margin-top: 30px;
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
      }

    }
  }
  .search>.loading{
    position: fixed;
    width: 100%;
    top:90px;
    bottom: 0;
  }
  .search_details>.loading{
    position: fixed;
    top:176px;
    bottom: 0;
    width: 100%;
    background: @color-background;
    div{
      margin-top: 20%;
    }
  }
  </style>
