import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  // Настройки подключения к базе
  apiKey: "#", // Например IzaSyBUgJ9WVsuSg0JBxFLioS3dVhnY1JFqcbIA
  authDomain: "#", // Например test.firebaseapp.com
  databaseURL: "#", // Например https://test.firebaseio.com
  projectId: "#", // Например test
  storageBucket: "#", // Например test.appspot.com
  messagingSenderId: "#", // Например 0848967013451
  appId: "#", // Например 1:084896701345:web:0ea76c432d088d9a8939e01
};
const db = firebase.initializeApp(firebaseConfig).firestore();

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    title: "",
    countPage: 0,
    phones: [],
    loading: null,
    success: null,
    error: null,
  },
  mutations: {
    SET_COUNT_PAGE(state, count) {
      state.countPage = count;
    },
    SET_TITLE(state, title) {
      if (!title) {
        return;
      }
      state.title = title;
    },
    SET_ERROR(state, error) {
      state.error = error;
      setTimeout(() => {
        state.error = null;
      }, 2000);
    },
    SET_SUCCESS(state, success) {
      state.success = success;
      setTimeout(() => {
        state.success = null;
      }, 2000);
    },
    ...vuexfireMutations,
  },
  actions: {
    setCountPage({ commit }, count) {
      commit("SET_COUNT_PAGE", count);
    },
    getPhones: firestoreAction(({ state, commit, bindFirestoreRef }) => {
      bindFirestoreRef(
        "stop-list",
        db.collection("phones").orderBy("createdAt", "desc")
      )
        .then((res) => {
          state.phones = res;
        })
        .catch((err) => {
          commit("SET_ERROR", err.message);
        });
    }),
    addPhone: firestoreAction(({ commit }, phone) => {
      db.collection("phones")
        .add(phone)
        .then(() => {
          commit("SET_SUCCESS", "Добавил!");
        })
        .catch((err) => {
          commit("SET_ERROR", err.message);
        });
    }),
    updatePhone: firestoreAction(({ commit }, phone) => {
      db.collection("phones")
        .doc(phone.id)
        .update({ number: phone.number })
        .then(() => {
          commit("SET_SUCCESS", "Обновил!");
        })
        .catch((err) => {
          commit("SET_ERROR", err.message);
        });
    }),
    deletePhone: firestoreAction(({ commit }, phone) => {
      db.collection("phones")
        .doc(phone.id)
        .delete()
        .then(() => {
          commit("SET_SUCCESS", "Удалил!");
        })
        .catch((err) => {
          commit("SET_ERROR", err.message);
        });
    }),
  },
  getters: {
    COUNT_PAGE(state) {
      return state.countPage;
    },
    TITLE(state) {
      return state.title;
    },
    PHONES(state) {
      return state.phones;
    },
    PHONE_BY_ID(state) {
      return (id) => {
        return state.phones.find((phones) => phones.id === id);
      };
    },
    SUCCESS(state) {
      return state.success;
    },
    LOADING(state) {
      return state.loading;
    },
    ERROR(state) {
      return state.error;
    },
  },
});
