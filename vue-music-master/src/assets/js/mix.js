import {mapGetters} from 'vuex'
export const myMixin = {
  computed:{
    ...mapGetters(['playList'])
  },
  mounted(){
    this.watchPlayList(this.playList)
  },
  actived(){
    this.watchPlayList(this.playList)
  },
  watch:{
    playList(val){
      this.watchPlayList(val)
    }
  },
  methods:{
    watchPlayList(val){
      console.log('请添加watchPlaylist方法')
    }
  }
}
