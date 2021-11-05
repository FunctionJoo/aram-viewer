<template>
  <Header />
  <Index />
</template>

<script>
import Header from './components/Header.vue';
import Index from './components/index.vue';

export default {
  name: 'App',
  components: {
    Header,
    Index
  }
}
</script>

<style>
@import './assets/reset.css';
@import './assets/root.css';

#app {
  font-family: 'Noto Sans KR', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
}
</style>
