import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { SocketIoService } from './services/socketIo.service'

//Import for CSS goes here, e.g. impot './scss/main.sass'

Vue.config.productionTip = false

Vue.prototype.$socketIo = SocketIoService.socketIo;

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
