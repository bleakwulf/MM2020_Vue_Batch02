<template>
  <div id="app">
    <div class="container">
      <!-- <div class="h-spacer"></div> -->
      <div class="main-content">
        <router-view></router-view>
      </div>
      <!-- <div class="h-spacer"></div> -->
    </div>
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

  input:focus, 
  select:focus {
    /* outline: none !important; */
    box-shadow: none !important;
  }
  
  input::placeholder, 
  textarea::placeholder {
    font-size: 12px;
    color: #495057;
    opacity: 35%;
  }

  #app {
    /* font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center; */
    color: #2c3e50;
  }

  .container {
      display: flex;
      flex-flow: row nowrap;
      height: 100vh !important;
  }

  .h-spacer {
      flex-grow: 1;
  }

  .main-content {
    padding: 20px;
    flex-grow: 1;
    flex-basis: 45%;
    height: 100%;
  }
  
  .error {    
      width: 100%;
      margin: 0.25rem;
      font-size: 65%;
      color: #dc3545;
      text-align: left    
  }

  .action-buttons button:not(:first-child) {
      margin-left: 10px;
  }
</style>
