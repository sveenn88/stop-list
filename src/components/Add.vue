<template>
  <section>
  <div class="container">
    <div class="content">
      <div class="add-phone">
        <div class="search">
          <span>+7</span>
          <input 
            id="phone" 
            type="tel" 
            class="add-phone__input-phone"
            placeholder="(555) 555-55-55"
            autocomplete="tel"
            v-model="phone.number"
            v-phone
          >
          <button 
            class="add-phone__btn-add"
            :disabled="phone.number.length < 15"
            v-on:click="savePhone()"
          >
            <svg>
              <use v-bind:xlink:href="`${publicPath}img/icons/icons.svg#done`" />
            </svg>
          </button>
        </div>
      </div>
      <div class="add-phone__action">
        <router-link to="/" class="add-phone__btn-prev">Назад</router-link>
      </div>
    </div>
  </div>
</section>
</template>
<script>
export default {
  name: 'addPhone',
  metaInfo: function () {
    return { title: this.title }
  },
  props: {
    id: {
      default: null
    }
  },
  data: function () {
    return {
      newPhone: { number: '' },
      publicPath: process.env.BASE_URL
    }
  },
  computed: {
    title () {
      if (this.id) {
        this.$store.commit('SET_TITLE', 'Редактирование телефона');
      } else {
        this.$store.commit('SET_TITLE', 'Добавление телефона');
      }
      return this.$store.getters.TITLE
    },
    phone () {
      if (this.id) {
        if (this.$store.getters.PHONE_BY_ID(this.id)) {
          return this.$store.getters.PHONE_BY_ID(this.id)
        }
      }
      return this.newPhone
    },
  },
  methods: {
    savePhone() {
      if (this.phone.createdAt) {
        this.$store.dispatch('updatePhone', this.phone)
      } else {
        const phone = {number: `${this.phone.number}`, createdAt: new Date()}
        this.$store.dispatch('addPhone', phone)
      }
      this.newPhone = { number: '' }
    }
  },
  mounted() {
    this.$store.dispatch('getPhones')
  },
}
</script>
