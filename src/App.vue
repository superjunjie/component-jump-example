<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <Inspector></Inspector>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Inspector from '../vue-inspector-tool/Inspector.vue'
export default {
  name: 'App',
  components: {
    HelloWorld,
    Inspector
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
