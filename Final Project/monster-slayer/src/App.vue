<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  // components: {
  // }
  // data() {
  //   return {
  //     apiBaseUrl: process.env.VUE_APP_API_BASEURL
  //   }
  // }
}
</script>

<style>
  html {
      font-family: Monospace, Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
  }

  ::-webkit-scrollbar {
      width: 0px;
      background: transparent; /* make scrollbar transparent */
  }

  #app {
    /* font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center; */
    color: #2c3e50;
    margin-top: 60px;
  }
  
  .error {    
      width: 100%;
      margin: 0.25rem;
      font-size: 65%;
      color: #dc3545;
      text-align: left    
  }
</style>
