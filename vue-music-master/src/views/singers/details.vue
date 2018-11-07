<template>
    <transition name="slide">
      <music-list
      :title="title"
      :bgUrl="bgUrl"
      :songList="songList"></music-list>
    </transition>
</template>

<script>
import MusicList from '@/base/musicList'
import {getSingerInfo} from '@/api'
  export default {
    data() {
      return {
        title:'',
        bgUrl:'',
        songList:[],
      }
    },
    created() {
      this.getSingerInfoList()
    },
    methods: {
      getSingerInfoList:function(){
        getSingerInfo(this.$route.params.id).then(res=>{
          let nSong = []
          for(var i in res.data.list){
            nSong.push(res.data.list[i].musicData)
          }
          this.title = res.data.singer_name;
          this.bgUrl = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${res.data.singer_mid}.jpg?max_age=2592000`;
          this.songList = this.editSongs(nSong);
        })
      },
      editSongs(list){
        let nSongList = [];
        for(let i = 0;i<list.length;i++){
          let item = {
            id:list[i].songid,
            mid:list[i].songmid,
            name:list[i].songname,
            album:list[i].albumname,
            interval:list[i].interval,
            img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].albummid}.jpg?max_age=2592000`,
            url:`http://dl.stream.qqmusic.qq.com/C400${list[i].songmid}/${list[i].songid}.m4a?guid=983915916&fromtag=66`,
            singer:list[i].singer
          }
          nSongList.push(item)
        }
        return nSongList;
      }
    },
    components:{
      MusicList
    }
  }
</script>

<style lang='less' scoped>
.slide-enter-active,.slide-leave-active{
  transition: all 0.3s;
}
.slide-enter,.slide-leave-to{
  transform: translate(100%,0);
}
</style>
