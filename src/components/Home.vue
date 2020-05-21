<template>
<div>
  <section>
    <div class="container">
      <div class="content">
        <div class="service">
          <div class="search">
            <label for="search" class="search__label-search">
              <svg>
                <use v-bind:xlink:href="`${publicPath}img/icons/icons.svg#search`" />
              </svg>
            </label>
            <input 
              id="search" 
              type="tel"
              autocomplete="tel"
              v-phone
              class="search__input-search" 
              placeholder="Искать" 
              v-model="filter">
            <button class="search__btn-search">Найти</button>
            <button class="search__btn-reset" v-on:click="resetSearch()">
              <svg>
                <use v-bind:xlink:href="`${publicPath}img/icons/icons.svg#cancel`" />
              </svg>
            </button>
          </div>
          <div class="add">
            <router-link to="/add" class="add__btn-add">Добавить</router-link>
          </div>
        </div>
        <div class="table">
          <table>
            <tr class="table__header">
              <th>
                <span>Телефон</span>
              </th>
              <th class="col-nav">
                <span>Действия</span>
              </th>
            </tr>
            <tr class="table__body" v-if="paginatedData.length < 1">
              <td class="table__phone">Не найдено.</td>
              <td class="col-nav"></td>
            </tr>
            <tr 
              class="table__body"
              v-for="(phone, idx) in paginatedData" 
              :key="idx">
              <td class="table__phone" v-if="phone">+7 {{phone.number}}</td>
              <td class="col-nav">
                <button 
                  class="table__btn-edit"
                  v-if="phone"
                  v-on:click="goEditPhone(phone.id)"
                >
                  <svg>
                    <use v-bind:xlink:href="`${publicPath}img/icons/icons.svg#edit`"/>
                  </svg>
                </button>
                <button class="table__btn-delete" v-on:click="openDialog(phone)">
                  <svg>
                    <use v-bind:xlink:href="`${publicPath}img/icons/icons.svg#delete`" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr class="table__footer footer">
              <td class="footer__none">
                <div class="footer__str-mob">
                  <span>Строк на странице</span>
                  <select 
                    class="footer__quality-page" 
                    name="quality" 
                    id="qualityPage"
                    v-model="sizePage"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                  </select>
                </div>
              </td>
              <td class="col-nav">
                <div class="footer__str">
                  <span class="footer__quality-str">Строк на странице</span>
                  <select 
                    class="footer__quality-page" 
                    name="quality" 
                    id="qualityPage"
                    v-model="sizePage"
                    v-on:change="resetCountPage()"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                  </select>
                </div>
                <span class="footer__count-items">{{start + 1 >= 0 ? start + 1 : 0}}-{{end}} из {{countPhones}}</span>
                <button class="footer__btn-prev" v-on:click="prevPage()">
                  <svg>
                    <use v-bind:xlink:href="`${publicPath}img/icons/icons.svg#arrow`"/>
                  </svg>
                </button>
                <span class="footer__count-page">{{countP + 1}} из {{countMax > 0 ? countMax : 1}} </span>
                <button class="footer__btn-next" v-on:click="nextPage()">
                  <svg>
                    <use v-bind:xlink:href="`${publicPath}img/icons/icons.svg#arrow`" />
                  </svg>
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="dialog" id="dialog" v-bind:class="{ active: dialog }" v-on:click.stop="closeDialog($event)">
      <div class="dialog__wrap">
        <div class="dialog__title">Удалить?</div>
        <div class="dialog__actions">
          <button class="dialog__btn bg-green" v-on:click="removePhone()">Да</button>
          <button id="btn-close" class="dialog__btn bg-red">Нет</button>
        </div>
      </div>
    </div>
  </section>
</div>
</template>

<script>
export default {
  name: 'Home',
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
      sizePage: 25,
      filter: '',
      dialog: false,
      deletePhone: null,
      publicPath: process.env.BASE_URL
    }
  },
  computed: {
    phones () {
      if (this.filter.length > 0) {
        let phones = this.$store.getters.PHONES
        let filter = this.filter
        return phones.filter(function (elem) {
          return elem.number.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) > -1 ? true : false
        })
      } else {
        return this.$store.getters.PHONES
      }
    },
    countP () {
      return this.$store.getters.COUNT_PAGE
    },
    countPage () {
      return Math.ceil(this.countPhones / this.sizePage) - 1 >= this.countP
          ? this.countP
          : Math.ceil(this.countPhones / this.sizePage) - 1 < 0
          ? 0
          : Math.ceil(this.countPhones / this.sizePage) - 1;
    },
    countPhones() {
      return this.phones.length
    },
    start() {
      return this.countPage * this.sizePage < this.countPhones
        ? this.countPage * this.sizePage 
        : this.countPhones % this.sizePage === 0
        ? this.countPhones - this.sizePage > 0
          ? this.countPhones - this.sizePage 
          : -1
        : this.countPhones - (this.countPhones % this.sizePage);
    },
    end() {
      return this.start + this.sizePage * 1 < this.countPhones
        ? this.start + this.sizePage * 1
        : this.countPhones;
    },
    countMax () {
      return Math.ceil(this.countPhones / this.sizePage)
    },
    paginatedData() {          
      return this.phones.slice(this.start, this.end);
    },
    title () {
      this.$store.commit('SET_TITLE', 'Страница ' + Number(this.countP + 1) );
      if (this.countP === 0) {
        return 'Главная'
      } else {
        return 'Страница ' + Number(this.countP + 1) 
      }      
    },
  },
  methods: {
    goEditPhone(id) {
      this.$router.push({ name: "Add", query: { id: id } });
    },
    prevPage() {
      if (this.countP > 0) {
        let count = this.countP - 1
        this.$store.dispatch('setCountPage', count);
        this.$router.push({ path: `/page/${Number(count) + 1}`})
      }
    },
    nextPage() {
      if (
        this.countP + 1 <=
        Math.ceil(this.countPhones / this.sizePage) - 1
      ) {
        let count = this.countP + 1
        this.$store.dispatch('setCountPage', count);
        this.$router.push({ path: `/page/${Number(this.countP) + 1}`})
      }
    },
    resetSearch() {
      this.filter = ''
    },
    resetCountPage() {
      this.$store.dispatch("setCountPage", 0);
    },
    openDialog (phone) {
      this.deletePhone = phone
      this.dialog = true;
    },
    closeDialog (event) {
      if (event.target.id === 'dialog' || event.target.id === 'btn-close') {
        this.dialog = false;
      }
    },
    removePhone() {
      this.$store.dispatch('deletePhone', this.deletePhone);
      this.dialog = false;
      this.deleteTask = null;
    }
  },
  beforeUpdate() {
    if (this.id > this.countMax) {
      this.$store.dispatch("setCountPage", Number(this.countMax) - 1);
    }
  },
  mounted() {
    this.$store.dispatch('getPhones')
  } 
}
</script>