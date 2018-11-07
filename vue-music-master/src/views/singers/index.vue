<template>
  <singers-list :list="list"></singers-list>
</template>

<script>
import SingersList from '@/views/singersList'
import {getSingerList} from '@/api'
  export default {
    data() {
      return {
        list:[]
      }
    },
    created() {
      this.getSinger()
    },
    methods: {
      getSinger:function(){
        getSingerList().then(res=>{
          this.list = this.newSinger(res.data.list)
        })
      },
      newSinger(list){
        let nList = {
          hot:{
            title:'热门',
            items:[]
          }
        }
        list.forEach((item,index)=>{
          if(index<10){
            nList.hot.items.push({
              id:item.Fsinger_mid,
              name:item.Fsinger_name,
              img:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
            })
          }
          if(!nList[item.Findex]){
            nList[item.Findex] = {
              title:item.Findex,
              items:[]
            }
          }
          nList[item.Findex].items.push({
            id:item.Fsinger_mid,
            name:item.Fsinger_name,
            img:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        })
        let hot = [];
        let other = [];
        for(var k in nList){
          if(nList[k].title == '热门'){
            hot.push(nList[k])
          }else if(nList[k].title.match(/[a-zA-Z]/)){
            other.push(nList[k])
          }
        }
        other.sort((a,b)=>{
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(other)
      }
    },
    components:{
      SingersList
    }
  }
</script>

<style>
</style>
