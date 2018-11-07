import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    playList:[],
    fullScreen:false,
    playing:false,
    currentIndex:-1,
    mode:0
  },
  getters:{
    playList:state=>state.playList,
    fullScreen:state=>state.fullScreen,
    playing:state=>state.playing,
    currentIndex:state=>state.currentIndex,
    currentSong:state=>state.playList[state.currentIndex]||{},
    mode:state=>state.mode,
  },
  mutations:{
    changePlayList(state,playList){
      state.playList = playList
    },
    changeFullScreen(state,fullScreen){
      state.fullScreen = fullScreen
    },
    changePlaying(state,playing){
      state.playing = playing
    },
    changeCurrentIndex(state,currentIndex){
      state.currentIndex = currentIndex
    },
    changeMode(state,mode){
      state.mode = mode
    },
  },
  actions:{
    addPlayer({commit},{list,index,mode}){
      commit('changePlayList',list)
      commit('changeFullScreen',true)
      commit('changePlaying',true)
      commit('changeCurrentIndex',index)
    },
    delOne({commit,state},item){
      let index = 0;
      let playlist = state.playList
      let currentindex = state.currentIndex
      for(let i=0 ; i< playlist.length; i++){
        if(playlist[i].id == item.id){
          index = i
        }
      }
      if(currentindex === playlist.length){
        currentindex --
      }
      playlist.splice(index,1)
      commit('changePlayList',playlist)
      commit('changePlaying',true)
      commit('changeCurrentIndex',currentindex)
    },
    clear({commit}){
      commit('changePlaying',false)
      commit('changePlayList',[])
      commit('changeCurrentIndex',-1)
    }
  }
})
