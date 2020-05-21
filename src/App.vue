<template>
  <div class="wrapper" id="app">
    <header class="header">
      <div class="container">
        <div class="name-progect">
          <span>Стоп-лист</span>
        </div>
        <div class="bread">
          <ul>
            <li>
              <router-link to="/">Главная</router-link>
            </li>
            <li>
              <a href="" class="active">{{title}} </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <section>
      <div class="error" v-bind:class="{ active: error }">
        <div class="error__title">{{error}}</div>
      </div>
    </section>
    <section>
      <div class="success" v-bind:class="{ active: success }">
        <div class="success__title">{{success}}</div>
      </div>
    </section>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'Stop-List',
  data: function () {
    return {
      publicPath: process.env.BASE_URL
    }
  },
  computed: {
    countPage () {
      return this.$store.getters.COUNT_PAGE
    },
    loading () {
      return this.$store.getters.LOADING
    },
    success () {
      return this.$store.getters.SUCCESS
    },
    error () {
      return this.$store.getters.ERROR
    },
    title () {
      return this.$store.getters.TITLE
    },
    menuShow () {
      return this.$store.getters.MENU_SHOW
    }
  },
  methods: {
    goHome() {
      this.$router.push({ path: "/"});
    },
    showMenu: function () {
      this.$store.commit('SET_MENU_SHOW');
    },
    showService: function () {
      this.$store.commit('SET_SERVICE_SHOW');
    }
  }
}
</script>
<style>
  @import '../public/css/style.min.css';
</style>
