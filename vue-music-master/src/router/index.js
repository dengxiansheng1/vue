import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/views/recommend/index'
import Singers from '@/views/singers/index'
import Search from '@/views/search/index'
import Rank from '@/views/rank/index'
import RecommendDetails from '@/views/recommend/details'
import SingersDetails from '@/views/singers/details'
// import SearchDetails from '@/views/search/details'
import RankDetails from '@/views/rank/details'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/recommend',
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[
        {
          path:'/recommend/:id',
          component: RecommendDetails
        }
      ]
    },
    {
      path: '/singers',
      component: Singers,
      children:[
        {
          path:'/singers/:id',
          component: SingersDetails
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children:[
        {
          path:'/rank/:id',
          component: RankDetails
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      // children:[
      //   {
      //     path:'/search/:k',
      //     component: SearchDetails
      //   }
      // ]
    },
  ]
})
