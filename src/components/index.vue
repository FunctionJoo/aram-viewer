<template>
  <div class="sample">
    <button @click="axiosTest">Axios Test</button>
    <div id="result" v-bind="result"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: ''
    }
  },
  methods: {
    axiosTest() {
      // const optionAxios = {
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //     'Access-Control-Allow-Origin': '*',
      //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      //     'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
      //   }
      // };

      //this.axios.defaults.baseURL = 'http://www.op.gg/';
      this.axios({
        method: 'get',
        url: '/aram/ajax/statistics/runeList/championId=79&modeType=450&primaryPerkId=8229&subPerkStyleId=8100&'
        //url: 'https://cors-anywhere.herokuapp.com/'+'http://www.op.gg/aram/ajax/statistics/runeList/championId=79&modeType=450&primaryPerkId=8229&subPerkStyleId=8100&', optionAxios
      }).then((response) => {
        console.log(response.data)
        document.querySelector('#result').innerHTML = response.data;
      });
    }
  }
}
</script>

<style>
.sample {
  font-size: 20px;
  font-weight: 700;
}
</style>