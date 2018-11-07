import Vue from 'vue'
import App from './App'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import resource from 'vue-resource'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueAwesomeSwiper)
Vue.use(resource)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
