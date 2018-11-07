<template >
  <div class="singers" >
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <div class="list" v-for="(i,key,index) in singerlist.list" :key="index" ref="listGroup" >
          <div class="title" >{{key}}</div>
          <ul class="song_list">
            <li  v-for="(j, _key, _index) in i" :key="_index">
              <img :src="'https://y.gtimg.cn/music/photo_new/T001R300x300M000'+j.Fsinger_mid+'.jpg?max_age=2592000'">
              <a href="javascript:;">{{j.Fsinger_name}}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="index_list">
      <a href="javascript:;"
      :data-index="index"
      v-for="(i,index) in singerlist.index"
      :key="i.index"
      @touchstart="onShortcutStart"
      @touchmove.stop.prevent="onShortcutMove"
      :class="{'active': currentIndex === index}">
      {{i.name}}
    </a>
  </div>
  <div class="fixed" ref="fixed" v-show="fixedTitle">
    {{fixedTitle}}
  </div>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import axios from "axios";
export default {
  data () {
    return {
      touch:{},
      singerlist:{},
      scrollY: 0,
      currentIndex: 0
    }
  },
  created() {
    setTimeout(() => {
      this._initSrcoll()
      this._calculateHeight()
    },1000)
  },
  mounted() {
    this.getSlide()
    this.$nextTick(() => {
    })
  },
  computed:{
    fixedTitle (){
      if (this.scrollY > 0 || !this.singerlist.index) {
        return ''
      }else{
      return  this.singerlist.index[this.currentIndex].name ? this.singerlist.index[this.currentIndex].name : ''
      }
      // console.log(this.singerlist.index)
      // return this.singerlist.index[this.currentIndex] ? this.singerlist.index[this.currentIndex].title : ''
    }
  },
  methods:{
    _initSrcoll () {
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: 3,
        click: true
      })
      this.scroll.on('scroll', (pos) => {
        this.scrollY = pos.y
      })
    },
    // indexName:function(x,y){
    //   let q = [];
    //   let arr  = {};
    //   for(let i in x.index){
    //     var w = x.index[i].name;
    //     if(x.list.filter(x => x.Findex == w )){
    //       q.push(x.list.filter(x => x.Findex == w ))
    //       for(let i in q){
    //         arr[w] = q[i]
    //       }
    //     }
    //   }
    //   arr['热门'] = y;
    //   return arr;
    // },
    getSlide:function(){
      var _this = this;
      // axios.get("https://www.easy-mock.com/mock/5bc0180e462bc41c5d04610b/singerList").then(
      axios.get("https://www.easy-mock.com/mock/5bc0180e462bc41c5d04610b/demo").then(
        function(res){
          _this.singerlist = res.data;
          // _this.singerlist = res.data.data;
          // let data = res.data.data;
          // let hot = [];
          // for(let i in data.list){
          //   hot[i] = data.list[i];
          // }
          // hot = hot.slice(0,10);
          // let AZ = _this.indexName(data,hot);
          // _this.singerlist = {list:AZ,index:data.index}
          // console.log(_this.singerlist)
        }
      )
    },
    onShortcutStart (e) {
      // 获取到绑定的 index
      let index = e.target.getAttribute('data-index')
      // 使用 better-scroll 的 scrollToElement 方法实现跳转
      this.scrollToElement(index);
      // 记录一下点击时候的 Y坐标 和 index
      let firstTouch = e.touches[0].pageY
      this.touch.y1 = firstTouch
      this.touch.anchorIndex = index
    },
    onShortcutMove (e) {
      // 再记录一下移动时候的 Y坐标，然后计算出移动了几个索引
      let touchMove = e.touches[0].pageY
      this.touch.y2 = touchMove
      // 这里的 16.7 是索引元素的高度
      let delta = Math.floor((this.touch.y2 - this.touch.y1) / 16.7)
      // 计算最后的位置
      // * 1 是因为 this.touch.anchorIndex 是字符串，用 * 1 偷懒的转化一下
      let index = this.touch.anchorIndex * 1 + delta
      this.scrollToElement(index)
    },
    scrollToElement (index) {
      // 处理边界情况
      // 因为 index 通过滑动距离计算出来的
      // 所以向上滑超过索引框框的时候就会 < 0，向上就会超过最大值
      if (index < 0) {
        return
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // listHeight 是正的， 所以加个 -
      this.scrollY = -this.listHeight[index]
      this.scroll.scrollToElement(this.$refs.listGroup[index])
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newVal) {
      // 向下滑动的时候 newVal 是一个负数，所以当 newVal > 0 时，currentIndex 直接为 0
      if (newVal > 0) {
        this.currentIndex = 0
        return
      }
      // 计算 currentIndex 的值
      for (let i = 0; i < this.listHeight.length - 1; i++){
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (-newVal >= height1 && -newVal < height2) {
          this.currentIndex = i
          return
        }
      }
      // 当超 -newVal > 最后一个高度的时候
      // 因为 this.listHeight 有头尾，所以需要 - 2
      this.currentIndex = this.listHeight.length - 2
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import "~@/assets/less/variable.less";
.singers{
  color: #fff;
  .wrapper{
    position: fixed;
    top: 90px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .content{
      position: absolute;
      top:0;
      left: 0;
      width: 320px;
      height:auto;
      .list{
        .title{
          padding: 0 20px;
          height: 30px;
          line-height: 30px;
          background: @color-highlight-background;
          font-size: @font-size-small;
          color: @color-text-l
        }
        .song_list{
          height: auto;
          padding: 20px 0;
          li{
            &:nth-child(1){
              margin-top: 0;
            }
            margin-top: 20px;
            padding: 0 30px;
            display: flex;
            img{
              width:50px;
              height: 50px;
              border-radius: 50%;
            }
            a{
              font-size: @font-size-small;
              line-height: 50px;
              padding: 0 20px;
            }
          }
        }
      }
    }
  }
  .index_list{
    position: fixed;
    top: 50px;
    right: 0;
    width: 20px;
    padding: 18px 0;
    border-radius: 25px;
    background: @color-background-d;
    z-index: 100;
    .active{
      color:@color-theme;
    }
    a{
      text-align: center;
      display: block;
      height: 16px;
      overflow: hidden;
      display: block;
      line-height: 16px;
      font-size: 10px;
      &:nth-child(1){
        margin-top: 0;
      }
    }
  }
  .fixed{
    position: absolute;
    /* top: 0; */
    padding: 0 20px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: @color-highlight-background;
    font-size: @font-size-small;
    color: @color-text-l
  }
}

</style>
