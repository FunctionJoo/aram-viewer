import { createApp } from 'vue';
import App from './App.vue';
import { createStore } from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios';

const store = createStore({
  state() {
    return {
      sampleData: '응애'
    };
  },
  mutations: {
    sample(state) {
      console.log(state.sampleData);
    }
  }
});

createApp(App).use(store).use(VueAxios, axios).mount('#app');
