import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Add from '../components/Add.vue'
import store from "../store/index";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });

Vue.use(VueRouter)

  const routes = [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/page/:id",
      props: true,
      name: "Page",
      component: Home,
    },
    {
      path: "/add",
      props: (x) => x.query,
      name: "Add",
      component: Add,
    },
  ];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  if (to.params.id) {
    store.dispatch("setCountPage", Number(to.params.id) - 1);
  } else {
    store.dispatch("setCountPage", 0);
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router
