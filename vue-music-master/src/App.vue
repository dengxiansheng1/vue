<template>
  <div id="app" ref="app">
    <music-header> </music-header>
    <tabs></tabs>
    <router-view/>
    <player></player>
  </div>
</template>

<script>
import MusicHeader from '@/components/musicHeader';
import Tabs from '@/components/tabs';
import 'swiper/dist/css/swiper.css';
import player from '@/base/player'
export default {
  components:{
    MusicHeader,
    Tabs,
    player
  },
}
</script>

<style lang='less'>
@import "~@/assets/less/index.less";

#app {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
