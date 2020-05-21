import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMeta from "vue-meta";

import '../node_modules/nprogress/nprogress.css'

Vue.config.productionTip = true
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});

Vue.directive("phone", {
  bind(el) {
    el.oninput = function(e) {
      if (!e.isTrusted) {
        return;
      }
      let x = this.value
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      this.value = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "") + (x[4] ? "-" + x[4] : "");
      el.dispatchEvent(new Event("input"));
    };
  },
});

new Vue({
  metaInfo: () => ({
    title: 'Главная',
    titleTemplate: '%s | Stop-List',
  }),
  router,
  store,
  render: h => h(App)
}).$mount('#app')
